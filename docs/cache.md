# Cache

In Minecraft Bedrock Script API, native calls to the game engine are often costly and should be avoided when possible. For example, calling `world.getDimension()` in a loop will cause the script to get the dimension from the game engine for each iteration, which can be very slow. To avoid this, we can cache the dimension object.

Currently, the following are cached:
- **Dimension objects** via `getDimension(name)`
- **Dimension height ranges** via `getDimensionHeightRange(name)`
- **Block permutations** via `getBlockPermutation(blockName, states?)`

## Usage

```typescript
import { getDimension, getDimensionHeightRange, getBlockPermutation } from "@bedrock-oss/bedrock-boost";

const dimension = getDimension("overworld");
const heightRange = getDimensionHeightRange("overworld");
const permutation = getBlockPermutation("minecraft:blue_candle", { candles: 1 });
```