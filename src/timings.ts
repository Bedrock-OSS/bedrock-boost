/**
 * A simple class to measure the time it takes to perform an operation.
 */
export default class Timings {
  static lastTime = -1;
  static lastOperation = "";

  /**
   * Begin measuring the time it takes to perform an operation.
   * @remarks
   * If another operation is already being measured, the measurement will be ended.
   * 
   * @param operation The name of the operation.
   */
  static begin(operation: string) {
    this.end();
    this.lastTime = new Date().getTime();
    this.lastOperation = operation;
  }

  /**
   * End measuring the time it takes to perform an operation and log the result.
   * @remarks
   * If no operation is being measured, this method will do nothing.
   */
  static end() {
    const time = new Date().getTime();
    if (this.lastTime > 0) {
      console.log(`[Measure] Operation ${this.lastOperation} took ${time - this.lastTime}ms`);
    }
    this.lastTime = -1;
  }
}