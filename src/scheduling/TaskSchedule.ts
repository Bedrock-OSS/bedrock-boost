import Schedule from "./Schedule";

/**
 * Represents a schedule for executing tasks.
 */
export default class TaskSchedule extends Schedule<() => void> {
  /**
   * Creates a new TaskSchedule instance.
   * @param period The period of the schedule.
   */
  constructor(period: number) {
    super(task => task(), period);
  }
}