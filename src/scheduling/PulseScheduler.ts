import { system } from "@minecraft/server";
import { Logger } from "../Logging";

const log: Logger = Logger.getLogger("PulseScheduler", "bedrock-boost", "pulse-scheduler");

/**
 * Represents a scheduler that executes a processor function at regular intervals for each item in the list.
 * @template T The type of items in the scheduler.
 */
export default class PulseScheduler<T> {
  protected items: T[] = [];
  private period: number;
  private currentTick: number = 0;
  private runId?: number;
  private nextIndex: number = 0;
  private executionSchedule: number[] = [];
  processor: (t: T) => void;

  /**
   * Creates a new PulseScheduler instance.
   * @param period The period of the scheduler.
   */
  constructor(processor: (t: T) => void, period: number) {
    if (period <= 0) {
      throw new Error("Period must be a positive integer.");
    }
    if (!processor || typeof processor !== "function") {
      throw new Error("Processor function must be defined.");
    }
    this.period = period;
    this.processor = processor;
  }

  /**
   * Adds an item to the schedule.
   * @param item The item to be added.
   * @deprecated Use `push` instead.
   */
  add(item: T) {
    this.push(item);
  }

  /**
    * Adds multiple items to the schedule.
    * 
    * @param items - The items to be added.
    * @deprecated Use `push` instead.
    */
  addAll(items: T[]) {
    this.push(...items);
  }

  /**
   * Removes an item from the schedule at the specified index.
   * @param index - The index of the item to remove.
   */
  remove(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      // Adjust nextTaskIndex if necessary to maintain execution order
      if (index < this.nextIndex) {
        this.nextIndex--;
      }
      this.recalculateExecutionSchedule();
    }
  }

  /**
   * Removes items from the schedule that satisfy the given predicate.
   * 
   * @param predicate - The predicate function used to determine if an item should be removed.
   */
  removeIf(predicate: (t: T) => boolean) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (predicate(this.items[i])) {
        this.remove(i);
      }
    }
  }

  /**
   * Returns a list of the items in the schedule.
   */
  getItems(): ReadonlyArray<T> {
    return this.items;
  }

  /**
   * Starts the schedule.
   */
  start() {
    this.stop();
    this.currentTick = 0;
    this.nextIndex = 0;
    this.runId = system.runInterval(() => this.tick(), 1);
  }

  /**
   * Stops the schedule.
   */
  stop() {
    if (this.runId !== undefined) {
      system.clearRun(this.runId);
      this.runId = undefined;
    }
  }

  private recalculateExecutionSchedule() {
    // Calculate the number of executions per tick
    const totalExecutions = this.items.length;
    this.executionSchedule = new Array(this.period).fill(0);
    if (totalExecutions === 0) {
      return;
    }
    const interval = this.period / totalExecutions;
    for (let i = 0; i < totalExecutions; i++) {
      this.executionSchedule[Math.round(interval * i) % this.period]++;
    }
  }

  private tick() {
    if (this.items.length === 0) {
      log.trace("No items to process.");
      return;
    }
    // Number of items to process this tick
    const scheduledExecutions = this.executionSchedule[this.currentTick];
    if (scheduledExecutions === 0) {
      log.trace("No items to process this tick.");
      // Increment the tick counter
      this.currentTick = (this.currentTick + 1) % this.period;
      // Reset the index if we're at the end of the period
      if (this.currentTick === 0) {
        this.nextIndex = 0;
      }
      return;
    }
    // Execution counter for this tick
    let executed = 0;

    // Process items according to the schedule
    // If we reach the end of the list without having correct number of executions, stop. 
    // It's most likely caused by an item being removed.
    for (; this.nextIndex < this.items.length && executed < scheduledExecutions; this.nextIndex++) {
      try {
        this.processor(this.items[this.nextIndex]);
      } catch (e) {
        log.error("Error processing item", e);
      }
      executed++;
    }

    // Increment the tick counter
    this.currentTick = (this.currentTick + 1) % this.period;

    // Reset the index if we're at the end of the period
    if (this.currentTick === 0) {
      this.nextIndex = 0;
    }
  }

  push(...items: T[]): number {
    this.items.push(...items);
    this.recalculateExecutionSchedule();
    return this.items.length;
  }

  pop(): T | undefined {
    const item = this.items.pop();
    this.recalculateExecutionSchedule();
    return item;
  }

  shift(): T | undefined {
    const item = this.items.shift();
    this.recalculateExecutionSchedule();
    return item;
  }

  unshift(...items: T[]): number {
    this.items.unshift(...items);
    this.recalculateExecutionSchedule();
    return this.items.length;
  }

  splice(start: number, deleteCount?: number): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[];
  splice(start: number, deleteCount: number = 0, ...items: T[]): T[] {
    const removed = this.items.splice(start, deleteCount, ...items);
    this.recalculateExecutionSchedule();
    return removed;
  }

}