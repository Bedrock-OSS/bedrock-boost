import { Vector3 } from "@minecraft/server";
import Vec3 from "./vec3";

export class Vector implements Vector3 {
  /**
   * @remarks
   * X component of this vector.
   *
   */
  x: number;
  /**
   * @remarks
   * Y component of this vector.
   *
   */
  y: number;
  /**
   * @remarks
   * Z component of this vector.
   *
   */
  z: number;
  /**
   * @remarks
   * A constant vector that represents (0, 0, -1).
   *
   */
  static readonly back: Vector;
  /**
   * @remarks
   * A constant vector that represents (0, -1, 0).
   *
   */
  static readonly down: Vector;
  /**
   * @remarks
   * A constant vector that represents (0, 0, 1).
   *
   */
  static readonly forward: Vector;
  /**
   * @remarks
   * A constant vector that represents (-1, 0, 0).
   *
   */
  static readonly left: Vector;
  /**
   * @remarks
   * A constant vector that represents (1, 1, 1).
   *
   */
  static readonly one: Vector;
  /**
   * @remarks
   * A constant vector that represents (1, 0, 0).
   *
   */
  static readonly right: Vector;
  /**
   * @remarks
   * A constant vector that represents (0, 1, 0).
   *
   */
  static readonly up: Vector;
  /**
   * @remarks
   * A constant vector that represents (0, 0, 0).
   *
   */
  static readonly zero: Vector;
  /**
   * @remarks
   * Creates a new instance of an abstract vector.
   *
   * @param x
   * X component of the vector.
   * @param y
   * Y component of the vector.
   * @param z
   * Z component of the vector.
   */
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * @remarks
   * Compares this vector and another vector to one another.
   *
   * @param other
   * Other vector to compare this vector to.
   * @returns
   * True if the two vectors are equal.
   */
  equals(other: Vector): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
  /**
   * @remarks
   * Returns the length of this vector.
   *
   */
  length(): number {
    return Math.sqrt(this.lengthSquared());
  }
  /**
   * @remarks
   * Returns the squared length of this vector.
   *
   */
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**
   * @remarks
   * Returns this vector as a normalized vector.
   *
   */
  normalized(): Vector {
    const length = this.length();
    if (length === 0) return Vector.zero;
    return new Vector(this.x / length, this.y / length, this.z / length);
  }
  /**
   * @remarks
   * Returns the addition of these vectors.
   *
   */
  static add(a: Vector3, b: Vector3): Vector {
    return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
  }
  /**
   * @remarks
   * Returns the cross product of these two vectors.
   *
   */
  static cross(a: Vector3, b: Vector3): Vector {
    return new Vector(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x,
    );
  }
  /**
   * @remarks
   * Returns the distance between two vectors.
   *
   */
  static distance(a: Vector3, b: Vector3): number {
    const x = a.x - b.x;
    const y = a.y - b.y;
    const z = a.z - b.z;
    return Math.sqrt(x * x + y * y + z * z);
  }
  /**
   * @remarks
   * Returns the component-wise division of these vectors.
   *
   * @throws This function can throw errors.
   */
  static divide(a: Vector3, b: number | Vector3): Vector {
    if (typeof b === "number") {
      if (b === 0) throw new Error("Cannot divide by zero");
      return new Vector(a.x / b, a.y / b, a.z / b);
    }
    if (b.x === 0 || b.y === 0 || b.z === 0)
      throw new Error("Cannot divide by zero");
    return new Vector(a.x / b.x, a.y / b.y, a.z / b.z);
  }
  /**
   * @remarks
   * Returns the linear interpolation between a and b using t as
   * the control.
   *
   */
  static lerp(a: Vector3, b: Vector3, t: number): Vector {
    return new Vector(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t,
      a.z + (b.z - a.z) * t,
    );
  }
  /**
   * @remarks
   * Returns a vector that is made from the largest components of
   * two vectors.
   *
   */
  static max(a: Vector3, b: Vector3): Vector {
    return new Vector(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y),
      Math.max(a.z, b.z),
    );
  }
  /**
   * @remarks
   * Returns a vector that is made from the smallest components
   * of two vectors.
   *
   */
  static min(a: Vector3, b: Vector3): Vector {
    return new Vector(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y),
      Math.min(a.z, b.z),
    );
  }
  /**
   * @remarks
   * Returns the component-wise product of these vectors.
   *
   */
  static multiply(a: Vector3, b: number | Vector3): Vector {
    if (typeof b === "number") return new Vector(a.x * b, a.y * b, a.z * b);
    return new Vector(a.x * b.x, a.y * b.y, a.z * b.z);
  }
  /**
   * @remarks
   * Returns the spherical linear interpolation between a and b
   * using s as the control.
   *
   */
  static slerp(a: Vector3, b: Vector3, s: number): Vector {
    const dot = Vec3.from(a).dot(b);
    const theta = Math.acos(dot) * s;
    const relative = Vec3.from(b).subtract(Vec3.from(a).multiply(dot)).normalize();
    return Vec3.from(a)
      .multiply(Math.cos(theta))
      .add(relative.multiply(Math.sin(theta)))
      .toVector() as Vector;
  
  }
  /**
   * @remarks
   * Returns the subtraction of these vectors.
   *
   */
  static subtract(a: Vector3, b: Vector3): Vector {
    return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
  }
}