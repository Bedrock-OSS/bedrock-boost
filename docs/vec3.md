# Vec3 Class Documentation

## Overview
`Vec3` is a versatile class designed for representing and manipulating 3-dimensional vectors in a Minecraft Bedrock Script API. This class offers a wide range of functionalities, including basic vector arithmetic, vector transformations, and utility functions for calculating properties like distance and angle between vectors.

## Immutable

`Vec3` instances are immutable, meaning that operations like `add` and `subtract` will return a new `Vec3` instance rather than modifying the original instance. This is to prevent unexpected behavior and side effects.

> :warning: Setting the x, y, or z component of a vector directly will actually change the original vector.

## Constructor
### `constructor(x, y, z)`
Constructs a `Vec3` object from various input types:
- **x**: Can be a `Vector3`, `Vec3`, `Direction`, an array of numbers `[x, y, z]`, or a single numeric value representing the x-coordinate.
- **y**: (Optional) The y-coordinate (required if x is a number).
- **z**: (Optional) The z-coordinate (required if x is a number).

Directional vectors (Up, Down, North, South, East, West) are also supported.

## Static Methods
### `static from(x, y, z)`
Creates a new `Vec3` instance from various inputs, similar to the constructor.

### `static fromYawPitch(yaw, pitch)`
Creates a new direction vector from the given yaw and pitch values (in degrees).

## Instance Methods
### `toVector()`
Converts the `Vec3` instance to the server's native `Vector` class if available, otherwise uses a polyfill.

### `copy()`
Returns a new `Vec3` instance with the same x, y, z values.

### `add(v)`
Adds another vector to the current vector and returns the result.

### `subtract(v)`
Subtracts another vector from the current vector and returns the result.

### `multiply(v)`
Multiplies the current vector by another vector or scalar and returns the result.

### `divide(v)`
Divides the current vector by another vector or scalar and returns the result.

### `normalize()`
Normalizes the vector to a length of 1.

### `length()`
Returns the length (magnitude) of the vector.

### `lengthSquared()`
Returns the squared length of the vector.

### `cross(v)`
Computes the cross product with another vector and returns the result.

### `distance(v)`
Calculates the distance to another vector.

### `distanceSquared(v)`
Calculates the squared distance to another vector.

### `lerp(v, t)`
Performs linear interpolation between the current vector and another vector.

### `slerp(v, t)`
Performs spherical linear interpolation between the current vector and another vector.

### `dot(v)`
Calculates the dot product with another vector.

### `angleBetween(v)`
Calculates the angle (in radians) between the current vector and another vector.

### `projectOnto(v)`
Projects the current vector onto another vector.

### `reflect(normal)`
Reflects the vector against a given normal.

### `setX(value)`, `setY(value)`, `setZ(value)`
Sets the x, y, or z component of the vector, respectively.

### `distanceToLineSegment(start, end)`
Calculates the shortest distance from the vector to a line segment.

### `equals(other)`
Checks if the current vector is equal to another vector.

### `toString(format, separator)`
Returns a string representation of the vector. Format being either `short` *"x, y, z"* or `long` *"Vec3(x, y, z)"* default being `long` with `", "` as a separator.

## Usage Example
```javascript
import Vec3 from './Vec3';

// Creating a new Vec3 instance
let vector = Vec3.from(1, 2, 3);

// Performing operations
let addedVector = vector.add(Vec3.from(1, 0, 0));
let length = vector.length();
```

This class is essential for vector manipulations in a Minecraft server, providing a comprehensive set of tools for handling 3D vector mathematics.