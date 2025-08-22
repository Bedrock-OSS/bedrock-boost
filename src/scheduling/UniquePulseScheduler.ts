import PulseScheduler from './PulseScheduler';

/**
 * Represents a PulseScheduler that only adds unique items to the schedule.
 */
export default class UniquePulseScheduler<T> extends PulseScheduler<T> {
    /**
     * Creates a new UniquePulseScheduler instance.
     * @param period The period of the scheduler.
     */
    constructor(
        processor: (t: T) => void,
        period: number,
        private equalityFunction: (a: T, b: T) => boolean = (a, b) => a === b
    ) {
        super(processor, period);
    }

    push(...items: T[]): number {
        const filtered = items.filter(
            (item) =>
                !this.items.some((existingItem) =>
                    this.equalityFunction(existingItem, item)
                )
        );
        return super.push(...filtered);
    }

    unshift(...items: T[]): number {
        const filtered = items.filter(
            (item) =>
                !this.items.some((existingItem) =>
                    this.equalityFunction(existingItem, item)
                )
        );
        return super.unshift(...filtered);
    }

    splice(start: number, deleteCount?: number | undefined): T[];
    splice(start: number, deleteCount: number, ...items: T[]): T[];
    splice(start: number, deleteCount?: number, ...items: T[]): T[] {
        if (deleteCount === void 0) {
            return super.splice(start);
        }
        const filtered = items.filter(
            (item) =>
                !this.items.some((existingItem) =>
                    this.equalityFunction(existingItem, item)
                )
        );
        return super.splice(start, deleteCount, ...filtered);
    }
}
