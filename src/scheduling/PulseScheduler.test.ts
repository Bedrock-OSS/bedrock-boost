import PulseScheduler from './PulseScheduler';

describe('PulseScheduler', () => {
  let scheduler: PulseScheduler<number>;
  let mockProcessor: jest.Mock<void, [number]>;

  beforeEach(() => {
    jest.useFakeTimers();
    mockProcessor = jest.fn();
    scheduler = new PulseScheduler(mockProcessor, 10);
  });

  afterEach(() => {
    scheduler.stop();
    jest.clearAllTimers();
  });

  function prepareData(size: number): number[] {
    const data: number[] = [];
    for (let i = 0; i < size; i++) {
      data.push(i + 1);
    }
    return data;
  }

  function ensureExecution(data: number[]): void {
    expect(mockProcessor).toHaveBeenCalledTimes(data.length);
    for (let i = 0; i < data.length; i++) {
      expect(mockProcessor).toHaveBeenNthCalledWith(i + 1, data[i]);
    }
  }

  it('should add an item to the schedule', () => {
    scheduler.add(1);
    expect(scheduler.getItems()).toEqual([1]);
  });

  it('should add multiple items to the schedule', () => {
    scheduler.addAll([1, 2, 3]);
    expect(scheduler.getItems()).toEqual([1, 2, 3]);
  });

  it('should remove an item from the schedule', () => {
    scheduler.addAll([1, 2, 3]);
    scheduler.remove(1);
    expect(scheduler.getItems()).toEqual([1, 3]);
  });

  it('should remove items from the schedule based on a predicate', () => {
    scheduler.addAll([1, 2, 3, 4, 5]);
    scheduler.removeIf((item) => item % 2 === 0);
    expect(scheduler.getItems()).toEqual([1, 3, 5]);
  });

  it('should start and stop the schedule', () => {
    scheduler.start();
    expect(scheduler['runId']).toBeDefined();
    scheduler.stop();
    expect(scheduler['runId']).toBeUndefined();
  });

  it('should recalculate the execution schedule', () => {
    scheduler.addAll([1, 2, 3, 4, 5]);
    expect(scheduler['executionSchedule']).toEqual([1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
  });

  it('should process items according to the schedule', () => {
    const data = prepareData(5);
    scheduler.addAll(data);
    scheduler.start();
    jest.advanceTimersByTime(10);
    ensureExecution(data);
  });

  it('should not process items if the schedule is stopped', () => {
    const data = prepareData(5);
    scheduler.addAll(data);
    scheduler.start();
    scheduler.stop();
    jest.advanceTimersByTime(10);
    expect(mockProcessor).not.toHaveBeenCalled();
  });

  it('should not process items if the schedule is empty', () => {
    scheduler.start();
    jest.advanceTimersByTime(10);
    expect(mockProcessor).not.toHaveBeenCalled();
  });

  it('should spread processing evenly across ticks', () => {
    const data = prepareData(10);
    scheduler.addAll(data);
    scheduler.start();
    jest.advanceTimersByTime(10);
    ensureExecution(data);
  });

  it('should handle a large number of items', () => {
    const data = prepareData(100);
    scheduler.addAll(data);
    scheduler.start();
    jest.advanceTimersByTime(10);
    ensureExecution(data);
  });

  it('should handle odd numbers of items compared to the tick interval', () => {
    const data = prepareData(13);
    scheduler.addAll(data);
    scheduler.start();
    jest.advanceTimersByTime(10);
    ensureExecution(data);
  });
});