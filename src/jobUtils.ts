import { system } from "@minecraft/server";
import { Logger } from "./logging";

const log = Logger.getLogger("jobUtils", "bedrock-boost", "jobUtils");

/**
 * Runs a job and returns a promise that resolves when the job is done.
 * @param generator The generator function to run.
 * @returns A promise that resolves when the job is done.
 * @example
 * ```ts
 * const dimension = world.getDimension(MinecraftDimensionTypes.overworld);
 * function* generator(startLocation: Vec3): Generator<void, Block | undefined, void> {
 *   for (let x = 0; x < 10; x++) {
 *     for (let z = 0; z < 10; z++) {
 *       for (let y = 0; y < 10; y++) {
 *         const location = startLocation.add(x, y, z);
 *         const block = dimension.getBlock(location);
 *         if (block && block.isSolid) {
 *           return block;
 *         }
 *         yield;
 *       }
 *     }
 *   }
 * }
 * jobPromise(generator(Vec3.from(0, 0, 0)))
 *   .then(console.log);
 * ```
 */
export function jobPromise<Result>(generator: Generator<void, Result, void>): Promise<Result> {
  return new Promise((resolve, reject) => {
    if (system.runJob) {
      system.runJob(function* () {
        while (true) {
          try {
            const { done: d, value } = generator.next();
            if (d) {
              resolve(value as Result);
              return;
            } else {
              yield;
            }
          } catch (err) {
            reject(err);
            return;
          }
        }
      }());
    } else {
      log.warn("system.runJob is not available. Running job in an inefficient way.");
      function run() {
        const startTime = Date.now();
        while (true) {
          try {
            const { done: d, value } = generator.next();
            if (d) {
              resolve(value as Result);
              return;
            } else {
              if (Date.now() - startTime > 4) {
                system.runTimeout(run, 1);
                return;
              }
            }
          } catch (err) {
            reject(err);
            return;
          }
        }
      }
      run();
    }
  });
}

/**
 * Runs a job and returns a promise that resolves when the job is done. The promise also reports progress once per tick.
 * @param generator The generator function to run.
 * @param onProgress The function to call when progress is reported.
 * @returns A promise that resolves when the job is done.
 * @example
 * ```ts
 * const dimension = world.getDimension(MinecraftDimensionTypes.overworld);
 * function* generator(startLocation: Vec3): Generator<number, Block | undefined, void> {
 *   const total = 10 * 10 * 10;
 *   for (let x = 0; x < 10; x++) {
 *     for (let z = 0; z < 10; z++) {
 *       for (let y = 0; y < 10; y++) {
 *         const location = startLocation.add(x, y, z);
 *         const block = dimension.getBlock(location);
 *         if (block && block.isSolid) {
 *           return block;
 *         }
 *         yield (x * 10 * 10 + z * 10 + y) / total;
 *       }
 *     }
 *   }
 * }
 * jobProgressPromise(generator(Vec3.from(0, 0, 0)), console.log)
 *   .then(console.log);
 * ```
 */
export function jobProgressPromise<Progress, Result>(generator: Generator<Progress, Result, void>, onProgress: (progress: Progress) => void): Promise<Result> {
  return new Promise((resolve, reject) => {
    if (system.runJob) {
      system.runJob(function* () {
        let lastTick = 0;
        while (true) {
          try {
            const { done: d, value } = generator.next();
            if (d) {
              resolve(value as Result);
              return;
            } else {
              // Limit progress updates to once per tick.
              if (system.currentTick !== lastTick) {
                onProgress(value as Progress);
                lastTick = system.currentTick;
              }
              yield;
            }
          } catch (err) {
            reject(err);
            return;
          }
        }
      }());
    } else {
      log.warn("system.runJob is not available. Running job in an inefficient way.");
      function run() {
        const startTime = Date.now();
        let sentProgress = false;
        while (true) {
          try {
            const { done: d, value } = generator.next();
            if (d) {
              resolve(value as Result);
              return;
            } else {
              // Limit progress updates to once per tick.
              if (!sentProgress) {
                onProgress(value as Progress);
                sentProgress = true;
              }
              if (Date.now() - startTime > 4) {
                system.runTimeout(run, 1);
                return;
              }
            }
          } catch (err) {
            reject(err);
            return;
          }
        }
      }
      run();
    }
  });
}