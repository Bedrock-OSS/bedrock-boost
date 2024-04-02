import PulseScheduler from "./PulseScheduler";

/**
 * Represents a PulseScheduler that only adds unique items to the schedule.
 */
export default class UniquePulseScheduler<T> extends PulseScheduler<T> {
  
  /**
   * Creates a new UniquePulseScheduler instance.
   * @param period The period of the scheduler.
   */
  constructor(processor: (t: T) => void, period: number, private equalityFunction: (a: T, b: T) => boolean = (a, b) => a === b){
    super(processor, period);
  }


  add(item: T) {
    if (this.items.some((i) => this.equalityFunction(i, item))) {
      return;
    }
    super.add(item);
  }

  addAll(items: T[]): void {
    const newItems = items.filter((i) => !this.items.some((j) => this.equalityFunction(i, j)));
    if (newItems.length === 0) {
      return;
    }
    super.addAll(newItems);
  }

}