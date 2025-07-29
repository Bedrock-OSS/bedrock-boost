import PulseScheduler from './PulseScheduler';

/**
 * Represents a scheduler for executing tasks.
 */
export default class TaskPulseScheduler extends PulseScheduler<() => void> {
    /**
     * Creates a new TaskSchedule instance.
     * @param period The period of the schedule.
     */
    constructor(period: number) {
        super((task) => task(), period);
    }
}
