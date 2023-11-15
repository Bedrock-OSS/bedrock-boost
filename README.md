# bedrock-boost

[![npm version](https://badge.fury.io/js/@bedrock-oss%2Fbedrock-boost.svg)](https://badge.fury.io/js/@bedrock-oss%2Fbedrock-boost)

A utility library to streamline the development process for Minecraft Bedrock's Script API, providing essential tools for vector operations, polyfills, and time measurements.

## Features

1. **Vec3 Class**: Simplify and enhance vector operations.
2. **playerPolyfill**: Implements unsupported functions in Player class. Currently supports:
   - `applyImpulse`: Apply an impulse to a player.
3. **consolePolyfill**: Enhance `console.log` to display messages in the chat as well.
4. **Timings Class**: Granular time measurement made easy. Functions include:
   - `begin(operation:string)`: Begin a timing operation.
   - `end()`: Conclude the timing operation.

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
import "@bedrock-oss/bedrock-boost/playerPolyfill"

world.getAllPlayers().forEach(player => {
  // Apply an impulse to the player
  player.applyImpulse(Vec3.from(Direction.Up).multiply(2));
});
```

### consolePolyfill

```typescript
import "@bedrock-oss/bedrock-boost/consolePolyfill"

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

## Contributing

Feel free to raise an issue or submit a pull request if you have any improvements or features to suggest.

## License

This project is licensed under the MIT License.