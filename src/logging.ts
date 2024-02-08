import { system, world } from "@minecraft/server"
import ChatColor from "./chatColor";
import ColorJSON from "./colorJson";

/**
 * The `LogLevel` class defines the various logging levels used by the logger.
 */
export class LogLevel {
  static All: LogLevel = new LogLevel(-2, 'all');
  static Trace: LogLevel = new LogLevel(-2, 'trace', ChatColor.DARK_AQUA);
  static Debug: LogLevel = new LogLevel(-1, 'debug', ChatColor.AQUA);
  static Info: LogLevel = new LogLevel(0, 'info', ChatColor.GREEN);
  static Warn: LogLevel = new LogLevel(1, 'warn', ChatColor.GOLD);
  static Error: LogLevel = new LogLevel(2, 'error', ChatColor.RED);
  static Fatal: LogLevel = new LogLevel(3, 'fatal', ChatColor.DARK_RED);
  static Off: LogLevel = new LogLevel(100, 'off');

  /**
   * The list of all available log levels.
   */
  static values = [
    LogLevel.All,
    LogLevel.Trace,
    LogLevel.Debug,
    LogLevel.Info,
    LogLevel.Warn,
    LogLevel.Error,
    LogLevel.Fatal,
    LogLevel.Off
  ]

  /**
   * The constructor for each log level.
   *
   * @param {number} level - The numerical level for this logger.
   * @param {string} name - The string name for this logger.
   * @param {ChatColor} color - The color to use for this logger. Defaults to `ChatColor.RESET`.
   */
  private constructor(public level: number, public name: string, public color: ChatColor = ChatColor.RESET) { }

  /**
   * Return the logging level as a string.
   *
   * @returns {string} The string representation of the logging level.
   */
  public toString(): string {
    return this.color + this.name.toUpperCase() + ChatColor.RESET;
  }

  /**
   * Parse a string to get the corresponding `LogLevel`.
   *
   * @param {string} str - The string to parse.
   * @returns {LogLevel} The corresponding `LogLevel`, or `undefined` if none was found.
   */
  static parse(str: string): LogLevel | undefined {
    str = str.toLowerCase();
    for (const level of LogLevel.values) {
      if (level.name === str) return level;
    }
    // check if it is a number
    const num = parseInt(str);
    if (!isNaN(num)) {
      for (const level of LogLevel.values) {
        if (level.level === num) return level;
      }
    }
    return undefined;
  }
}

/**
* Function to match the provided string to the given pattern.
*
* @param {string} pattern - The pattern to match.
* @param {string} str - The string to match the pattern against.
* @returns {boolean} return true if the pattern matches, else returns false.
*/
function starMatch(pattern: string, str: string): boolean {
  if (pattern === '*') return true
  if (pattern.includes('*')) {
    if (pattern.startsWith('*')) {
      return str.endsWith(pattern.substring(1))
    }
    if (pattern.endsWith('*')) {
      return str.startsWith(pattern.substring(0, pattern.length - 1))
    }
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    return regex.test(str)
  }
  return pattern === str
}

type LoggingSettings = {
  filter: string[],
  level: LogLevel,
  formatFunction: (level: LogLevel, logger: Logger, message: string) => string
  messagesJoinFunction: (messages: string[]) => string
  jsonFormatter: ColorJSON
}

const loggingSettings: LoggingSettings = {
  level: LogLevel.Info,
  filter: ['*'],
  formatFunction: (level: LogLevel, logger: Logger, message: string) => {
    return `[${level}][${ChatColor.MATERIAL_EMERALD}${logger.name}${ChatColor.RESET}] ${message}`
  },
  messagesJoinFunction: (messages: string[]) => {
    return messages.join(' ')
  },
  jsonFormatter: ColorJSON.DEFAULT
}

