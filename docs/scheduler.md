# PulseScheduler

The `PulseScheduler` and `TaskPulseScheduler` classes are powerful tools for Minecraft Bedrock Edition developers, designed to schedule and execute tasks at regular intervals.

## Features

- **Say goodbye to load spikes**: By distributing the execution of tasks over time, schedulers help to avoid load spikes that can occur when processing a large number of tasks simultaneously.
- **Periodic Execution**: The scheduler guarantees that tasks are executed once within the specified interval, ensuring predictable and consistent behavior.
- **Dynamic Task Management**: Tasks can be dynamically added or removed from the schedule, offering flexibility in managing scheduled actions during runtime.
- **Custom Processor Function**: With `PulseScheduler`, you can define a custom processor function for handling items in the schedule. This allows for a wide range of applications, from processing game entities to executing callbacks.
- **Simplified Task Scheduling**: `TaskPulseScheduler` simplifies the process by focusing on scheduling tasks (functions with no parameters), making it an ideal choice for straightforward task execution scenarios.

## Examples

### Using PulseScheduler for Entity Processing

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

### Using TaskPulseScheduler for Simple Repeating Tasks

```typescript
import { TaskPulseScheduler } from "@bedrock-oss/bedrock-boost"

// Create a new TaskPulseScheduler with a period of 50 ticks
const taskScheduler = new TaskPulseScheduler(50);

// Define a simple task
const greet = () => console.log("Hello, Minecraft World!");

// Add the task to the scheduler
taskScheduler.add(greet);

// Start the scheduler
taskScheduler.start();
```

### TaskPulseScheduler

`TaskPulseScheduler` extends `PulseScheduler` by predefining the processor function to execute tasks (functions with no parameters). This specialization makes it straightforward to schedule and execute simple tasks without defining a custom processor function. 

```typescript
import { TaskPulseScheduler } from "@bedrock-oss/bedrock-boost"

// Create a new TaskScheduler instance
const myTaskScheduler = new TaskPulseScheduler(120);

// Add tasks to be executed at a 120-tick interval
myTaskScheduler.add(() => console.log("Task 1 executed"));
myTaskScheduler.add(() => console.log("Task 2 executed"));

// Start executing tasks
myTaskScheduler.start();
```

This variant simplifies the creation of schedulers for tasks, focusing on the execution of no-argument functions at set intervals, ideal for most scheduling needs without the complexities of managing item lists or defining custom processing logic.

### UniquePulseScheduler

`UniquePulseScheduler` extends `PulseScheduler` by ensuring, that all items are unique based on provided equality function. This specialization makes it straightforward to process items without duplicates.

```typescript
import { UniquePulseScheduler } from "@bedrock-oss/bedrock-boost"

// Create a new TaskScheduler instance
const myUniqueScheduler = new UniquePulseScheduler<string>((item) => process(item), 20, (a, b) => a === b);

// Add items to be processed at a 20-tick interval
myUniqueScheduler.add("hello");
myUniqueScheduler.add("world");
// The following item will not be added, because it is equal to the first one
myUniqueScheduler.add("hello");

// Start processing
myUniqueScheduler.start();
```

### EntityPulseScheduler

`EntityPulseScheduler` is a variant, that accepts processing function, period and `EntityQueryOptions`. It will automatically add and remove entities based on the query.

```typescript
import { EntityPulseScheduler } from "@bedrock-oss/bedrock-boost"

// Create a new EntityPulseScheduler instance
const myEntityScheduler = new EntityPulseScheduler((entity) => process(entity), 20, { type: "minecraft:pig" });

// Start processing
myEntityScheduler.start();
```

### PlayerPulseScheduler

`PlayerPulseScheduler` is a variant, that will automatically add and remove players.

```typescript
import { PlayerPulseScheduler } from "@bedrock-oss/bedrock-boost"

// Create a new PlayerPulseScheduler instance
const myPlayerScheduler = new PlayerPulseScheduler((player) => process(player), 20);

// Start processing
myPlayerScheduler.start();
```