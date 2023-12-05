import * as srv from "@minecraft/server";
import { Vector3, Direction } from "@minecraft/server";
import {Vector as PolyfillVector} from "./vectorPolyfill"

type XComponent = Vector3 | Vec3 | Direction | number[] | number

function getVectorClass(): any {
  if ((srv as any).Vector) {
    return (srv as any).Vector;
  }
  return PolyfillVector;
}

export default class Vec3 implements Vector3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  constructor(x: XComponent, y?: number, z?: number) {
    if (x === Direction.Down) {
      this.x = 0;
      this.y = -1;
      this.z = 0;
    } else if (x === Direction.Up) {
      this.x = 0;
      this.y = 1;
      this.z = 0;
    } else if (x === Direction.North) {
      this.x = 0;
      this.y = 0;
      this.z = 1;
    } else if (x === Direction.South) {
      this.x = 0;
      this.y = 0;
      this.z = -1;
    } else if (x === Direction.East) {
      this.x = 1;
      this.y = 0;
      this.z = 0;
    } else if (x === Direction.West) {
      this.x = -1;
      this.y = 0;
      this.z = 0;
    } else if (typeof x === "number") {
      this.x = x;
      this.y = y!;
      this.z = z!;
    } else if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
    } else if (x instanceof Vec3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else {
      if (!x || !x.x || !x.y || !x.z) throw new Error("Invalid vector");
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    }

  }
  /**
   * Creates a new vector from the given values.
   */
  static from(x: XComponent, y?: number, z?: number): Vec3 {
    if (x instanceof Vec3) return x;
    return new Vec3(x, y, z);
  }
  toVector(): any {
    return new (getVectorClass())(this.x, this.y, this.z);
  }
  /**
   * Creates a copy of the current vector.
   * 
   * @returns A new vector with the same values as the current vector.
   */
  copy(): Vec3 {
    return Vec3.from(this);
  }
  /**
   * Creates a new direction vector from yaw and pitch values.
   * 
   * @param yaw - The yaw value in degrees.
   * @param pitch - The pitch value in degrees.
   * @returns A new vector representing the direction.
   */
  static fromYawPitch(yaw:number, pitch:number): Vec3 {
      // Convert degrees to radians
      const psi = yaw * (Math.PI / 180);
      const theta = pitch * (Math.PI / 180);

      const x = Math.cos(theta) * Math.sin(psi);
      const y = Math.sin(theta);
      const z = Math.cos(theta) * Math.cos(psi);
      return new Vec3(x, y, z);
  }
  /**
   * Adds another vector to the current vector.
   *
   * @param v - The vector to be added.
   * @returns The updated vector after addition.
   */
  add(x: XComponent, y?: number, z?: number): Vec3 {
    let v: Vec3 = Vec3.from(x, y, z);
    return Vec3.from(getVectorClass().add(this, v));
  }
  /**
   * Subtracts another vector from the current vector.
   *
   * @param v - The vector to be subtracted.
   * @returns The updated vector after subtraction.
   */
  subtract(x: XComponent, y?: number, z?: number): Vec3 {
    let v: Vec3 = Vec3.from(x, y, z);
    return Vec3.from(getVectorClass().subtract(this, v));
  }
  /**
   * Multiplies the current vector by another vector or scalar.
   *
   * @param v - The vector or scalar to multiply with.
   * @returns The updated vector after multiplication.
   */
  multiply(x: XComponent, y?: number, z?: number): Vec3 {
    if (typeof x === "number" && y === undefined && z === undefined) {
      return Vec3.from(getVectorClass().multiply(this, x));
    }
    let v: Vec3 = Vec3.from(x, y, z);
    return Vec3.from(getVectorClass().multiply(this, v));
  }
  /**
   * Divides the current vector by another vector or scalar.
   *
   * @param v - The vector or scalar to divide by.
   * @returns The updated vector after division.
   */
  divide(x: XComponent, y?: number, z?: number): Vec3 {
    if (typeof x === "number" && y === undefined && z === undefined) {
      return Vec3.from(getVectorClass().divide(this, x));
    }
    let v: Vec3 = Vec3.from(x, y, z);
    return Vec3.from(getVectorClass().divide(this, v));
  }
  /**
   * Normalizes the vector to have a length (magnitude) of 1.
   * Normalized vectors are often used as a direction vectors.
   *
   * @returns The normalized vector.
   */
  normalize(): Vec3 {
    return Vec3.from(new (getVectorClass())(this.x, this.y, this.z).normalized());
  }
  /**
   * Computes the length (magnitude) of the vector.
   *
   * @returns The length of the vector.
   */
  length(): number {
    return new (getVectorClass())(this.x, this.y, this.z).length();
  }
  /**
   * Computes the squared length of the vector.
   * This is faster than computing the actual length and can be useful for comparison purposes.
   *
   * @returns The squared length of the vector.
   */
  lengthSquared(): number {
    return new (getVectorClass())(this.x, this.y, this.z).lengthSquared();
  }
  /**
   * Computes the cross product of the current vector with another vector.
   * 
   * A cross product is a vector that is perpendicular to both vectors.
   *
   * @param v - The other vector.
   * @returns A new vector representing the cross product.
   */
  cross(x: XComponent, y?: number, z?: number): Vec3 {
    let v: Vec3 = Vec3.from(x, y, z);
    return Vec3.from(getVectorClass().cross(this, v));
  }
  /**
   * Computes the distance between the current vector and another vector.
   *
   * @param v - The other vector.
   * @returns The distance between the two vectors.
   */
  distance(x: XComponent, y?: number, z?: number): number {
    let v: Vec3 = Vec3.from(x, y, z);
    return getVectorClass().distance(this, v);
  }
  /**
   * Computes the squared distance between the current vector and another vector.
   * This is faster than computing the actual distance and can be useful for comparison purposes.
   *
   * @param v - The other vector.
   * @returns The squared distance between the two vectors.
   */
  distanceSquared(x: XComponent, y?: number, z?: number): number {
    let v: Vec3 = Vec3.from(x, y, z);
    return this.subtract(v).lengthSquared();
  }
  /**
   * Computes the linear interpolation between the current vector and another vector.
   *
   * @param v - The other vector.
   * @param t - The interpolation factor (0 <= t <= 1).
   * @returns A new vector after performing the lerp operation.
   */
  lerp(v: Vector3, t: number): Vec3 {
    if (!v || !t) return Vec3.from(this);
    return Vec3.from(getVectorClass().lerp(this, v, t));
  }
  /**
   * Computes the spherical linear interpolation between the current vector and another vector.
   *
   * @param v - The other vector.
   * @param t - The interpolation factor (0 <= t <= 1).
   * @returns A new vector after performing the slerp operation.
   */
  slerp(v: Vector3, t: number): Vec3 {
    if (!v || !t) return Vec3.from(this);
    return Vec3.from(getVectorClass().slerp(this, v, t));
  }
  /**
   * Computes the dot product of the current vector with another vector.
   *
   * @param v - The other vector.
   * @returns The dot product of the two vectors.
   */
  dot(x: XComponent, y?: number, z?: number): number {
    let v: Vec3 = Vec3.from(x, y, z);
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  /**
   * Computes the angle (in radians) between the current vector and another vector.
   *
   * @param v - The other vector.
   * @returns The angle in radians between the two vectors.
   *          To convert to degrees, use: angleInDegrees = angleInRadians * (180 / Math.PI).
   */
  angleBetween(x: XComponent, y?: number, z?: number): number {
    let v: Vec3 = Vec3.from(x, y, z);
    const dotProduct = this.dot(v);
    const lengths = this.length() * new Vec3(v.x, v.y, v.z).length();
    return Math.acos(dotProduct / lengths);
  }
  /**
   * Computes the projection of the current vector onto another vector.
   * This method finds how much of the current vector lies in the direction of vector `v`.
   *
   * @param v - The vector onto which the current vector will be projected.
   * @returns A new vector representing the projection of the current vector onto `v`.
   */
  projectOnto(x: XComponent, y?: number, z?: number): Vec3 {
    let v: Vec3 = Vec3.from(x, y, z);
    const scale = this.dot(v) / Vec3.from(v).dot(v);
    return Vec3.from(v.x * scale, v.y * scale, v.z * scale);
  }
  /**
   * Computes the reflection of the current vector against a normal vector.
   * Useful for simulating light reflections or bouncing objects.
   *
   * @param normal - The normal vector against which the current vector will be reflected.
   * @returns A new vector representing the reflection of the current vector.
   */
  reflect(x: XComponent, y?: number, z?: number): Vec3 {
    let normal: Vec3 = Vec3.from(x, y, z);
    const proj = this.projectOnto(normal);
    return this.subtract(proj.multiply(2));
  }
  /**
   * Sets the X component of the vector.
   *
   * @param value - The new X value.
   * @returns The updated vector with the new X value.
   */
  setX(value: number): Vec3 {
    return new Vec3(value, this.y, this.z);
  }
  /**
   * Sets the Y component of the vector.
   *
   * @param value - The new Y value.
   * @returns The updated vector with the new Y value.
   */
  setY(value: number): Vec3 {
    return new Vec3(this.x, value, this.z);
  }
  /**
   * Sets the Z component of the vector.
   *
   * @param value - The new Z value.
   * @returns The updated vector with the new Z value.
   */
  setZ(value: number): Vec3 {
    return new Vec3(this.x, this.y, value);
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
  distanceToLineSegment(start: Vector3, end: Vector3): number {
    const lineDirection = Vec3.from(end).subtract(start);
    const t = Math.max(0, Math.min(1, this.subtract(start).dot(lineDirection) / lineDirection.dot(lineDirection)));
    const projection = Vec3.from(start).add(lineDirection.multiply(t));
    return this.subtract(projection).length();
  }
  /**
   * Checks if the current vector is equal to another vector.
   * @param other
   */
  equals(x: XComponent, y?: number, z?: number) {
    let other: Vec3 = Vec3.from(x, y, z);
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  toString() {
    return `Vec3(${this.x}, ${this.y}, ${this.z})`;
  }
}