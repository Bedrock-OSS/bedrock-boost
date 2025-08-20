# Logging

## Overview

The logging system is designed to provide a flexible and efficient way to handle log messages in Minecraft Bedrock Script API. It leverages TypeScript to define log levels, color-coding, and message formatting, offering a customizable logging experience.

## The `LogLevel` Class

The `LogLevel` class is at the core of the logging system. It defines several log levels, each with a numerical level, name, and associated `ChatColor`. These levels include:

- **All**: For logging all messages.
- **Trace**: Detailed information, useful for diagnosing problems.
- **Debug**: General debugging information.
- **Info**: General information about the script's operation.
- **Warn**: Warning messages about potential issues.
- **Error**: Error messages indicating problems that need attention.
- **Fatal**: Critical errors causing the script to abort.
- **Off**: Disables logging.

## The `Logger` Class

The `Logger` class is used for creating and managing loggers with specific names and tags. It provides methods for logging messages at different levels and configuring logging behavior.

### Initialization

The `init` method initializes the logging system, setting up commands and default settings. If not called, the system will initialize automatically when the first logger is created.

### Configuration

- **setLevel**: Sets the global logging level. By default, info and higher levels are enabled.
- **setFilter**: Sets a filter to control which loggers are active. By default, all loggers are active.
- **setFormatFunction**: Customizes how log messages are formatted. The function receives the log level, logger instance, message, formatted timestamp, and any tags.
- **setTagsOutputVisibility**: When true, the tags of the logger will be appended next to its name. By default, this is disabled.
- **setTimestampFormatter**: Supplies a function that formats a provided `Date` timestamp into a string. The formatted value is passed to the format function. Returning an empty string will omit the timestamp. By default, timestamps are disabled.
- **setBasicTimestampFormatter**: Sets a basic timestamp formatter, that formats the timestamp in `HH:mm:ss.SS` format.
- **setJsonFormatter**: Sets a JSON formatter for stringifying objects and arrays. By default, `ColorJSON.DEFAULT` is used.

### Logging Methods

Each log level has a corresponding method (`trace`, `debug`, `info`, `warn`, `error`, `fatal`) for logging messages. These methods internally use `log` and `logRaw` to process and display messages.

## Usage

To use the logging system, create a `Logger` instance with a specific name and tags. Then, use the appropriate logging methods (`info`, `warn`, `error`, etc.) to log messages. The system will handle formatting and display based on the configured settings.

### Example

```typescript
import { Logger } from '@bedrock-oss/bedrock-boost';

const logger = new Logger('myLogger', 'myTag', 'anotherTag');

logger.info('Hello, world!', { foo: 'bar' });
```

## Commands

The logging system includes 2 commands to control the logging system:

```
scriptevent logging:level <level either as string or as a number>
# or
scriptevent log:level <level either as string or as a number>

scriptevent logging:filter <comma separated tags>
# or
scriptevent log:filter <comma separated tags>
```

## Build Options

When using esbuild, you can use `dropLabels` option with `LOGGING` label to remove all logging code from the final bundle.

When using [gametests regolith filter](https://github.com/Bedrock-OSS/regolith-filters/tree/master/gametests), you can configure it like this:

```json
{
    "filter": "gametests",
    "settings": {
        "modules": [
            // ...
        ],
        "buildOptions": {
            "dropLabels": ["LOGGING"]
        }
    }
}
```
