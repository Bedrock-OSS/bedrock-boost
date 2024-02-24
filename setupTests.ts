import { RawMessage } from "@minecraft/server";
import { LogLevel, Logger } from "./src/Logging";

jest.mock('@minecraft/server', () => {
  return {
    Direction: {
      Down: 'Down',
      East: 'East',
      North: 'North',
      South: 'South',
      Up: 'Up',
      West: 'West',
    },
    system: {
      afterEvents: {
        scriptEventReceive: {
          subscribe: jest.fn(),
        }
      },
      clearRun: (id:number) => {
        clearInterval(id);
        clearTimeout(id);
      },
      run: (callback: () => void) => {
        return setTimeout(callback, 50);
      },
      runInterval: (callback: () => void, tickInterval?: number): number => {
        return setInterval(callback, tickInterval || 1)[Symbol.toPrimitive]();
      },
      runTimeout: (callback: () => void, tickDelay?: number): number => {
        return setTimeout(callback, tickDelay || 1)[Symbol.toPrimitive]();
      },
    },
    world: {
      sendMessage: (message: (RawMessage | string)[] | RawMessage | string): void => {
        console.log(message);
      }
    }
  };
}, { virtual: true });
Logger.getOutputConfig()[LogLevel.Trace.level] = [];
Logger.getOutputConfig()[LogLevel.Debug.level] = [];
Logger.getOutputConfig()[LogLevel.Info.level] = [];
Logger.getOutputConfig()[LogLevel.Warn.level] = [];
Logger.getOutputConfig()[LogLevel.Error.level] = [];
Logger.getOutputConfig()[LogLevel.Fatal.level] = [];