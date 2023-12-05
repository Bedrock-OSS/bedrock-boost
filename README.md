# bedrock-boost

[![npm version](https://badge.fury.io/js/@bedrock-oss%2Fbedrock-boost.svg)](https://badge.fury.io/js/@bedrock-oss%2Fbedrock-boost)

A utility library to streamline the development process for Minecraft Bedrock's Script API, providing essential tools for vector operations, polyfills, and time measurements.

## Features

1. **Vec3 Class**: Simplify and enhance vector operations.
2. **playerPolyfill**: Implements unsupported functions in Player class. Currently supports:
   - `applyImpulse`: Apply an impulse to a player.
   - `clearVelocity`: Clears the velocity of a player.
3. **consolePolyfill**: Enhance `console.log` to display messages in the chat as well.
4. **Timings Class**: Granular time measurement made easy. Functions include:
   - `begin(operation:string)`: Begin a timing operation.
   - `end()`: Conclude the timing operation.
5. **Logging**: Log messages with different levels and filters:
   - Adds a way to filter messages by tags (e.g. `player`, `entity`, `block`).
   - Adds a way to filter messages by levels (e.g. `info`, `warn`, `error`).
6. **ChatColor Class**: Simplify chat color formatting. `ChatColor.prettyChatJSON` function included to convert a JSON chat message to a string with color formatting.

## Installation

```bash
npm install @bedrock-oss/bedrock-boost
```

## Usage

### Vec3 Class

```typescript
import { Vec3 } from "@bedrock-oss/bedrock-boost";
import { world } from "@minecraft/server";

world.beforeEvents.itemUse.subscribe((event) => {
  event.source.applyImpulse(Vec3.from(event.source.getViewDirection()).setY(0).normalize().multiply(2));
})

```

### playerPolyfill

```typescript
import { Direction, world } from "@minecraft/server";
import { Vec3 } from "@bedrock-oss/bedrock-boost";
import { Polyfill } from "@bedrock-oss/bedrock-boost"

Polyfill.installPlayer();

world.getAllPlayers().forEach(player => {
  // Apply an impulse to the player
  player.applyImpulse(Vec3.from(Direction.Up).multiply(2));
});
```

### consolePolyfill

```typescript
import { Polyfill } from "@bedrock-oss/bedrock-boost"

Polyfill.installConsole();

// Log messages in the game world
console.log("Hello, Minecraft World!");
```

### Timings Class

```typescript
import { Timings } from "@bedrock-oss/bedrock-boost"

Timings.begin("big operation 1");
// Some operations...
// Beginning another operation will automatically end the previous one
Timings.begin("big operation 2");
// Some operations...
Timings.end();
```

### ChatColor and ColorJSON classes

```typescript
import { Logger } from "@bedrock-oss/bedrock-boost"

const log = Logger.getLogger("main", "tag1", "tag2");
log.info("Hello, Minecraft World!");
```
```

### Logger

```typescript
import { Logger } from "@bedrock-oss/bedrock-boost"

const log = Logger.getLogger("main", "tag1", "tag2");
log.info("Hello, Minecraft World!");
```

It also includes 2 commands to control the logging system:
```
scriptevent logger:level <level either as string or as a number>
scriptevent logger:filter <comma separated tags>
```

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

## Contributing

Feel free to raise an issue or submit a pull request if you have any improvements or features to suggest.

## License

This project is licensed under the MIT License.