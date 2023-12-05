# Cache

In Minecraft Bedrock Script API, native calls to the game engine are often costly and should be avoided when possible. For example, calling `world.getDimension()` in a loop will cause the script to get the dimension from the game engine for each iteration, which can be very slow. To avoid this, we can cache the dimension object.

Currently, only the `Dimension` objects are cached, but more objects may be added in the future.

## Usage

The following example will get the dimension object for the overworld and cache it. If the dimension object is already cached, it will return the cached object.

```typescript
import { getDimension } from "@bedrock-oss/bedrock-boost";

const dimension = getDimension("overworld");
```