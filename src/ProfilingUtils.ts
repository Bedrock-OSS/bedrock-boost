import { system } from '@minecraft/server';

let runId = -1;

/**
 * Schedules a dummy function each tick to fix the issues with the profiler.
 * Somehow the profiler adds the idle time waiting for the next tick to the last
 * function that was called. This is a workaround to fix that.
 *
 * Ensure, that you call this function so that the `system.runInterval` inside will
 * run the dummy function always as the last function in a tick.
 *
 * The call that was chosen to be the dummy function is `system.currentTick`.
 */
export function addIdleDummy() {
    if (runId !== -1) return;
    runId = system.runInterval(idle, 1);
}

function idle() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dummy = system.currentTick;
}

/**
 * Clears the dummy function that was scheduled by `addIdleDummy`.
 */
export function clearIdleDummy() {
    if (runId === -1) return;
    system.clearRun(runId);
}
