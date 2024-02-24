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
    scheduler.addAll([1, 2, 3, 4, 5]);
    scheduler.start();
    jest.advanceTimersByTime(10);
    expect(mockProcessor).toHaveBeenCalledTimes(5);
    expect(mockProcessor).toHaveBeenNthCalledWith(1, 1);
    expect(mockProcessor).toHaveBeenNthCalledWith(2, 2);
    expect(mockProcessor).toHaveBeenNthCalledWith(3, 3);
    expect(mockProcessor).toHaveBeenNthCalledWith(4, 4);
    expect(mockProcessor).toHaveBeenNthCalledWith(5, 5);
  });
});