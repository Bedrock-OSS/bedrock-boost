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
6. **ChatColor Class**: Simplifies chat color formatting.
7. **ColorJSON Class**: JSON formatter for usage in chat messages. Simply use `ColorJSON.DEFAULT.stringify` function to convert any value to a JSON string with color formatting.
8. **PulseScheduler**: A simple scheduler, that processes all items once in a set period of time to avoid load spikes.

## Installation

```bash
npm install @bedrock-oss/bedrock-boost
```

## Usage

### Vec3 Class

[Documentation](docs/vec3.md)

```typescript
import { Vec3 } from "@bedrock-oss/bedrock-boost";
import { world } from "@minecraft/server";

world.beforeEvents.itemUse.subscribe((event) => {
  event.source.applyImpulse(Vec3.from(event.source.getViewDirection()).setY(0).normalize().multiply(2));
})

```

### Logger

[Documentation](docs/logging.md)

```typescript
import { Logger } from "@bedrock-oss/bedrock-boost"

const log = Logger.getLogger("main", "tag1", "tag2");
log.info("Hello, Minecraft World!");
```

It also includes 2 commands to control the logging system:
```
scriptevent logging:level <level either as string or as a number>
# or
scriptevent log:level <level either as string or as a number>

scriptevent logging:filter <comma separated tags>
# or
scriptevent log:filter <comma separated tags>
```

### ChatColor and ColorJSON classes

[Documentation](docs/colorJson.md)

```typescript
import { Logger } from "@bedrock-oss/bedrock-boost"

const log = Logger.getLogger("main", "tag1", "tag2");
log.info("Hello, Minecraft World!");
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

### PulseScheduler

```typescript
import { PulseScheduler } from "@bedrock-oss/bedrock-boost"

// Define a processor function to apply an effect to an entity
const applyEffect = (entity) => {
    // Example function applying an effect to the entity
    console.log(`Applying effect to entity: ${entity}`);
};

// Create a PulseScheduler with a 100-tick interval
const entityEffectScheduler = new PulseScheduler(applyEffect, 100);

// Add entities to the scheduler
entityEffectScheduler.add("Entity1");
entityEffectScheduler.add("Entity2");

// Start the scheduler to begin processing entities
entityEffectScheduler.start();
```

## Contributing

Feel free to raise an issue or submit a pull request if you have any improvements or features to suggest.

## License

This project is licensed under the MIT License.