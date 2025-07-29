import {
    Vector3,
    Direction,
    Vector2,
    StructureRotation,
} from '@minecraft/server';
import { Logger } from './Logging';

type VectorLike = Vector3 | Vec3 | Direction | number[] | number;

export default class Vec3 implements Vector3 {
    private static readonly log = Logger.getLogger(
        'vec3',
        'vec3',
        'bedrock-boost'
    );
    /**
     * Zero vector
     */
    public static readonly Zero = new Vec3(0, 0, 0);
    /**
     * Down vector, negative towards Y
     */
    public static readonly Down = new Vec3(Direction.Down);
    /**
     * Up vector, positive towards Y
     */
    public static readonly Up = new Vec3(Direction.Up);
    /**
     * North vector, negative towards Z
     */
    public static readonly North = new Vec3(Direction.North);
    /**
     * South vector, positive towards Z
     */
    public static readonly South = new Vec3(Direction.South);
    /**
     * East vector, positive towards X
     */
    public static readonly East = new Vec3(Direction.East);
    /**
     * West vector, negative towards X
     */
    public static readonly West = new Vec3(Direction.West);

    readonly x: number;
    readonly y: number;
    readonly z: number;
    constructor(x: number, y: number, z: number);
    constructor(x: Vec3);
    constructor(x: Vector3);
    constructor(x: Direction);
    constructor(x: number[]);
    constructor(x: VectorLike, y?: number, z?: number) {
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
            this.z = -1;
        } else if (x === Direction.South) {
            this.x = 0;
            this.y = 0;
            this.z = 1;
        } else if (x === Direction.East) {
            this.x = 1;
            this.y = 0;
            this.z = 0;
        } else if (x === Direction.West) {
            this.x = -1;
            this.y = 0;
            this.z = 0;
        } else if (typeof x === 'number') {
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
            if (
                !x ||
                (!x.x && x.x !== 0) ||
                (!x.y && x.y !== 0) ||
                (!x.z && x.z !== 0)
            ) {
                Vec3.log.error(new Error('Invalid vector'), x);
                throw new Error('Invalid vector');
            }
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        }
    }
    /**
     * Creates a new vector from the given values.
     */
    static from(x: number, y: number, z: number): Vec3;
    static from(x: Vec3): Vec3;
    static from(x: Vector3): Vec3;
    static from(x: Direction): Vec3;
    static from(x: number[]): Vec3;
    static from(x: VectorLike, y?: number, z?: number): Vec3 {
        if (x instanceof Vec3) return x;
        if (typeof x === 'number' && y !== undefined && z !== undefined) {
            return new Vec3(x, y, z);
        }
        if (Array.isArray(x)) {
            return new Vec3(x);
        }
        if (x === Direction.Down) return Vec3.Down;
        if (x === Direction.Up) return Vec3.Up;
        if (x === Direction.North) return Vec3.North;
        if (x === Direction.South) return Vec3.South;
        if (x === Direction.East) return Vec3.East;
        if (x === Direction.West) return Vec3.West;
        if (
            !x ||
            (!(x as any).x && (x as any).x !== 0) ||
            (!(x as any).y && (x as any).y !== 0) ||
            (!(x as any).z && (x as any).z !== 0)
        ) {
            Vec3.log.error(new Error('Invalid arguments'), x, y, z);
            throw new Error('Invalid arguments');
        }
        return new Vec3(
            (x as any).x as number,
            (x as any).y as number,
            (x as any).z as number
        );
    }
    private static _from(x: VectorLike, y?: number, z?: number): Vec3 {
        if (x instanceof Vec3) return x;
        if (typeof x === 'number' && y !== undefined && z !== undefined) {
            return new Vec3(x, y, z);
        }
        if (Array.isArray(x)) {
            return new Vec3(x);
        }
        if (x === Direction.Down) return Vec3.Down;
        if (x === Direction.Up) return Vec3.Up;
        if (x === Direction.North) return Vec3.North;
        if (x === Direction.South) return Vec3.South;
        if (x === Direction.East) return Vec3.East;
        if (x === Direction.West) return Vec3.West;
        if (
            !x ||
            (!(x as any).x && (x as any).x !== 0) ||
            (!(x as any).y && (x as any).y !== 0) ||
            (!(x as any).z && (x as any).z !== 0)
        ) {
            Vec3.log.error(new Error('Invalid arguments'), x, y, z);
            throw new Error('Invalid arguments');
        }
        return new Vec3(
            (x as any).x as number,
            (x as any).y as number,
            (x as any).z as number
        );
    }
    /**
     * Creates a copy of the current vector.
     *
     * @returns A new vector with the same values as the current vector.
     */
    copy(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }
    /**
     * Creates a new direction vector from yaw and pitch values.
     *
     * @param rotation - The yaw and pitch values in degrees.
     * @returns A new vector representing the direction.
     * @deprecated Use fromRotation() instead. This method returns inverted values and will be removed in the future.
     */
    static fromYawPitch(rotation: Vector2): Vec3;
    /**
     * Creates a new direction vector from yaw and pitch values.
     *
     * @param yaw - The yaw value in degrees.
     * @param pitch - The pitch value in degrees.
     * @returns A new vector representing the direction.
     * @deprecated Use fromRotation() instead. This method returns inverted values and will be removed in the future.
     */
    static fromYawPitch(yaw: number, pitch: number): Vec3;
    static fromYawPitch(yawOrRotation: number | Vector2, pitch?: number): Vec3 {
        let yaw: number;
        if (typeof yawOrRotation === 'number') {
            yaw = yawOrRotation as number;
            pitch = pitch!;
        } else {
            yaw = yawOrRotation.y;
            pitch = yawOrRotation.x;
        }
        // Convert degrees to radians
        const psi = yaw * (Math.PI / 180);
        const theta = pitch * (Math.PI / 180);

        const x = Math.cos(theta) * Math.sin(psi);
        const y = Math.sin(theta);
        const z = Math.cos(theta) * Math.cos(psi);
        return new Vec3(x, y, z);
    }

    /**
     * Creates a new direction vector from yaw and pitch values.
     *
     * @param rotation - The yaw and pitch values in degrees.
     * @returns A new vector representing the direction.
     */
    static fromRotation(rotation: Vector2): Vec3;
    /**
     * Creates a new direction vector from yaw and pitch values.
     *
     * @param yaw - The yaw value in degrees.
     * @param pitch - The pitch value in degrees.
     * @returns A new vector representing the direction.
     */
    static fromRotation(yaw: number, pitch: number): Vec3;
    static fromRotation(yawOrRotation: number | Vector2, pitch?: number): Vec3 {
        let yaw: number;
        if (typeof yawOrRotation === 'number') {
            yaw = yawOrRotation as number;
            pitch = pitch!;
        } else {
            yaw = yawOrRotation.y;
            pitch = yawOrRotation.x;
        }
        // Convert degrees to radians
        const psi = yaw * (Math.PI / 180);
        const theta = pitch * (Math.PI / 180);

        const x = -Math.cos(theta) * Math.sin(psi);
        const y = -Math.sin(theta);
        const z = Math.cos(theta) * Math.cos(psi);
        return new Vec3(x, y, z);
    }

    /**
     * Converts the normal vector to yaw and pitch values.
     *
     * @returns A Vector2 containing the yaw and pitch values.
     * @deprecated Use toRotation() instead. This method returns inverted values and will be removed in the future.
     */
    toYawPitch(): Vector2 {
        if (this.isZero()) {
            Vec3.log.error(
                new Error('Cannot convert zero-length vector to direction')
            );
            throw new Error('Cannot convert zero-length vector to direction');
        }
        const direction = this.normalize();
        const yaw = Math.atan2(direction.x, direction.z) * (180 / Math.PI);
        const pitch = Math.asin(direction.y) * (180 / Math.PI);
        return {
            x: pitch,
            y: yaw,
        };
    }

    /**
     * Converts the normal vector to yaw and pitch values.
     *
     * @returns A Vector2 containing the yaw and pitch values.
     */
    toRotation(): Vector2 {
        if (this.isZero()) {
            Vec3.log.error(
                new Error('Cannot convert zero-length vector to direction')
            );
            throw new Error('Cannot convert zero-length vector to direction');
        }
        const direction = this.normalize();
        const yaw = -Math.atan2(direction.x, direction.z) * (180 / Math.PI);
        const pitch = Math.asin(-direction.y) * (180 / Math.PI);
        return {
            x: pitch,
            y: yaw,
        };
    }
    /**
     * Adds three numbers to the current vector.
     *
     * @param x - The x component to be added.
     * @param y - The y component to be added.
     * @param z - The z component to be added.
     * @returns The updated vector after addition.
     */
    add(x: number, y: number, z: number): Vec3;

    /**
     * Adds another Vec3 to the current vector.
     *
     * @param x - The Vec3 to be added.
     * @returns The updated vector after addition.
     */
    add(x: Vec3): Vec3;

    /**
     * Adds another Vector3 to the current vector.
     *
     * @param x - The Vector3 to be added.
     * @returns The updated vector after addition.
     */
    add(x: Vector3): Vec3;

    /**
     * Adds a Direction to the current vector.
     *
     * @param x - The Direction to be added.
     * @returns The updated vector after addition.
     */
    add(x: Direction): Vec3;

    /**
     * Adds an array of numbers to the current vector.
     *
     * @param x - The array of numbers to be added.
     * @returns The updated vector after addition.
     */
    add(x: number[]): Vec3;

    add(x: VectorLike, y?: number, z?: number): Vec3 {
        const v: Vec3 = Vec3._from(x, y, z);
        return Vec3.from(v.x + this.x, v.y + this.y, v.z + this.z);
    }

    /**
     * Subtracts three numbers from the current vector.
     *
     * @param x - The x component to be subtracted.
     * @param y - The y component to be subtracted.
     * @param z - The z component to be subtracted.
     * @returns The updated vector after subtraction.
     */
    subtract(x: number, y: number, z: number): Vec3;

    /**
     * Subtracts another Vec3 from the current vector.
     *
     * @param x - The Vec3 to be subtracted.
     * @returns The updated vector after subtraction.
     */
    subtract(x: Vec3): Vec3;

    /**
     * Subtracts another Vector3 from the current vector.
     *
     * @param x - The Vector3 to be subtracted.
     * @returns The updated vector after subtraction.
     */
    subtract(x: Vector3): Vec3;

    /**
     * Subtracts a Direction from the current vector.
     *
     * @param x - The Direction to be subtracted.
     * @returns The updated vector after subtraction.
     */
    subtract(x: Direction): Vec3;

    /**
     * Subtracts an array of numbers from the current vector.
     *
     * @param x - The array of numbers to be subtracted.
     * @returns The updated vector after subtraction.
     */
    subtract(x: number[]): Vec3;

    subtract(x: VectorLike, y?: number, z?: number): Vec3 {
        const v: Vec3 = Vec3._from(x, y, z);
        return Vec3.from(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    /**
     * Multiplies the current vector by three numbers.
     *
     * @param x - The multiplier for the x component.
     * @param y - The multiplier for the y component.
     * @param z - The multiplier for the z component.
     * @returns The updated vector after multiplication.
     */
    multiply(x: number, y: number, z: number): Vec3;

    /**
     * Multiplies the current vector by another Vec3.
     *
     * @param x - The Vec3 multiplier.
     * @returns The updated vector after multiplication.
     */
    multiply(x: Vec3): Vec3;

    /**
     * Multiplies the current vector by another Vector3.
     *
     * @param x - The Vector3 multiplier.
     * @returns The updated vector after multiplication.
     */
    multiply(x: Vector3): Vec3;

    /**
     * Multiplies the current vector by a Direction.
     *
     * @param x - The Direction multiplier.
     * @returns The updated vector after multiplication.
     */
    multiply(x: Direction): Vec3;

    /**
     * Multiplies the current vector by an array of numbers.
     *
     * @param x - The array multiplier.
     * @returns The updated vector after multiplication.
     */
    multiply(x: number[]): Vec3;

    /**
     * Multiplies the current vector by a scalar.
     *
     * @param x - The scalar multiplier.
     * @returns The updated vector after multiplication.
     */
    multiply(x: number): Vec3;

    multiply(x: VectorLike, y?: number, z?: number): Vec3 {
        if (typeof x === 'number' && y === undefined && z === undefined) {
            return Vec3.from(this.x * x, this.y * x, this.z * x);
        }
        const v: Vec3 = Vec3._from(x, y, z);
        return Vec3.from(v.x * this.x, v.y * this.y, v.z * this.z);
    }

    /**
     * Scales the current vector by a scalar.
     *
     * @param scalar - The scalar to scale the vector by.
     * @returns The updated vector after scaling.
     */
    scale(scalar: number): Vec3 {
        return Vec3.from(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    /**
     * Divides the current vector by three numbers.
     *
     * @param x - The divisor for the x component.
     * @param y - The divisor for the y component.
     * @param z - The divisor for the z component.
     * @returns The updated vector after division.
     */
    divide(x: number, y: number, z: number): Vec3;

    /**
     * Divides the current vector by another Vec3.
     *
     * @param x - The Vec3 divisor.
     * @returns The updated vector after division.
     */
    divide(x: Vec3): Vec3;

    /**
     * Divides the current vector by another Vector3.
     *
     * @param x - The Vector3 divisor.
     * @returns The updated vector after division.
     */
    divide(x: Vector3): Vec3;

    /**
     * Divides the current vector by a Direction.
     *
     * @param x - The Direction divisor.
     * @returns The updated vector after division.
     */
    divide(x: Direction): Vec3;

    /**
     * Divides the current vector by an array of numbers.
     *
     * @param x - The array divisor.
     * @returns The updated vector after division.
     */
    divide(x: number[]): Vec3;

    /**
     * Divides the current vector by a scalar.
     *
     * @param x - The scalar divisor.
     * @returns The updated vector after division.
     */
    divide(x: number): Vec3;

    divide(x: VectorLike, y?: number, z?: number): Vec3 {
        if (typeof x === 'number' && y === undefined && z === undefined) {
            if (x === 0) throw new Error('Cannot divide by zero');
            return Vec3.from(this.x / x, this.y / x, this.z / x);
        }
        const v: Vec3 = Vec3._from(x, y, z);
        if (v.x === 0 || v.y === 0 || v.z === 0)
            throw new Error('Cannot divide by zero');
        return Vec3.from(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    /**
     * Normalizes the vector to have a length (magnitude) of 1.
     * Normalized vectors are often used as a direction vectors.
     *
     * @returns The normalized vector.
     */
    normalize(): Vec3 {
        if (this.isZero()) {
            Vec3.log.error(new Error('Cannot normalize zero-length vector'));
            throw new Error('Cannot normalize zero-length vector');
        }
        const len = this.length();
        return Vec3.from(this.x / len, this.y / len, this.z / len);
    }
    /**
     * Computes the length (magnitude) of the vector.
     *
     * @returns The length of the vector.
     */
    length(): number {
        return Math.hypot(this.x, this.y, this.z);
    }
    /**
     * Computes the squared length of the vector.
     * This is faster than computing the actual length and can be useful for comparison purposes.
     *
     * @returns The squared length of the vector.
     */
    lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    /**
     * Computes the cross product of the current vector with three numbers.
     *
     * A cross product is a vector that is perpendicular to both vectors.
     *
     * @param x - The x component of the other vector.
     * @param y - The y component of the other vector.
     * @param z - The z component of the other vector.
     * @returns A new vector representing the cross product.
     */
    cross(x: number, y: number, z: number): Vec3;

    /**
     * Computes the cross product of the current vector with another Vec3.
     *
     * A cross product is a vector that is perpendicular to both vectors.
     *
     * @param x - The Vec3 to be crossed.
     * @returns A new vector representing the cross product.
     */
    cross(x: Vec3): Vec3;

    /**
     * Computes the cross product of the current vector with another Vector3.
     *
     * A cross product is a vector that is perpendicular to both vectors.
     *
     * @param x - The Vector3 to be crossed.
     * @returns A new vector representing the cross product.
     */
    cross(x: Vector3): Vec3;

    /**
     * Computes the cross product of the current vector with a Direction.
     *
     * A cross product is a vector that is perpendicular to both vectors.
     *
     * @param x - The Direction to be crossed.
     * @returns A new vector representing the cross product.
     */
    cross(x: Direction): Vec3;

    /**
     * Computes the cross product of the current vector with an array of numbers.
     *
     * A cross product is a vector that is perpendicular to both vectors.
     *
     * @param x - The array of numbers representing a vector.
     * @returns A new vector representing the cross product.
     */
    cross(x: number[]): Vec3;

    cross(x: VectorLike, y?: number, z?: number): Vec3 {
        const v: Vec3 = Vec3._from(x, y, z);
        return Vec3.from(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    /**
     * Computes the distance between the current vector and a vector represented by three numbers.
     *
     * @param x - The x component of the other vector.
     * @param y - The y component of the other vector.
     * @param z - The z component of the other vector.
     * @returns The distance between the two vectors.
     */
    distance(x: number, y: number, z: number): number;

    /**
     * Computes the distance between the current vector and another Vec3.
     *
     * @param x - The Vec3 to measure the distance to.
     * @returns The distance between the two vectors.
     */
    distance(x: Vec3): number;

    /**
     * Computes the distance between the current vector and another Vector3.
     *
     * @param x - The Vector3 to measure the distance to.
     * @returns The distance between the two vectors.
     */
    distance(x: Vector3): number;

    /**
     * Computes the distance between the current vector and a Direction.
     *
     * @param x - The Direction to measure the distance to.
     * @returns The distance between the two vectors.
     */
    distance(x: Direction): number;

    /**
     * Computes the distance between the current vector and a vector represented by an array of numbers.
     *
     * @param x - The array of numbers representing the other vector.
     * @returns The distance between the two vectors.
     */
    distance(x: number[]): number;

    distance(x: VectorLike, y?: number, z?: number): number {
        const v: Vec3 = Vec3._from(x, y, z);
        return this.subtract(v).length();
    }

    /**
     * Computes the squared distance between the current vector and a vector represented by three numbers.
     * This is faster than computing the actual distance and can be useful for comparison purposes.
     *
     * @param x - The x component of the other vector.
     * @param y - The y component of the other vector.
     * @param z - The z component of the other vector.
     * @returns The squared distance between the two vectors.
     */
    distanceSquared(x: number, y: number, z: number): number;

    /**
     * Computes the squared distance between the current vector and another Vec3.
     * This is faster than computing the actual distance and can be useful for comparison purposes.
     *
     * @param x - The Vec3 to measure the squared distance to.
     * @returns The squared distance between the two vectors.
     */
    distanceSquared(x: Vec3): number;

    /**
     * Computes the squared distance between the current vector and another Vector3.
     * This is faster than computing the actual distance and can be useful for comparison purposes.
     *
     * @param x - The Vector3 to measure the squared distance to.
     * @returns The squared distance between the two vectors.
     */
    distanceSquared(x: Vector3): number;

    /**
     * Computes the squared distance between the current vector and a Direction.
     * This is faster than computing the actual distance and can be useful for comparison purposes.
     *
     * @param x - The Direction to measure the squared distance to.
     * @returns The squared distance between the two vectors.
     */
    distanceSquared(x: Direction): number;

    /**
     * Computes the squared distance between the current vector and a vector represented by an array of numbers.
     * This is faster than computing the actual distance and can be useful for comparison purposes.
     *
     * @param x - The array of numbers representing the other vector.
     * @returns The squared distance between the two vectors.
     */
    distanceSquared(x: number[]): number;

    distanceSquared(x: VectorLike, y?: number, z?: number): number {
        const v: Vec3 = Vec3._from(x, y, z);
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
    lerp(v: Vector3, t: number): Vec3 {
        if (!v || !t) return Vec3.from(this);
        if (t === 1) return Vec3.from(v);
        if (t === 0) return Vec3.from(this);
        return Vec3.from(
            this.x + (v.x - this.x) * t,
            this.y + (v.y - this.y) * t,
            this.z + (v.z - this.z) * t
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
    slerp(v: Vector3, t: number): Vec3 {
        if (!v || !t) return Vec3.from(this);
        if (t === 1) return Vec3.from(v);
        if (t === 0) return Vec3.from(this);
        const dot = this.dot(v);
        const theta = Math.acos(dot) * t;
        const relative = Vec3.from(v).subtract(this.multiply(dot)).normalize();
        return this.multiply(Math.cos(theta)).add(
            relative.multiply(Math.sin(theta))
        );
    }
    /**
     * Computes the dot product of the current vector with a vector specified by three numbers.
     *
     * @param x - The x component of the other vector.
     * @param y - The y component of the other vector.
     * @param z - The z component of the other vector.
     * @returns The dot product of the two vectors.
     */
    dot(x: number, y: number, z: number): number;

    /**
     * Computes the dot product of the current vector with another Vec3.
     *
     * @param x - The Vec3 to compute the dot product with.
     * @returns The dot product of the two vectors.
     */
    dot(x: Vec3): number;

    /**
     * Computes the dot product of the current vector with another Vector3.
     *
     * @param x - The Vector3 to compute the dot product with.
     * @returns The dot product of the two vectors.
     */
    dot(x: Vector3): number;

    /**
     * Computes the dot product of the current vector with a Direction.
     *
     * @param x - The Direction to compute the dot product with.
     * @returns The dot product of the two vectors.
     */
    dot(x: Direction): number;

    /**
     * Computes the dot product of the current vector with a vector represented by an array of numbers.
     *
     * @param x - The array of numbers representing the other vector.
     * @returns The dot product of the two vectors.
     */
    dot(x: number[]): number;

    dot(x: VectorLike, y?: number, z?: number): number {
        const v: Vec3 = Vec3._from(x, y, z);
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Computes the angle (in radians) between the current vector and a vector specified by three numbers.
     *
     * @param x - The x component of the other vector.
     * @param y - The y component of the other vector.
     * @param z - The z component of the other vector.
     * @returns The angle in radians between the two vectors.
     */
    angleBetween(x: number, y: number, z: number): number;

    /**
     * Computes the angle (in radians) between the current vector and another Vec3.
     *
     * @param x - The Vec3 to compute the angle with.
     * @returns The angle in radians between the two vectors.
     */
    angleBetween(x: Vec3): number;

    /**
     * Computes the angle (in radians) between the current vector and another Vector3.
     *
     * @param x - The Vector3 to compute the angle with.
     * @returns The angle in radians between the two vectors.
     */
    angleBetween(x: Vector3): number;

    /**
     * Computes the angle (in radians) between the current vector and a Direction.
     *
     * @param x - The Direction to compute the angle with.
     * @returns The angle in radians between the two vectors.
     */
    angleBetween(x: Direction): number;

    /**
     * Computes the angle (in radians) between the current vector and a vector represented by an array of numbers.
     *
     * @param x - The array of numbers representing the other vector.
     * @returns The angle in radians between the two vectors.
     */
    angleBetween(x: number[]): number;

    angleBetween(x: VectorLike, y?: number, z?: number): number {
        const v: Vec3 = Vec3._from(x, y, z);
        const dotProduct = this.dot(v);
        const lenSq1 = this.lengthSquared();
        if (lenSq1 === 0) {
            return 0;
        }
        const lenSq2 = v.lengthSquared();
        if (lenSq2 === 0) {
            return 0;
        }
        const denom = Math.sqrt(lenSq1 * lenSq2);
        // Clamp for numerical stability
        const cosAngle = Math.min(1, Math.max(-1, dotProduct / denom));
        return Math.acos(cosAngle);
    }

    /**
     * Computes the projection of the current vector onto a vector specified by three numbers.
     * This method finds how much of the current vector lies in the direction of the given vector.
     *
     * @param x - The x component of the vector to project onto.
     * @param y - The y component of the vector to project onto.
     * @param z - The z component of the vector to project onto.
     * @returns A new vector representing the projection of the current vector.
     */
    projectOnto(x: number, y: number, z: number): Vec3;

    /**
     * Computes the projection of the current vector onto another Vec3.
     * This method finds how much of the current vector lies in the direction of the given vector.
     *
     * @param x - The Vec3 to project onto.
     * @returns A new vector representing the projection of the current vector.
     */
    projectOnto(x: Vec3): Vec3;

    /**
     * Computes the projection of the current vector onto another Vector3.
     * This method finds how much of the current vector lies in the direction of the given vector.
     *
     * @param x - The Vector3 to project onto.
     * @returns A new vector representing the projection of the current vector.
     */
    projectOnto(x: Vector3): Vec3;

    /**
     * Computes the projection of the current vector onto a Direction.
     * This method finds how much of the current vector lies in the direction of the given vector.
     *
     * @param x - The Direction to project onto.
     * @returns A new vector representing the projection of the current vector.
     */
    projectOnto(x: Direction): Vec3;

    /**
     * Computes the projection of the current vector onto a vector represented by an array of numbers.
     * This method finds how much of the current vector lies in the direction of the given vector.
     *
     * @param x - The array of numbers representing the vector to project onto.
     * @returns A new vector representing the projection of the current vector.
     */
    projectOnto(x: number[]): Vec3;

    projectOnto(x: VectorLike, y?: number, z?: number): Vec3 {
        const v: Vec3 = Vec3._from(x, y, z);
        // If the vector is zero-length, then the projection is the zero vector.
        if (v.isZero()) {
            return Vec3.Zero;
        }
        const denom = v.dot(v);
        if (denom === 0) {
            return Vec3.Zero;
        }
        const scale = this.dot(v) / denom;
        return Vec3.from(v.x * scale, v.y * scale, v.z * scale);
    }

    /**
     * Computes the reflection of the current vector against a normal vector specified by three numbers.
     * Useful for simulating light reflections or bouncing objects.
     *
     * @param x - The x component of the normal vector.
     * @param y - The y component of the normal vector.
     * @param z - The z component of the normal vector.
     * @returns A new vector representing the reflection of the current vector.
     */
    reflect(x: number, y: number, z: number): Vec3;

    /**
     * Computes the reflection of the current vector against another Vec3 normal vector.
     * Useful for simulating light reflections or bouncing objects.
     *
     * @param x - The Vec3 representing the normal vector.
     * @returns A new vector representing the reflection of the current vector.
     */
    reflect(x: Vec3): Vec3;

    /**
     * Computes the reflection of the current vector against another Vector3 normal vector.
     * Useful for simulating light reflections or bouncing objects.
     *
     * @param x - The Vector3 representing the normal vector.
     * @returns A new vector representing the reflection of the current vector.
     */
    reflect(x: Vector3): Vec3;

    /**
     * Computes the reflection of the current vector against a Direction normal vector.
     * Useful for simulating light reflections or bouncing objects.
     *
     * @param x - The Direction representing the normal vector.
     * @returns A new vector representing the reflection of the current vector.
     */
    reflect(x: Direction): Vec3;

    /**
     * Computes the reflection of the current vector against a normal vector represented by an array of numbers.
     * Useful for simulating light reflections or bouncing objects.
     *
     * @param x - The array of numbers representing the normal vector.
     * @returns A new vector representing the reflection of the current vector.
     */
    reflect(x: number[]): Vec3;

    reflect(x: VectorLike, y?: number, z?: number): Vec3 {
        const normal: Vec3 = Vec3._from(x, y, z);
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
    rotate(axis: Vector3, angle: number): Vec3 {
        // Convert angle from degrees to radians and compute half angle
        const halfAngle = (angle * Math.PI) / 180 / 2;

        // Quaternion representing the rotation
        const w = Math.cos(halfAngle);
        const x = axis.x * Math.sin(halfAngle);
        const y = axis.y * Math.sin(halfAngle);
        const z = axis.z * Math.sin(halfAngle);
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const v = this;

        // Rotate vector (v) using quaternion
        // Simplified direct computation reflecting quaternion rotation and its conjugate effect
        const qv_x =
            w * w * v.x +
            2 * y * w * v.z -
            2 * z * w * v.y +
            x * x * v.x +
            2 * y * x * v.y +
            2 * z * x * v.z -
            z * z * v.x -
            y * y * v.x;
        const qv_y =
            2 * x * y * v.x +
            y * y * v.y +
            2 * z * y * v.z +
            2 * w * z * v.x -
            z * z * v.y +
            w * w * v.y -
            2 * x * w * v.z -
            x * x * v.y;
        const qv_z =
            2 * x * z * v.x +
            2 * y * z * v.y +
            z * z * v.z -
            2 * w * y * v.x -
            y * y * v.z +
            2 * w * x * v.y -
            x * x * v.z +
            w * w * v.z;

        return new Vec3(qv_x, qv_y, qv_z);
    }
    /**
     * Updates the X, Y, and Z components of the vector.
     *
     * @param x - The function to use to update the X value.
     * @param y - The function to use to update the Y value.
     * @param z - The function to use to update the Z value.
     * @returns The updated vector with the new values.
     */
    update(
        x: ((x: number) => number) | undefined,
        y: ((y: number) => number) | undefined,
        z: ((z: number) => number) | undefined
    ): Vec3 {
        if (!x) {
            x = (value: number) => value;
        }
        if (!y) {
            y = (value: number) => value;
        }
        if (!z) {
            z = (value: number) => value;
        }
        return new Vec3(x(this.x), y(this.y), z(this.z));
    }
    /**
     * Sets the X component of the vector.
     *
     * @param value - The new X value.
     * @returns The updated vector with the new X value.
     */
    setX(value: number): Vec3;
    setX(value: (x: number) => number): Vec3;
    setX(value: number | ((x: number) => number)): Vec3 {
        if (typeof value === 'number') {
            return new Vec3(value, this.y, this.z);
        }
        return new Vec3(value(this.x), this.y, this.z);
    }
    /**
     * Sets the Y component of the vector.
     *
     * @param value - The new Y value.
     * @returns The updated vector with the new Y value.
     */
    setY(value: number): Vec3;
    setY(value: (y: number) => number): Vec3;
    setY(value: number | ((y: number) => number)): Vec3 {
        if (typeof value === 'number') {
            return new Vec3(this.x, value, this.z);
        }
        return new Vec3(this.x, value(this.y), this.z);
    }
    /**
     * Sets the Z component of the vector.
     *
     * @param value - The new Z value.
     * @returns The updated vector with the new Z value.
     */
    setZ(value: number): Vec3;
    setZ(value: (z: number) => number): Vec3;
    setZ(value: number | ((z: number) => number)): Vec3 {
        if (typeof value === 'number') {
            return new Vec3(this.x, this.y, value);
        }
        return new Vec3(this.x, this.y, value(this.z));
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
        // If the line is zero-length, then the distance is the distance to the start point.
        if (lineDirection.lengthSquared() === 0) {
            return this.subtract(start).length();
        }
        const t = Math.max(
            0,
            Math.min(
                1,
                this.subtract(start).dot(lineDirection) /
                    lineDirection.dot(lineDirection)
            )
        );
        const projection = Vec3.from(start).add(lineDirection.multiply(t));
        return this.subtract(projection).length();
    }
    /**
     * Floors the X, Y, and Z components of the vector.
     * @returns A new vector with the floored components.
     */
    floor(): Vec3 {
        return this.update(Math.floor, Math.floor, Math.floor);
    }
    /**
     * Floors the X component of the vector.
     * @returns A new vector with the floored X component.
     */
    floorX(): Vec3 {
        return this.setX(Math.floor);
    }
    /**
     * Floors the Y component of the vector.
     * @returns A new vector with the floored Y component.
     */
    floorY(): Vec3 {
        return this.setY(Math.floor);
    }
    /**
     * Floors the Z component of the vector.
     * @returns A new vector with the floored Z component.
     */
    floorZ(): Vec3 {
        return this.setZ(Math.floor);
    }
    /**
     * Ceils the X, Y, and Z components of the vector.
     * @returns A new vector with the ceiled components.
     */
    ceil(): Vec3 {
        return new Vec3(
            Math.ceil(this.x),
            Math.ceil(this.y),
            Math.ceil(this.z)
        );
    }
    /**
     * Ceils the X component of the vector.
     * @returns A new vector with the ceiled X component.
     */
    ceilX(): Vec3 {
        return this.setX(Math.ceil);
    }
    /**
     * Ceils the Y component of the vector.
     * @returns A new vector with the ceiled Y component.
     */
    ceilY(): Vec3 {
        return this.setY(Math.ceil);
    }
    /**
     * Ceils the Z component of the vector.
     * @returns A new vector with the ceiled Z component.
     */
    ceilZ(): Vec3 {
        return this.setZ(Math.ceil);
    }
    /**
     * Rounds the X, Y, and Z components of the vector.
     * @returns A new vector with the rounded components.
     */
    round(): Vec3 {
        return this.update(Math.round, Math.round, Math.round);
    }
    /**
     * Rounds the X component of the vector.
     * @returns A new vector with the rounded X component.
     */
    roundX(): Vec3 {
        return this.setX(Math.round);
    }
    /**
     * Rounds the Y component of the vector.
     * @returns A new vector with the rounded Y component.
     */
    roundY(): Vec3 {
        return this.setY(Math.round);
    }
    /**
     * Rounds the Z component of the vector.
     * @returns A new vector with the rounded Z component.
     */
    roundZ(): Vec3 {
        return this.setZ(Math.round);
    }
    /**
     * Returns a new vector offset from the current vector up by 1 block.
     * @returns A new vector offset from the current vector up by 1 block.
     */
    up(): Vec3 {
        return this.add(Vec3.Up);
    }
    /**
     * Returns a new vector offset from the current vector down by 1 block.
     * @returns A new vector offset from the current vector down by 1 block.
     */
    down(): Vec3 {
        return this.add(Vec3.Down);
    }
    /**
     * Returns a new vector offset from the current vector north by 1 block.
     * @returns A new vector offset from the current vector north by 1 block.
     */
    north(): Vec3 {
        return this.add(Vec3.North);
    }
    /**
     * Returns a new vector offset from the current vector south by 1 block.
     * @returns A new vector offset from the current vector south by 1 block.
     */
    south(): Vec3 {
        return this.add(Vec3.South);
    }
    /**
     * Returns a new vector offset from the current vector east by 1 block.
     * @returns A new vector offset from the current vector east by 1 block.
     */
    east(): Vec3 {
        return this.add(Vec3.East);
    }
    /**
     * Returns a new vector offset from the current vector west by 1 block.
     * @returns A new vector offset from the current vector west by 1 block.
     */
    west(): Vec3 {
        return this.add(Vec3.West);
    }
    /**
     * Checks if the current vector is equal to the zero vector.
     * @returns true if the vector is equal to the zero vector, else returns false.
     */
    isZero(): boolean {
        return this.x === 0 && this.y === 0 && this.z === 0;
    }
    /**
     * Converts the vector to an array containing the X, Y, and Z components of the vector.
     * @returns An array containing the X, Y, and Z components of the vector.
     */
    toArray(): number[] {
        return [this.x, this.y, this.z];
    }
    /**
     * Converts the vector to a direction.
     * If the vector is not a unit vector, then it will be normalized and rounded to the nearest direction.
     */
    toDirection(): Direction {
        if (this.isZero()) {
            Vec3.log.error(
                new Error('Cannot convert zero-length vector to direction')
            );
            throw new Error('Cannot convert zero-length vector to direction');
        }
        const normalized = this.normalize();
        const maxValue = Math.max(
            Math.abs(normalized.x),
            Math.abs(normalized.y),
            Math.abs(normalized.z)
        );
        if (maxValue === normalized.x) return Direction.East;
        if (maxValue === -normalized.x) return Direction.West;
        if (maxValue === normalized.y) return Direction.Up;
        if (maxValue === -normalized.y) return Direction.Down;
        if (maxValue === normalized.z) return Direction.South;
        if (maxValue === -normalized.z) return Direction.North;
        // This should never happen
        Vec3.log.error(new Error('Cannot convert vector to direction'), this);
        throw new Error('Cannot convert vector to direction');
    }
    /**
     * Converts the vector to a structure rotation.
     * If the vector is not a unit vector, then it will be normalized and rounded to the nearest 90 degrees rotation.
     */
    toStructureRotation(): StructureRotation {
        const rotation = this.toRotation();
        let aligned = Math.round(rotation.y / 90) * 90;
        if (aligned < 0) {
            aligned += 360;
        }
        if (aligned >= 360) {
            aligned -= 360;
        }
        if (aligned === 0) return StructureRotation.None;
        if (aligned === 90) return StructureRotation.Rotate90;
        if (aligned === 180) return StructureRotation.Rotate180;
        if (aligned === 270) return StructureRotation.Rotate270;
        // This should never happen
        Vec3.log.error(
            new Error('Cannot convert vector to structure rotation'),
            this
        );
        throw new Error('Cannot convert vector to structure rotation');
    }
    /**
     * Returns a new vector with the X, Y, and Z components rounded to the nearest block location.
     */
    toBlockLocation(): Vec3 {
        // At this point I'm not sure if it wouldn't be better to use Math.floor instead
        return Vec3.from(
            (this.x << 0) - (this.x < 0 && this.x !== this.x << 0 ? 1 : 0),
            (this.y << 0) - (this.y < 0 && this.y !== this.y << 0 ? 1 : 0),
            (this.z << 0) - (this.z < 0 && this.z !== this.z << 0 ? 1 : 0)
        );
    }
    /**
     * Checks if the current vector is almost equal to another vector defined by three numbers,
     * within a given tolerance (delta).
     *
     * @param x - The x component of the other vector.
     * @param y - The y component of the other vector.
     * @param z - The z component of the other vector.
     * @param delta - The maximum allowed difference between corresponding components.
     * @returns True if the vectors are almost equal; otherwise, false.
     */
    almostEqual(x: number, y: number, z: number, delta: number): boolean;

    /**
     * Checks if the current vector is almost equal to another Vec3 within a given tolerance (delta).
     *
     * @param x - The Vec3 to compare.
     * @param delta - The maximum allowed difference between corresponding components.
     * @returns True if the vectors are almost equal; otherwise, false.
     */
    almostEqual(x: Vec3, delta: number): boolean;

    /**
     * Checks if the current vector is almost equal to another Vector3 within a given tolerance (delta).
     *
     * @param x - The Vector3 to compare.
     * @param delta - The maximum allowed difference between corresponding components.
     * @returns True if the vectors are almost equal; otherwise, false.
     */
    almostEqual(x: Vector3, delta: number): boolean;

    /**
     * Checks if the current vector is almost equal to a Direction within a given tolerance (delta).
     *
     * @param x - The Direction to compare.
     * @param delta - The maximum allowed difference between corresponding components.
     * @returns True if the vectors are almost equal; otherwise, false.
     */
    almostEqual(x: Direction, delta: number): boolean;

    /**
     * Checks if the current vector is almost equal to a vector represented by an array of numbers,
     * within a given tolerance (delta).
     *
     * @param x - The array of numbers representing the vector.
     * @param delta - The maximum allowed difference between corresponding components.
     * @returns True if the vectors are almost equal; otherwise, false.
     */
    almostEqual(x: number[], delta: number): boolean;

    almostEqual(x: VectorLike, y: number, z?: number, delta?: number): boolean {
        try {
            let other: Vec3;
            if (typeof x !== 'number' && z === undefined) {
                other = Vec3._from(x, undefined, undefined);
                delta = y!;
            } else {
                other = Vec3._from(x, y, z);
            }
            return (
                Math.abs(this.x - other.x) <= delta! &&
                Math.abs(this.y - other.y) <= delta! &&
                Math.abs(this.z - other.z) <= delta!
            );
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks if the current vector is exactly equal to another vector defined by three numbers.
     *
     * @param x - The x component of the other vector.
     * @param y - The y component of the other vector.
     * @param z - The z component of the other vector.
     * @returns True if the vectors are exactly equal; otherwise, false.
     */
    equals(x: number, y: number, z: number): boolean;

    /**
     * Checks if the current vector is exactly equal to another Vec3.
     *
     * @param x - The Vec3 to compare.
     * @returns True if the vectors are exactly equal; otherwise, false.
     */
    equals(x: Vec3): boolean;

    /**
     * Checks if the current vector is exactly equal to another Vector3.
     *
     * @param x - The Vector3 to compare.
     * @returns True if the vectors are exactly equal; otherwise, false.
     */
    equals(x: Vector3): boolean;

    /**
     * Checks if the current vector is exactly equal to a Direction.
     *
     * @param x - The Direction to compare.
     * @returns True if the vectors are exactly equal; otherwise, false.
     */
    equals(x: Direction): boolean;

    /**
     * Checks if the current vector is exactly equal to a vector represented by an array of numbers.
     *
     * @param x - The array of numbers representing the vector.
     * @returns True if the vectors are exactly equal; otherwise, false.
     */
    equals(x: number[]): boolean;

    equals(x: VectorLike, y?: number, z?: number): boolean {
        try {
            const other: Vec3 = Vec3._from(x, y, z);
            return (
                this.x === other.x && this.y === other.y && this.z === other.z
            );
        } catch (e) {
            return false;
        }
    }

    /**
     * Converts the vector to a string representation.
     *
     * @param format - The format of the string representation. Defaults to "long".
     * @param separator - The separator to use between components. Defaults to ", ".
     * @returns The string representation of the vector.
     * @remarks
     * The "long" format is "Vec3(x, y, z)".
     * The "short" format is "x, y, z".
     */
    toString(
        format: 'long' | 'short' = 'long',
        separator: string = ', '
    ): string {
        const result = `${this.x + separator + this.y + separator + this.z}`;
        return format === 'long' ? `Vec3(${result})` : result;
    }

    /**
     * Parses a string representation of a vector.
     *
     * @param str - The string representation of the vector.
     * @param format - The format of the string representation. Defaults to "long".
     * @param separator - The separator to use between components. Defaults to ", ".
     * @returns The vector parsed from the string.
     * @throws {Error} If the string format is invalid.
     */
    static fromString(
        str: string,
        format: 'long' | 'short' = 'long',
        separator: string = ', '
    ): Vec3 {
        if (format === 'long') {
            const match = str.match(/^Vec3\((.*)\)$/);
            if (!match) {
                throw new Error('Invalid string format');
            }
            const components = match[1].split(separator);
            if (components.length !== 3) {
                throw new Error('Invalid string format');
            }
            return Vec3.from(
                Number(components[0]),
                Number(components[1]),
                Number(components[2])
            );
        } else {
            const components = str.split(separator);
            if (components.length !== 3) {
                throw new Error('Invalid string format');
            }
            return Vec3.from(
                Number(components[0]),
                Number(components[1]),
                Number(components[2])
            );
        }
    }
}
