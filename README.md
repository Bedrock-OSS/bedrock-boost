# bedrock-boost

[![npm version](https://badge.fury.io/js/@bedrock-oss%2Fbedrock-boost.svg)](https://badge.fury.io/js/@bedrock-oss%2Fbedrock-boost)

A utility library to streamline the development process for Minecraft Bedrock's Script API, providing essential tools for vector operations, polyfills, and time measurements.

## Features
- **Vec3 Class**: Simplify and enhance 3D vector operations. [Documentation](docs/vec3.md)
- **Cache Module**: Caches dimension lookups, dimension height ranges, and block permutations to reduce costly native calls. [Documentation](docs/cache.md)
- **Polyfills**: 
  - `playerPolyfill`: Adds `applyImpulse` and `clearVelocity` methods to the Player class.
  - `consolePolyfill`: Overrides `console.log` to send messages to game chat.
- **Profiling Utilities**: `addIdleDummy` and `clearIdleDummy` improve profiling accuracy by grouping idle time. [Documentation](docs/profilingDummy.md)
- **Timings Class**: Granular time measurement with `begin()` and `end()`. 
- **Logging System**: Flexible logging with levels, tags, filters, and scriptevent commands. [Documentation](docs/logging.md)
- **ChatColor Class**: Simplify chat color formatting.
- **ColorJSON Class**: Generate colored JSON for chat messages. [Documentation](docs/colorJson.md)
- **Scheduling**: `PulseScheduler`, `TaskPulseScheduler`, `UniquePulseScheduler`, `EntityPulseScheduler`, and `PlayerPulseScheduler` for distributed task execution. [Documentation](docs/scheduler.md)
- **Utility Modules**: Common utilities including `BlockUtils`, `CommandUtils`, `DirectionUtils`, `EntitySaver`, `ItemUtils`, `JobUtils`, `VersionUtils`, and `VariableSender`.
- **Vanilla Wrappers**: Constants and helpers such as `VanillaBlockTags`, `VanillaItemTags`, and `TimeOfDay`.

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