/**
* The Logger class.
*/
export class Logger {
  private static initialized: boolean = false;
  /**
  *  Initialize logger class
  */
  static init() {
    LOGGING: {
      if (Logger.initialized) return;
      Logger.initialized = true;
      system.afterEvents.scriptEventReceive.subscribe((ev) => {
        if (ev.id === 'logging:level' || ev.id === 'log:level') {
          if (!ev.message) {
            loggingSettings.level = LogLevel.Info;
            world.sendMessage(`${ChatColor.AQUA}Logging level set to ${ChatColor.BOLD}${loggingSettings.level}`);
          } else {
            const level = LogLevel.parse(ev.message);
            if (level) {
              loggingSettings.level = level;
              world.sendMessage(`${ChatColor.AQUA}Logging level set to ${ChatColor.BOLD}${loggingSettings.level}`);
            } else {
              world.sendMessage(`${ChatColor.DARK_RED}Invalid logging level: ${ev.message}`);
            }
          }
        } else if (ev.id === 'logging:filter' || ev.id === 'log:filter') {
          if (!ev.message) {
            loggingSettings.filter = ['*'];
          } else {
            loggingSettings.filter = ev.message.split(',');
          }
          world.sendMessage(`${ChatColor.AQUA}Logging filter set to ${ChatColor.BOLD}${loggingSettings.filter.join(', ')}`);
        }
      });
    }
  }
  /**
  * @param {LogLevel} level - The level to set.
  */
  static setLevel(level: LogLevel) {
    loggingSettings.level = level;
  }
  /**
  * Filter the loggers by the given tags. Tags can use the `*` wildcard.
  * @param {array} filter - The filter to set.
  */
  static setFilter(filter: string[]) {
    loggingSettings.filter = filter;
  }
  /**
  * Set the format function for the logger.
  * @param {function} func - The function to set.
  */
  static setFormatFunction(func: (level: LogLevel, logger: Logger, message: string) => string) {
    loggingSettings.formatFunction = func;
  }
  /**
  * Set the function, that joins multiple messages into one for the logger.
  * @param {function} func - The function to set.
  */
  static setMessagesJoinFunction(func: (messages: string[]) => string) {
    loggingSettings.messagesJoinFunction = func;
  }
  /**
  * Set the JSON formatter for the logger.
  * @param {ColorJSON} formatter - The json formatter to set.
  */
  static setJsonFormatter(formatter: ColorJSON) {
    loggingSettings.jsonFormatter = formatter;
  }
  /**
  * Returns a new Logger.
  *
  * @param {string} name - The name of the Logger.
  * @param {array} tags - The tags for the Logger as strings.
  *
  * @returns {Logger} A new Logger.
  */
  static getLogger(name: string, ...tags: string[]): Logger {
    LOGGING: {
      if (!Logger.initialized) {
        Logger.init();
      }
    }
    return new Logger(name, tags);
  }
  /**
  * Construct a new Logger
  *
  * @param {string} name - The name of the Logger.
  * @param {array} tags - The tags for the logger as strings.
  */
  private constructor(public name: string, public tags: string[] = []) {
  }

  /**
  * Log messages with the level set.
  *
  * @param {LogLevel} level - The LogLevel to log the messages at.
  * @param {array} message - An array of the messages to log.
  */
  private log(level: LogLevel, ...message: any[]) {
    LOGGING: {
      if (level.level < loggingSettings.level.level) return;
      if (loggingSettings.filter.length === 0 || this.tags.length === 0) {
        this.logRaw(level, ...message);
        return;
      }
      for (const filter of loggingSettings.filter) {
        if (starMatch(filter, this.name)) {
          this.logRaw(level, ...message);
          return;
        }
      }
    }
  }

  /**
  * Internal function to log messages with the level set, that bypasses the filters.
  *
  * @param {LogLevel} level - The LogLevel to log the messages at.
  * @param {array} message - An array of the messages to log.
  */
  private logRaw(level: LogLevel, ...message: any[]) {
    LOGGING: {
      const msgs: string[] = message.map((x: any) => {
        if (x === void 0) {
          return ChatColor.GOLD + 'undefined' + ChatColor.RESET;
        }
        if (x === null) {
          return ChatColor.GOLD + 'null' + ChatColor.RESET;
        }
        if (x && x.stack && x.message) {
          return `${ChatColor.DARK_RED}${ChatColor.BOLD}${x.message}\n${ChatColor.RESET}${ChatColor.GRAY}${ChatColor.ITALIC}${x.stack}${ChatColor.RESET}`;
        }
        if (typeof x === 'object' || Array.isArray(x)) {
          return loggingSettings.jsonFormatter.stringify(x) + ChatColor.RESET;
        }
        return x + ChatColor.RESET;
      });
      const formatted = loggingSettings.formatFunction(level, this, loggingSettings.messagesJoinFunction(msgs));
      world.sendMessage(formatted);
      if ((console as any).originalLog) {
        (console as any).originalLog(ChatColor.stripColor(formatted));
      } else {
        console.log(ChatColor.stripColor(formatted));
      }
      // Consider moving warnings and up completely to console, which ends up in content log
      if (level === LogLevel.Warn) {
        console.warn(formatted);
      }
      if (level === LogLevel.Error || level === LogLevel.Fatal) {
        console.error(formatted);
      }
    }
  }

  /**
   * Logs a trace message.
   *
   * @param {...any} message - The message(s) to be logged.
   */
  trace(...message: any[]) {
    LOGGING: this.log(LogLevel.Trace, ...message);
  }

  /**
   * Logs debug message.
   *
   * @param {...any[]} message - The message(s) to be logged.
   */
  debug(...message: any[]) {
    LOGGING: this.log(LogLevel.Debug, ...message);
  }

  /**
   * Logs an informational message.
   *
   * @param {...any[]} message - The message(s) to be logged.
   */
  info(...message: any[]) {
    LOGGING: this.log(LogLevel.Info, ...message);
  }

  /**
   * Logs a warning message.
   *
   * @param {...any[]} message - The warning message or messages to be logged.
   */
  warn(...message: any[]) {
    LOGGING: this.log(LogLevel.Warn, ...message);
  }

  /**
   * Logs an error message.
   *
   * @param {...any[]} message - The error message(s) to log.
   */
  error(...message: any[]) {
    LOGGING: this.log(LogLevel.Error, ...message);
  }

  /**
   * Logs a fatal error.
   *
   * @param {any[]} message - The error message to log.
   */
  fatal(...message: any[]) {
    LOGGING: this.log(LogLevel.Fatal, ...message);
  }
}