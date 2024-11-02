import { Vector2, Direction, VectorXZ } from "@minecraft/server";
import { Logger } from "./Logging";
import Vec3 from "./Vec3";

type VectorLike = VectorXZ | Vector2 | Vec2 | Direction | number[] | number

export default class Vec2 implements Vector2 {
  private static readonly log = Logger.getLogger("vec2", "vec2", "bedrock-boost");
  public static readonly Zero = new Vec2(0, 0);
  public static readonly North = new Vec2(Direction.North);
  public static readonly South = new Vec2(Direction.South);
  public static readonly East = new Vec2(Direction.East);
  public static readonly West = new Vec2(Direction.West);

  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number);
  constructor(x: Vec2);
  constructor(x: Vector2);
  constructor(x: Direction);
  constructor(x: number[]);
  constructor(x: VectorLike, y?: number) {
    if (x === Direction.Down || x === Direction.Up) {
      Vec2.log.error(new Error("Invalid direction"), x);
      throw new Error("Invalid direction");
    } else if (x === Direction.North) {
      this.x = 0;
      this.y = 1;
    } else if (x === Direction.South) {
      this.x = 0;
      this.y = -1;
    } else if (x === Direction.East) {
      this.x = 1;
      this.y = 0;
    } else if (x === Direction.West) {
      this.x = -1;
      this.y = 0;
    } else if (typeof x === "number") {
      this.x = x;
      this.y = y!;
    } else if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
    } else if (x instanceof Vec2) {
      this.x = x.x;
      this.y = x.y;
    } else {
      const anyX = x as any;
      if (!anyX || (!anyX.x && anyX.x !== 0) || ((!anyX.y && anyX.y !== 0) && (!anyX.z && anyX.z !== 0))) {
        Vec2.log.error(new Error("Invalid vector"), x);
        throw new Error("Invalid vector");
      }
      this.x = x.x;
      if (anyX.y || anyX.y === 0) {
        this.y = anyX.y;
      } else if (anyX.z || anyX.z === 0) {
        this.y = anyX.z;
      } else {
        Vec2.log.error(new Error("Invalid vector"), x);
        throw new Error("Invalid vector");
      }
    }

  }
  /**
   * Creates a new vector from the given values.
   */
  static from(x: number, y: number): Vec2;
  static from(x: Vec2): Vec2;
  static from(x: Vector2): Vec2;
  static from(x: VectorXZ): Vec2;
  static from(x: Direction): Vec2;
  static from(x: number[]): Vec2;
  static from(x: VectorLike, y?: number): Vec2 {
    if (x instanceof Vec2) return x;
    if (typeof x === 'number' && y !== undefined) {
      return new Vec2(x, y);
    }
    if (Array.isArray(x)) {
      return new Vec2(x);
    }
    if (x === Direction.Down || x === Direction.Up) {
      Vec2.log.error(new Error("Invalid direction"), x);
      throw new Error("Invalid direction");
    }
    if (x === Direction.North) return Vec2.North;
    if (x === Direction.South) return Vec2.South;
    if (x === Direction.East) return Vec2.East;
    if (x === Direction.West) return Vec2.West;
    return new Vec2(x as any, y as any);
  }
  private static _from(x: VectorLike, y?: number): Vec2 {
    if (x instanceof Vec2) return x;
    if (typeof x === 'number' && y !== undefined) {
      return new Vec2(x, y);
    }
    if (Array.isArray(x)) {
      return new Vec2(x);
    }
    if (x === Direction.Down || x === Direction.Up) {
      Vec2.log.error(new Error("Invalid direction"), x);
      throw new Error("Invalid direction");
    }
    if (x === Direction.North) return Vec2.North;
    if (x === Direction.South) return Vec2.South;
    if (x === Direction.East) return Vec2.East;
    if (x === Direction.West) return Vec2.West;
    return new Vec2(x as any, y as any);
  }
  /**
   * Creates a copy of the current vector.
   * 
   * @returns A new vector with the same values as the current vector.
   */
  copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }
  /**
   * Creates a new direction vector from yaw rotation.
   * 
   * @param yaw - The yaw value in degrees.
   * @returns A new vector representing the direction.
   */
  static fromYaw(yaw: number): Vec2 {
    // Convert degrees to radians
    const psi = yaw * (Math.PI / 180);

    const x = Math.sin(psi);
    const z = Math.cos(psi);
    return new Vec2(x, z);
  }

  /**
   * Converts the normal vector to yaw and pitch values.
   * 
   * @returns A Vector2 containing the yaw and pitch values.
   */
  toYaw(): number {
    if (this.isZero()) {
      Vec2.log.error(new Error("Cannot convert zero-length vector to direction"));
      throw new Error("Cannot convert zero-length vector to direction");
    }
    const direction = this.normalize();
    const yaw = Math.atan2(direction.x, direction.y) * (180 / Math.PI);
    return yaw;
  }
  /**
   * Adds another vector to the current vector.
   *
   * @param v - The vector to be added.
   * @returns The updated vector after addition.
   */
  add(x: number, y: number): Vec2;
  add(x: Vec2): Vec2;
  add(x: Vector2): Vec2;
  add(x: VectorXZ): Vec2;
  add(x: Direction): Vec2;
  add(x: number[]): Vec2;
  add(x: VectorLike, y?: number): Vec2 {
    const v: Vec2 = Vec2._from(x, y);
    return Vec2.from(v.x + this.x, v.y + this.y);
  }
  /**
   * Subtracts another vector from the current vector.
   *
   * @param v - The vector to be subtracted.
   * @returns The updated vector after subtraction.
   */
  subtract(x: number, y: number): Vec2;
  subtract(x: Vec2): Vec2;
  subtract(x: Vector2): Vec2;
  subtract(x: VectorXZ): Vec2;
  subtract(x: Direction): Vec2;
  subtract(x: number[]): Vec2;
  subtract(x: VectorLike, y?: number): Vec2 {
    const v: Vec2 = Vec2._from(x, y);
    return Vec2.from(this.x - v.x, this.y - v.y);
  }
  /**
   * Multiplies the current vector by another vector or scalar.
   *
   * @param v - The vector or scalar to multiply with.
   * @returns The updated vector after multiplication.
   */
  multiply(x: number, y: number): Vec2;
  multiply(x: Vec2): Vec2;
  multiply(x: Vector2): Vec2;
  multiply(x: VectorXZ): Vec2;
  multiply(x: Direction): Vec2;
  multiply(x: number[]): Vec2;
  multiply(x: number): Vec2;
  multiply(x: VectorLike, y?: number): Vec2 {
    if (typeof x === "number" && y === undefined) {
      return Vec2.from(this.x * x, this.y * x);
    }
    const v: Vec2 = Vec2._from(x, y);
    return Vec2.from(v.x * this.x, v.y * this.y);
  }
  /**
   * Scales the current vector by a scalar.
   *
   * @param v - The scalar to scale by.
   * @returns The updated vector after scaling.
   */
  scale(scalar: number): Vec2 {
    return Vec2.from(this.x * scalar, this.y * scalar);
  }
  /**
   * Divides the current vector by another vector or scalar.
   *
   * @param v - The vector or scalar to divide by.
   * @returns The updated vector after division.
   */
  divide(x: number, y: number): Vec2;
  divide(x: Vec2): Vec2;
  divide(x: Vector2): Vec2;
  divide(x: VectorXZ): Vec2;
  divide(x: Direction): Vec2;
  divide(x: number[]): Vec2;
  divide(x: number): Vec2;
  divide(x: VectorLike, y?: number): Vec2 {
    if (typeof x === "number" && y === undefined) {
      if (x === 0) throw new Error("Cannot divide by zero");
      return Vec2.from(this.x / x, this.y / x);
    }
    const v: Vec2 = Vec2._from(x, y);
    if (v.x === 0 || v.y === 0) throw new Error("Cannot divide by zero");
    return Vec2.from(this.x / v.x, this.y / v.y);
  }
  /**
   * Normalizes the vector to have a length (magnitude) of 1.
   * Normalized vectors are often used as a direction vectors.
   *
   * @returns The normalized vector.
   */
  normalize(): Vec2 {
    if (this.isZero()) {
      Vec2.log.error(new Error("Cannot normalize zero-length vector"));
      throw new Error("Cannot normalize zero-length vector");
    }
    const len = this.length();
    return Vec2.from(this.x / len, this.y / len);
  }
  /**
   * Computes the length (magnitude) of the vector.
   *
   * @returns The length of the vector.
   */
  length(): number {
    return Math.sqrt(this.lengthSquared());
  }
  /**
   * Computes the squared length of the vector.
   * This is faster than computing the actual length and can be useful for comparison purposes.
   *
   * @returns The squared length of the vector.
   */
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }
  /**
   * Computes the distance between the current vector and another vector.
   *
   * @param v - The other vector.
   * @returns The distance between the two vectors.
   */
  distance(x: number, y: number): number;
  distance(x: Vec2): number;
  distance(x: Vector2): number;
  distance(x: VectorXZ): number;
  distance(x: Direction): number;
  distance(x: number[]): number;
  distance(x: VectorLike, y?: number): number {
    const v: Vec2 = Vec2._from(x, y);
    return Math.sqrt(this.distanceSquared(v));
  }
  /**
   * Computes the squared distance between the current vector and another vector.
   * This is faster than computing the actual distance and can be useful for comparison purposes.
   *
   * @param v - The other vector.
   * @returns The squared distance between the two vectors.
   */
  distanceSquared(x: number, y: number): number;
  distanceSquared(x: Vec2): number;
  distanceSquared(x: Vector2): number;
  distanceSquared(x: VectorXZ): number;
  distanceSquared(x: Direction): number;
  distanceSquared(x: number[]): number;
  distanceSquared(x: VectorLike, y?: number): number {
    const v: Vec2 = Vec2._from(x, y);
    return this.subtract(v).lengthSquared();
  }
  /**
   * Computes the linear interpolation between the current vector and another vector, when t is in the range [0, 1].
   * Computes the extrapolation when t is outside this range.
   *
   * @param v - The other vector.
   * @param t - The interpolation factor.
   * @returns A new vector after performing the lerp operation.
   */
  lerp(v: Vector2, t: number): Vec2 {
    if (!v || !t) return Vec2.from(this);
    if (t === 1) return Vec2.from(v);
    if (t === 0) return Vec2.from(this);
    return Vec2.from(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t
    );
  }
  /**
   * Computes the spherical linear interpolation between the current vector and another vector, when t is in the range [0, 1].
   * Computes the extrapolation when t is outside this range.
   *
   * @param v - The other vector.
   * @param t - The interpolation factor.
   * @returns A new vector after performing the slerp operation.
   */
  slerp(v: Vector2, t: number): Vec2 {
    if (!v || !t) return Vec2.from(this);
    if (t === 1) return Vec2.from(v);
    if (t === 0) return Vec2.from(this);
    const dot = this.dot(v);
    const theta = Math.acos(dot) * t;
    const relative = Vec2.from(v).subtract(this.multiply(dot)).normalize();
    return this
      .multiply(Math.cos(theta))
      .add(relative.multiply(Math.sin(theta)));
  }
  /**
   * Computes the dot product of the current vector with another vector.
   *
   * @param v - The other vector.
   * @returns The dot product of the two vectors.
   */
  dot(x: number, y: number): number;
  dot(x: Vec2): number;
  dot(x: Vector2): number;
  dot(x: VectorXZ): number;
  dot(x: Direction): number;
  dot(x: number[]): number;
  dot(x: VectorLike, y?: number): number {
    const v: Vec2 = Vec2._from(x, y);
    return this.x * v.x + this.y * v.y;
  }
  /**
   * Computes the angle (in radians) between the current vector and another vector.
   *
   * @param v - The other vector.
   * @returns The angle in radians between the two vectors.
   */
  angleBetween(x: number, y: number): number;
  angleBetween(x: Vec2): number;
  angleBetween(x: Vector2): number;
  angleBetween(x: Direction): number;
  angleBetween(x: number[]): number;
  angleBetween(x: VectorLike, y?: number): number {
    const v: Vec2 = Vec2._from(x, y);
    const dotProduct = this.dot(v);
    const lengths = this.length() * v.length();
    if (lengths === 0) {
      return 0;
    }
    return Math.acos(dotProduct / lengths);
  }
  /**
   * Computes the projection of the current vector onto another vector.
   * This method finds how much of the current vector lies in the direction of vector `v`.
   *
   * @param v - The vector onto which the current vector will be projected.
   * @returns A new vector representing the projection of the current vector onto `v`.
   */
  projectOnto(x: number, y: number): Vec2;
  projectOnto(x: Vec2): Vec2;
  projectOnto(x: Vector2): Vec2;
  projectOnto(x: VectorXZ): Vec2;
  projectOnto(x: Direction): Vec2;
  projectOnto(x: number[]): Vec2;
  projectOnto(x: VectorLike, y?: number): Vec2 {
    const v: Vec2 = Vec2._from(x, y);
    // If the vector is zero-length, then the projection is the zero vector.
    if (v.isZero()) {
      return Vec2.Zero;
    }
    return v.scale(this.dot(v) / v.dot(v));
  }
  /**
   * Computes the reflection of the current vector against a normal vector.
   * Useful for simulating light reflections or bouncing objects.
   *
   * @param normal - The normal vector against which the current vector will be reflected.
   * @returns A new vector representing the reflection of the current vector.
   */
  reflect(x: number, y: number): Vec2;
  reflect(x: Vec2): Vec2;
  reflect(x: Vector2): Vec2;
  reflect(x: VectorXZ): Vec2;
  reflect(x: Direction): Vec2;
  reflect(x: number[]): Vec2;
  reflect(x: VectorLike, y?: number): Vec2 {
    const normal: Vec2 = Vec2._from(x, y);
    const proj = this.projectOnto(normal);
    return this.subtract(proj.multiply(2));
  }
  /**
   * Rotates the current normalized vector by a given angle around a given axis.
   * 
   * @param axis - The axis of rotation.
   * @param angle - The angle of rotation in degrees.
   * @returns The rotated vector.
   */
  rotate(axis: Vector2, angle: number): Vec2 {
    // Convert angle from degrees to radians
    const radians = angle * (Math.PI / 180);

    // Translate the vector to the origin relative to the pivot (axis)
    let translatedX = this.x - axis.x;
    let translatedY = this.y - axis.y;
    
    // Use complex number rotation (Euler's formula)
    // New x = x * cos(radians) - y * sin(radians)
    // New y = x * sin(radians) + y * cos(radians)
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    const rotatedX = translatedX * cos - translatedY * sin;
    const rotatedY = translatedX * sin + translatedY * cos;
    
    // Translate the rotated vector back relative to the pivot (axis) and return it  
    return new Vec2(
      rotatedX + axis.x,
      rotatedY + axis.y
    );
  }
  /**
   * Converts the current vector to a 3d vetor with the given y-value.
   * 
   * @param z - The optional z value for the 3d vetor.
   * @returns The converted vector.
   */
  toVec3(z?: number): Vec3 {
    return new Vec3(this.x, this.y, z || 0);
  }
  /**
   * Sets the X component of the vector.
   *
   * @param value - The new X value.
   * @returns The updated vector with the new X value.
   */
  setX(value: number): Vec2 {
    return new Vec2(value, this.y);
  }
  /**
   * Sets the Y component of the vector.
   *
   * @param value - The new Y value.
   * @returns The updated vector with the new Y value.
   */
  setY(value: number): Vec2 {
    return new Vec2(this.x, value);
  }
  /**
   * Calculates the shortest distance between a point (represented by this Vector3 instance) and a line segment.
   * 
   * This method finds the perpendicular projection of the point onto the line defined by the segment. If this 
   * projection lies outside the line segment, then the method calculates the distance from the point to the 
   * nearest segment endpoint.
   * 
   * @param start - The starting point of the line segment.
   * @param end - The ending point of the line segment.
   * @returns The shortest distance between the point and the line segment.
   */
  distanceToLineSegment(start: Vector2, end: Vector2): number {
    const lineDirection = Vec2.from(end).subtract(start);
    // If the line is zero-length, then the distance is the distance to the start point.
    if (lineDirection.lengthSquared() === 0) {
      return this.subtract(start).length();
    }
    const t = Math.max(0, Math.min(1, this.subtract(start).dot(lineDirection) / lineDirection.dot(lineDirection)));
    const projection = Vec2.from(start).add(lineDirection.multiply(t));
    return this.subtract(projection).length();
  }
  /**
   * Floors the X, Y, and Z components of the vector.
   * @returns A new vector with the floored components.
   */
  floor(): Vec2 {
    return new Vec2(Math.floor(this.x), Math.floor(this.y));
  }
  /**
   * Floors the X component of the vector.
   * @returns A new vector with the floored X component.
   */
  floorX(): Vec2 {
    return new Vec2(Math.floor(this.x), this.y);
  }
  /**
   * Floors the Y component of the vector.
   * @returns A new vector with the floored Y component.
   */
  floorY(): Vec2 {
    return new Vec2(this.x, Math.floor(this.y));
  }
  /**
   * Ceils the X, Y, and Z components of the vector.
   * @returns A new vector with the ceiled components.
   */
  ceil(): Vec2 {
    return new Vec2(Math.ceil(this.x), Math.ceil(this.y));
  }
  /**
   * Ceils the X component of the vector.
   * @returns A new vector with the ceiled X component.
   */
  ceilX(): Vec2 {
    return new Vec2(Math.ceil(this.x), this.y);
  }
  /**
   * Ceils the Y component of the vector.
   * @returns A new vector with the ceiled Y component.
   */
  ceilY(): Vec2 {
    return new Vec2(this.x, Math.ceil(this.y));
  }
  /**
   * Rounds the X, Y, and Z components of the vector.
   * @returns A new vector with the rounded components.
   */
  round(): Vec2 {
    return new Vec2(Math.round(this.x), Math.round(this.y));
  }
  /**
   * Rounds the X component of the vector.
   * @returns A new vector with the rounded X component.
   */
  roundX(): Vec2 {
    return new Vec2(Math.round(this.x), this.y);
  }
  /**
   * Rounds the Y component of the vector.
   * @returns A new vector with the rounded Y component.
   */
  roundY(): Vec2 {
    return new Vec2(this.x, Math.round(this.y));
  }
  /**
   * Returns a new vector offset from the current vector north by 1 block.
   * @returns A new vector offset from the current vector north by 1 block.
   */
  north(): Vec2 {
    return this.add(Vec2.North);
  }
  /**
   * Returns a new vector offset from the current vector south by 1 block.
   * @returns A new vector offset from the current vector south by 1 block.
   */
  south(): Vec2 {
    return this.add(Vec2.South);
  }
  /**
   * Returns a new vector offset from the current vector east by 1 block.
   * @returns A new vector offset from the current vector east by 1 block.
   */
  east(): Vec2 {
    return this.add(Vec2.East);
  }
  /**
   * Returns a new vector offset from the current vector west by 1 block.
   * @returns A new vector offset from the current vector west by 1 block.
   */
  west(): Vec2 {
    return this.add(Vec2.West);
  }
  /**
   * Checks if the current vector is equal to the zero vector.
   * @returns true if the vector is equal to the zero vector, else returns false.
   */
  isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }
  /**
   * Converts the vector to an array containing the X, Y, and Z components of the vector.
   * @returns An array containing the X, Y, and Z components of the vector.
   */
  toArray(): number[] {
    return [this.x, this.y];
  }
  /**
   * Converts the vector to a direction.
   * If the vector is not a unit vector, then it will be normalized and rounded to the nearest direction.
   */
  toDirection(): Direction {
    if (this.isZero()) {
      Vec2.log.error(new Error("Cannot convert zero-length vector to direction"));
      throw new Error("Cannot convert zero-length vector to direction");
    }
    const normalized = this.normalize();
    const maxValue = Math.max(Math.abs(normalized.x), Math.abs(normalized.y));
    if (maxValue === normalized.x) return Direction.East;
    if (maxValue === -normalized.x) return Direction.West;
    if (maxValue === normalized.y) return Direction.North;
    if (maxValue === -normalized.y) return Direction.South;
    // This should never happen
    Vec2.log.error(new Error("Cannot convert vector to direction"), this);
    throw new Error("Cannot convert vector to direction");
  }
  /**
   * Returns a new vector with the X, Y, and Z components rounded to the nearest block location.
   */
  toBlockLocation(): Vec2 {
    // At this point I'm not sure if it wouldn't be better to use Math.floor instead
    return Vec2.from(
      (this.x << 0) - (this.x < 0 && this.x !== (this.x << 0) ? 1 : 0),
      (this.y << 0) - (this.y < 0 && this.y !== (this.y << 0) ? 1 : 0)
    );
  }
  /**
   * Checks if the current vector is equal to another vector.
   * @param other
   */
  almostEqual(x: number, y: number, delta: number): boolean;
  almostEqual(x: Vec2, delta: number): boolean;
  almostEqual(x: Vector2, delta: number): boolean;
  almostEqual(x: VectorXZ, delta: number): boolean;
  almostEqual(x: Direction, delta: number): boolean;
  almostEqual(x: number[], delta: number): boolean;
  almostEqual(x: VectorLike, y: number, delta?: number) {
    try {
      let other: Vec2;
      if (typeof x !== 'number' && delta === undefined) {
        other = Vec2._from(x, undefined);
        delta = y!;
      } else {
        other = Vec2._from(x, y);
      }
      return Math.abs(this.x - other.x) <= delta! && Math.abs(this.y - other.y) <= delta!;
    } catch (e) {
      return false;
    }
  }
  /**
   * Checks if the current vector is equal to another vector.
   * @param other
   */
  equals(x: number, y: number): boolean;
  equals(x: Vec2): boolean;
  equals(x: Vector2): boolean;
  equals(x: VectorXZ): boolean;
  equals(x: Direction): boolean;
  equals(x: number[]): boolean;
  equals(x: VectorLike, y?: number) {
    try {
      const other: Vec2 = Vec2._from(x, y);
      return this.x === other.x && this.y === other.y;
    } catch (e) {
      return false;
    }
  }

  toString(format: 'long'|'short' = 'long', separator: string = ', '): string {
    const result = `${this.x + separator + this.y}`;
    return format === 'long' ? `Vec2(${result})` : result;
  }
}