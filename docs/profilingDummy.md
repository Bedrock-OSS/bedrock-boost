# Profiling dummy

Currently, when profiling a script, the profiler will group the time spent on waiting for the next tick into the last native call. This is not very useful, as it might make it seem like the last native call took a long time, when in reality it was just waiting for the next tick.

To avoid this, we can use a dummy function and group the time spent on waiting for the next tick into that function. This will make the profiler more accurate.

## Usage

Make sure to make this call as late as possible in your script. This is in hopes, that the dummy will be called last in the tick, and therefore will group all the time spent on waiting for the next tick.

```typescript
import { addIdleDummy } from "@bedrock-oss/bedrock-boost";

addIdleDummy();
```