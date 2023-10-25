import { world } from "@minecraft/server"

const originalConsoleLog = console.log;
const consoleLogPolyfill = (...args: any[]) => {
  originalConsoleLog(...args);
  const message = args.join(' ');
  world.sendMessage(message);
};
console.log = consoleLogPolyfill;