import {
    Vector2,
    Vector3,
    Direction,
    StructureRotation,
} from '@minecraft/server';
import Vec3 from './Vec3';

// Matches Vec3 constructor flexibility, but this class is mutable and all ops mutate `this`.
type VectorLike = Vector3 | Vec3 | MutVec3 | Direction | number[] | number;

// Direction values are strings, so they are matched through a lookup table
// instead of a chain of string comparisons.
const DIRECTION_VECTORS: Record<string, readonly [number, number, number]> = {
    [Direction.Down]: [0, -1, 0],
    [Direction.Up]: [0, 1, 0],
    [Direction.North]: [0, 0, -1],
    [Direction.South]: [0, 0, 1],
    [Direction.East]: [1, 0, 0],
    [Direction.West]: [-1, 0, 0],
};

export default class MutVec3 implements Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number);
    constructor(x: MutVec3);
    constructor(x: Vec3);
    constructor(x: Vector3);
    constructor(x: Direction);
    constructor(x: number[]);
    constructor(x: VectorLike, y?: number, z?: number) {
        // Branches are ordered by how often they are hit.
        if (typeof x === 'number') {
            this.x = x;
            this.y = y!;
            this.z = z!;
        } else if (typeof x === 'string') {
            const direction = DIRECTION_VECTORS[x];
            if (!direction) throw new Error('Invalid vector');
            this.x = direction[0];
            this.y = direction[1];
            this.z = direction[2];
        } else if (Array.isArray(x)) {
            this.x = x[0];
            this.y = x[1];
            this.z = x[2];
        } else {
            if (
                !x ||
                (!(x as any).x && (x as any).x !== 0) ||
                (!(x as any).y && (x as any).y !== 0) ||
                (!(x as any).z && (x as any).z !== 0)
            ) {
                throw new Error('Invalid vector');
            }
            this.x = (x as any).x;
            this.y = (x as any).y;
            this.z = (x as any).z;
        }
    }

    static from(x: number, y: number, z: number): MutVec3;
    static from(x: MutVec3): MutVec3;
    static from(x: Vec3): MutVec3;
    static from(x: Vector3): MutVec3;
    static from(x: Direction): MutVec3;
    static from(x: number[]): MutVec3;
    static from(x: VectorLike, y?: number, z?: number): MutVec3 {
        if (typeof x === 'number') {
            if (y !== undefined && z !== undefined) return new MutVec3(x, y, z);
        } else if (x) {
            // Instances are copied too, so the returned vector is always a new one.
            return new MutVec3(x as any);
        }
        throw new Error('Invalid arguments');
    }

    private static _from(x: VectorLike, y?: number, z?: number): MutVec3 {
        if (typeof x === 'number') {
            if (y === undefined && z === undefined) return new MutVec3(x, x, x);
            if (y !== undefined && z !== undefined) return new MutVec3(x, y, z);
        } else if (x instanceof MutVec3) {
            return x;
        } else if (x) {
            return new MutVec3(x as any);
        }
        throw new Error('Invalid arguments');
    }

    copy() {
        return new MutVec3(this.x, this.y, this.z);
    }

    /**
     * Adds a vector to the current vector in place. Unlike `add`, this method
     * takes only a vector and skips the argument dispatch, which makes it the
     * faster choice in code that runs every tick.
     *
     * @param v - The vector to be added.
     * @returns The updated vector.
     */
    addVec(v: Vector3): MutVec3 {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    /**
     * Subtracts a vector from the current vector in place. Fast-path variant of
     * `subtract`.
     *
     * @param v - The vector to be subtracted.
     * @returns The updated vector.
     */
    subtractVec(v: Vector3): MutVec3 {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    /**
     * Multiplies the current vector component-wise by a vector in place.
     * Fast-path variant of `multiply`; use `scale` for scalars.
     *
     * @param v - The vector multiplier.
     * @returns The updated vector.
     */
    multiplyVec(v: Vector3): MutVec3 {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    /**
     * Divides the current vector component-wise by a vector in place. Fast-path
     * variant of `divide`.
     *
     * @param v - The vector divisor.
     * @returns The updated vector.
     * @throws If any component of the divisor is zero.
     */
    divideVec(v: Vector3): MutVec3 {
        if (v.x === 0 || v.y === 0 || v.z === 0)
            throw new Error('Cannot divide by zero');
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }

    /**
     * Computes the dot product with a vector. Fast-path variant of `dot`.
     *
     * @param v - The other vector.
     * @returns The dot product.
     */
    dotVec(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Replaces the current vector with its cross product with a vector.
     * Fast-path variant of `cross`.
     *
     * @param v - The other vector.
     * @returns The updated vector.
     */
    crossVec(v: Vector3): MutVec3 {
        const cx = this.y * v.z - this.z * v.y;
        const cy = this.z * v.x - this.x * v.z;
        const cz = this.x * v.y - this.y * v.x;
        this.x = cx;
        this.y = cy;
        this.z = cz;
        return this;
    }

    /**
     * Computes the distance to a vector. Fast-path variant of `distance`.
     *
     * @param v - The other vector.
     * @returns The distance between the vectors.
     */
    distanceVec(v: Vector3): number {
        return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    /**
     * Computes the squared distance to a vector. Fast-path variant of
     * `distanceSquared`.
     *
     * @param v - The other vector.
     * @returns The squared distance between the vectors.
     */
    distanceSquaredVec(v: Vector3): number {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    }

    toImmutable() {
        return new Vec3(this.x, this.y, this.z);
    }

    static fromRotation(rotation: Vector2): MutVec3;
    static fromRotation(yaw: number, pitch: number): MutVec3;
    static fromRotation(
        yawOrRotation: number | Vector2,
        pitch?: number
    ): MutVec3 {
        let yaw: number;
        if (typeof yawOrRotation === 'number') {
            yaw = yawOrRotation as number;
            pitch = pitch!;
        } else {
            yaw = yawOrRotation.y;
            pitch = yawOrRotation.x;
        }
        const psi = yaw * (Math.PI / 180);
        const theta = pitch * (Math.PI / 180);
        const x = -Math.cos(theta) * Math.sin(psi);
        const yv = -Math.sin(theta);
        const z = Math.cos(theta) * Math.cos(psi);
        return new MutVec3(x, yv, z);
    }

    toRotation() {
        if (this.isZero())
            throw new Error('Cannot convert zero-length vector to direction');
        const dir = this.copy().normalize();
        const yaw = -Math.atan2(dir.x, dir.z) * (180 / Math.PI);
        const pitch = Math.asin(-dir.y) * (180 / Math.PI);
        return { x: pitch, y: yaw };
    }

    add(x: number, y: number, z: number): MutVec3;
    add(x: Vector3): MutVec3;
    add(x: Vec3): MutVec3;
    add(x: MutVec3): MutVec3;
    add(x: Direction): MutVec3;
    add(x: number[]): MutVec3;
    add(x: number): MutVec3;
    add(x: VectorLike, y?: number, z?: number): MutVec3 {
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    directionTo(x: number, y: number, z: number): MutVec3;
    directionTo(x: Vector3): MutVec3;
    directionTo(x: Vec3): MutVec3;
    directionTo(x: MutVec3): MutVec3;
    directionTo(x: Direction): MutVec3;
    directionTo(x: number[]): MutVec3;
    directionTo(x: VectorLike, y?: number, z?: number): MutVec3 {
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        this.subtract(v).multiply(-1).normalize();
        return this;
    }

    subtract(x: number, y: number, z: number): MutVec3;
    subtract(x: Vector3): MutVec3;
    subtract(x: Vec3): MutVec3;
    subtract(x: MutVec3): MutVec3;
    subtract(x: Direction): MutVec3;
    subtract(x: number[]): MutVec3;
    subtract(x: number): MutVec3;
    subtract(x: VectorLike, y?: number, z?: number): MutVec3 {
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    multiply(x: number, y: number, z: number): MutVec3;
    multiply(x: Vector3): MutVec3;
    multiply(x: Vec3): MutVec3;
    multiply(x: MutVec3): MutVec3;
    multiply(x: Direction): MutVec3;
    multiply(x: number[]): MutVec3;
    multiply(x: number): MutVec3;
    multiply(x: VectorLike, y?: number, z?: number): MutVec3 {
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    scale(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    divide(x: number, y: number, z: number): MutVec3;
    divide(x: Vector3): MutVec3;
    divide(x: Vec3): MutVec3;
    divide(x: MutVec3): MutVec3;
    divide(x: Direction): MutVec3;
    divide(x: number[]): MutVec3;
    divide(x: number): MutVec3;
    divide(x: VectorLike, y?: number, z?: number): MutVec3 {
        if (typeof x === 'number' && y === undefined && z === undefined) {
            if (x === 0) throw new Error('Cannot divide by zero');
            this.x /= x;
            this.y /= x;
            this.z /= x;
            return this;
        }
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        if (v.x === 0 || v.y === 0 || v.z === 0)
            throw new Error('Cannot divide by zero');
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }

    normalize() {
        if (this.isZero())
            throw new Error('Cannot normalize zero-length vector');
        const len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }

    length() {
        return Math.hypot(this.x, this.y, this.z);
    }

    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    cross(x: number, y: number, z: number): MutVec3;
    cross(x: Vector3): MutVec3;
    cross(x: Vec3): MutVec3;
    cross(x: MutVec3): MutVec3;
    cross(x: Direction): MutVec3;
    cross(x: number[]): MutVec3;
    cross(x: VectorLike, y?: number, z?: number): MutVec3 {
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        const cx = this.y * v.z - this.z * v.y;
        const cy = this.z * v.x - this.x * v.z;
        const cz = this.x * v.y - this.y * v.x;
        this.x = cx;
        this.y = cy;
        this.z = cz;
        return this;
    }

    distance(x: number, y: number, z: number): number;
    distance(x: Vector3): number;
    distance(x: Vec3): number;
    distance(x: MutVec3): number;
    distance(x: Direction): number;
    distance(x: number[]): number;
    distance(x: VectorLike, y?: number, z?: number) {
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        return this.copy().subtract(v).length();
    }

    distanceSquared(x: number, y: number, z: number): number;
    distanceSquared(x: Vector3): number;
    distanceSquared(x: Vec3): number;
    distanceSquared(x: MutVec3): number;
    distanceSquared(x: Direction): number;
    distanceSquared(x: number[]): number;
    distanceSquared(x: VectorLike, y?: number, z?: number) {
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        return this.copy().subtract(v).lengthSquared();
    }

    lerp(v: Vector3, t: number) {
        if (!v || t === undefined) return this;
        if (t === 1) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        }
        if (t === 0) return this;
        this.x = this.x + (v.x - this.x) * t;
        this.y = this.y + (v.y - this.y) * t;
        this.z = this.z + (v.z - this.z) * t;
        return this;
    }

    slerp(v: Vector3, t: number) {
        if (!v || t === undefined) return this;
        if (t === 1) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        }
        if (t === 0) return this;
        const dot = this.dot(v);
        const theta = Math.acos(dot) * t;
        const relative = MutVec3.from(v)
            .subtract(this.copy().multiply(dot))
            .normalize();
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        // this = this * cosT + relative * sinT
        this.multiply(cosT);
        this.x += relative.x * sinT;
        this.y += relative.y * sinT;
        this.z += relative.z * sinT;
        return this;
    }

    dot(x: number, y: number, z: number): number;
    dot(x: Vector3): number;
    dot(x: Vec3): number;
    dot(x: MutVec3): number;
    dot(x: Direction): number;
    dot(x: number[]): number;
    dot(x: VectorLike, y?: number, z?: number) {
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    angleBetween(x: number, y: number, z: number): number;
    angleBetween(x: Vector3): number;
    angleBetween(x: Vec3): number;
    angleBetween(x: MutVec3): number;
    angleBetween(x: Direction): number;
    angleBetween(x: number[]): number;
    angleBetween(x: VectorLike, y?: number, z?: number) {
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        const dotProduct = this.dot(v);
        const lenSq1 = this.lengthSquared();
        if (lenSq1 === 0) return 0;
        const lenSq2 = v.lengthSquared();
        if (lenSq2 === 0) return 0;
        const denom = Math.sqrt(lenSq1 * lenSq2);
        const cosAngle = Math.min(1, Math.max(-1, dotProduct / denom));
        return Math.acos(cosAngle);
    }

    projectOnto(x: number, y: number, z: number): MutVec3;
    projectOnto(x: Vector3): MutVec3;
    projectOnto(x: Vec3): MutVec3;
    projectOnto(x: MutVec3): MutVec3;
    projectOnto(x: Direction): MutVec3;
    projectOnto(x: number[]): MutVec3;
    projectOnto(x: VectorLike, y?: number, z?: number): MutVec3 {
        const v = x instanceof MutVec3 ? x : MutVec3._from(x, y, z);
        if (v.isZero()) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        }
        const denom = v.dot(v);
        if (denom === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        }
        const scale = this.dot(v) / denom;
        this.x = v.x * scale;
        this.y = v.y * scale;
        this.z = v.z * scale;
        return this;
    }

    reflect(x: number, y: number, z: number): MutVec3;
    reflect(x: Vector3): MutVec3;
    reflect(x: Vec3): MutVec3;
    reflect(x: MutVec3): MutVec3;
    reflect(x: Direction): MutVec3;
    reflect(x: number[]): MutVec3;
    reflect(x: VectorLike, y?: number, z?: number): MutVec3 {
        const normal = MutVec3._from(x, y, z);
        const tmp = this.copy();
        const proj = tmp.projectOnto(normal);
        return this.subtract(proj.multiply(2));
    }

    rotate(axis: Vector3, angle: number) {
        const halfAngle = (angle * Math.PI) / 180 / 2;
        const w = Math.cos(halfAngle);
        const x = axis.x * Math.sin(halfAngle);
        const y = axis.y * Math.sin(halfAngle);
        const z = axis.z * Math.sin(halfAngle);
        const vx = this.x,
            vy = this.y,
            vz = this.z;
        const qv_x =
            w * w * vx +
            2 * y * w * vz -
            2 * z * w * vy +
            x * x * vx +
            2 * y * x * vy +
            2 * z * x * vz -
            z * z * vx -
            y * y * vx;
        const qv_y =
            2 * x * y * vx +
            y * y * vy +
            2 * z * y * vz +
            2 * w * z * vx -
            z * z * vy +
            w * w * vy -
            2 * x * w * vz -
            x * x * vy;
        const qv_z =
            2 * x * z * vx +
            2 * y * z * vy +
            z * z * vz -
            2 * w * y * vx -
            y * y * vz +
            2 * w * x * vy -
            x * x * vz +
            w * w * vz;
        this.x = qv_x;
        this.y = qv_y;
        this.z = qv_z;
        return this;
    }

    update(
        x: ((x: number) => number) | undefined,
        y: ((y: number) => number) | undefined,
        z: ((z: number) => number) | undefined
    ) {
        if (!x) x = (v: number) => v;
        if (!y) y = (v: number) => v;
        if (!z) z = (v: number) => v;
        this.x = x(this.x);
        this.y = y(this.y);
        this.z = z(this.z);
        return this;
    }

    setX(value: number): MutVec3;
    setX(value: (x: number) => number): MutVec3;
    setX(value: number | ((x: number) => number)): MutVec3 {
        if (typeof value === 'number') this.x = value;
        else this.x = value(this.x);
        return this;
    }

    setY(value: number): MutVec3;
    setY(value: (y: number) => number): MutVec3;
    setY(value: number | ((y: number) => number)): MutVec3 {
        if (typeof value === 'number') this.y = value;
        else this.y = value(this.y);
        return this;
    }

    setZ(value: number): MutVec3;
    setZ(value: (z: number) => number): MutVec3;
    setZ(value: number | ((z: number) => number)): MutVec3 {
        if (typeof value === 'number') this.z = value;
        else this.z = value(this.z);
        return this;
    }

    floor() {
        return this.update(Math.floor, Math.floor, Math.floor);
    }
    floorX() {
        return this.setX(Math.floor);
    }
    floorY() {
        return this.setY(Math.floor);
    }
    floorZ() {
        return this.setZ(Math.floor);
    }

    ceil() {
        return this.update(Math.ceil, Math.ceil, Math.ceil);
    }
    ceilX() {
        return this.setX(Math.ceil);
    }
    ceilY() {
        return this.setY(Math.ceil);
    }
    ceilZ() {
        return this.setZ(Math.ceil);
    }

    round() {
        return this.update(Math.round, Math.round, Math.round);
    }
    roundX() {
        return this.setX(Math.round);
    }
    roundY() {
        return this.setY(Math.round);
    }
    roundZ() {
        return this.setZ(Math.round);
    }

    up() {
        return this.add(Direction.Up);
    }
    down() {
        return this.add(Direction.Down);
    }
    north() {
        return this.add(Direction.North);
    }
    south() {
        return this.add(Direction.South);
    }
    east() {
        return this.add(Direction.East);
    }
    west() {
        return this.add(Direction.West);
    }

    isZero() {
        return this.x === 0 && this.y === 0 && this.z === 0;
    }

    toArray() {
        return [this.x, this.y, this.z];
    }

    toDirection() {
        if (this.isZero())
            throw new Error('Cannot convert zero-length vector to direction');
        const normalized = this.copy().normalize();
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
        throw new Error('Cannot convert vector to direction');
    }

    toStructureRotation() {
        const rotation = this.toRotation();
        let aligned = Math.round(rotation.y / 90) * 90;
        if (aligned < 0) aligned += 360;
        if (aligned >= 360) aligned -= 360;
        if (aligned === 0) return StructureRotation.None;
        if (aligned === 90) return StructureRotation.Rotate90;
        if (aligned === 180) return StructureRotation.Rotate180;
        if (aligned === 270) return StructureRotation.Rotate270;
        throw new Error('Cannot convert vector to structure rotation');
    }

    toBlockLocation() {
        this.x = (this.x << 0) - (this.x < 0 && this.x !== this.x << 0 ? 1 : 0);
        this.y = (this.y << 0) - (this.y < 0 && this.y !== this.y << 0 ? 1 : 0);
        this.z = (this.z << 0) - (this.z < 0 && this.z !== this.z << 0 ? 1 : 0);
        return this;
    }

    almostEqual(x: number, y: number, z: number, delta: number): boolean;
    almostEqual(x: MutVec3, delta: number): boolean;
    almostEqual(x: Vec3, delta: number): boolean;
    almostEqual(x: Vector3, delta: number): boolean;
    almostEqual(x: Direction, delta: number): boolean;
    almostEqual(x: number[], delta: number): boolean;
    almostEqual(x: VectorLike, y: number, z?: number, delta?: number) {
        try {
            let other: MutVec3;
            if (typeof x !== 'number' && z === undefined) {
                other = MutVec3._from(x, undefined, undefined);
                delta = y!;
            } else {
                other = MutVec3._from(x, y, z);
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

    equals(x: number, y: number, z: number): boolean;
    equals(x: MutVec3): boolean;
    equals(x: Vec3): boolean;
    equals(x: Vector3): boolean;
    equals(x: Direction): boolean;
    equals(x: number[]): boolean;
    equals(x: VectorLike, y?: number, z?: number) {
        try {
            const other = MutVec3._from(x, y, z);
            return (
                this.x === other.x && this.y === other.y && this.z === other.z
            );
        } catch (e) {
            return false;
        }
    }

    toString(format: 'long' | 'short' = 'long', separator: string = ', ') {
        const result = `${this.x + separator + this.y + separator + this.z}`;
        return format === 'long' ? `MutVec3(${result})` : result;
    }

    static fromString(
        str: string,
        format: 'long' | 'short' = 'long',
        separator: string = ', '
    ) {
        if (format === 'long') {
            const match = str.match(/^MutVec3\((.*)\)$/);
            if (!match) throw new Error('Invalid string format');
            const components = match[1].split(separator);
            if (components.length !== 3)
                throw new Error('Invalid string format');
            return new MutVec3(
                Number(components[0]),
                Number(components[1]),
                Number(components[2])
            );
        } else {
            const components = str.split(separator);
            if (components.length !== 3)
                throw new Error('Invalid string format');
            return new MutVec3(
                Number(components[0]),
                Number(components[1]),
                Number(components[2])
            );
        }
    }
}
