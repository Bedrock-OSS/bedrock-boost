import { Vector2, Direction, VectorXZ } from '@minecraft/server';
import Vec3 from './Vec3';
import Vec2 from './Vec2';

// Mirrors Vec2 constructor flexibility, but this class mutates itself for vector math.
type VectorLike =
    | VectorXZ
    | Vector2
    | Vec2
    | MutVec2
    | Direction
    | number[]
    | number;

export default class MutVec2 implements Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number);
    constructor(x: MutVec2);
    constructor(x: Vec2);
    constructor(x: Vector2);
    constructor(x: VectorXZ);
    constructor(x: Direction);
    constructor(x: number[]);
    constructor(x: VectorLike, y?: number) {
        if (x === Direction.Down || x === Direction.Up) {
            throw new Error('Invalid direction');
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
        } else if (typeof x === 'number') {
            if (y === undefined) {
                throw new Error('Invalid vector');
            }
            this.x = x;
            this.y = y;
        } else if (Array.isArray(x)) {
            this.x = x[0];
            this.y = x[1];
        } else if (x instanceof MutVec2 || x instanceof Vec2) {
            this.x = x.x;
            this.y = x.y;
        } else {
            const anyX = x as any;
            if (
                !anyX ||
                (!anyX.x && anyX.x !== 0) ||
                (!anyX.y && anyX.y !== 0 && !anyX.z && anyX.z !== 0)
            ) {
                throw new Error('Invalid vector');
            }
            this.x = anyX.x;
            if (anyX.y || anyX.y === 0) {
                this.y = anyX.y;
            } else if (anyX.z || anyX.z === 0) {
                this.y = anyX.z;
            } else {
                throw new Error('Invalid vector');
            }
        }
    }

    static from(x: number, y: number): MutVec2;
    static from(x: MutVec2): MutVec2;
    static from(x: Vec2): MutVec2;
    static from(x: Vector2): MutVec2;
    static from(x: VectorXZ): MutVec2;
    static from(x: Direction): MutVec2;
    static from(x: number[]): MutVec2;
    static from(x: VectorLike, y?: number): MutVec2 {
        if (x instanceof MutVec2) return new MutVec2(x);
        if (x instanceof Vec2) return new MutVec2(x);
        if (typeof x === 'number' && y !== undefined) return new MutVec2(x, y);
        if (Array.isArray(x)) return new MutVec2(x);
        if (x === Direction.Down || x === Direction.Up) {
            throw new Error('Invalid direction');
        }
        if (x === Direction.North) return new MutVec2(Direction.North);
        if (x === Direction.South) return new MutVec2(Direction.South);
        if (x === Direction.East) return new MutVec2(Direction.East);
        if (x === Direction.West) return new MutVec2(Direction.West);
        return new MutVec2(x as any, y as any);
    }

    private static _from(x: VectorLike, y?: number): MutVec2 {
        if (typeof x === 'number' && y === undefined) {
            return new MutVec2(x, x)
        }
        if (x instanceof MutVec2) return x;
        if (x instanceof Vec2) return new MutVec2(x);
        if (typeof x === 'number' && y !== undefined) return new MutVec2(x, y);
        if (Array.isArray(x)) return new MutVec2(x);
        if (x === Direction.Down || x === Direction.Up) {
            throw new Error('Invalid direction');
        }
        if (x === Direction.North) return new MutVec2(Direction.North);
        if (x === Direction.South) return new MutVec2(Direction.South);
        if (x === Direction.East) return new MutVec2(Direction.East);
        if (x === Direction.West) return new MutVec2(Direction.West);
        return new MutVec2(x as any, y as any);
    }

    copy(): MutVec2 {
        return new MutVec2(this.x, this.y);
    }

    toImmutable(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    static fromYaw(yaw: number): MutVec2 {
        const psi = yaw * (Math.PI / 180);
        const x = Math.sin(psi);
        const z = Math.cos(psi);
        return new MutVec2(x, z);
    }

    toYaw(): number {
        if (this.isZero()) {
            throw new Error('Cannot convert zero-length vector to direction');
        }
        const direction = this.copy().normalize();
        return Math.atan2(direction.x, direction.y) * (180 / Math.PI);
    }

    add(x: number, y: number): MutVec2;
    add(x: MutVec2): MutVec2;
    add(x: Vec2): MutVec2;
    add(x: Vector2): MutVec2;
    add(x: VectorXZ): MutVec2;
    add(x: Direction): MutVec2;
    add(x: number[]): MutVec2;
    add(x: number): MutVec2;
    add(x: VectorLike, y?: number): MutVec2 {
        const v = MutVec2._from(x, y);
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    directionTo(x: number, y: number): MutVec2;
    directionTo(x: MutVec2): MutVec2;
    directionTo(x: Vec2): MutVec2;
    directionTo(x: Vector2): MutVec2;
    directionTo(x: VectorXZ): MutVec2;
    directionTo(x: Direction): MutVec2;
    directionTo(x: number[]): MutVec2;
    directionTo(x: VectorLike, y?: number): MutVec2 {
        const v = MutVec2._from(x, y);
        v.subtract(this).normalize();
        return this;
    }

    subtract(x: number, y: number): MutVec2;
    subtract(x: MutVec2): MutVec2;
    subtract(x: Vec2): MutVec2;
    subtract(x: Vector2): MutVec2;
    subtract(x: VectorXZ): MutVec2;
    subtract(x: Direction): MutVec2;
    subtract(x: number[]): MutVec2;
    subtract(x: number): MutVec2;
    subtract(x: VectorLike, y?: number): MutVec2 {
        const v = MutVec2._from(x, y);
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiply(x: number, y: number): MutVec2;
    multiply(x: MutVec2): MutVec2;
    multiply(x: Vec2): MutVec2;
    multiply(x: Vector2): MutVec2;
    multiply(x: VectorXZ): MutVec2;
    multiply(x: Direction): MutVec2;
    multiply(x: number[]): MutVec2;
    multiply(x: number): MutVec2;
    multiply(x: VectorLike, y?: number): MutVec2 {
        if (typeof x === 'number' && y === undefined) {
            this.x *= x;
            this.y *= x;
            return this;
        }
        const v = MutVec2._from(x, y);
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    scale(scalar: number): MutVec2 {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divide(x: number, y: number): MutVec2;
    divide(x: MutVec2): MutVec2;
    divide(x: Vec2): MutVec2;
    divide(x: Vector2): MutVec2;
    divide(x: VectorXZ): MutVec2;
    divide(x: Direction): MutVec2;
    divide(x: number[]): MutVec2;
    divide(x: number): MutVec2;
    divide(x: VectorLike, y?: number): MutVec2 {
        if (typeof x === 'number' && y === undefined) {
            if (x === 0) throw new Error('Cannot divide by zero');
            this.x /= x;
            this.y /= x;
            return this;
        }
        const v = MutVec2._from(x, y);
        if (v.x === 0 || v.y === 0) throw new Error('Cannot divide by zero');
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    normalize(): MutVec2 {
        if (this.isZero()) {
            throw new Error('Cannot normalize zero-length vector');
        }
        const len = this.length();
        this.x /= len;
        this.y /= len;
        return this;
    }

    length(): number {
        return Math.hypot(this.x, this.y);
    }

    lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    distance(x: number, y: number): number;
    distance(x: MutVec2): number;
    distance(x: Vec2): number;
    distance(x: Vector2): number;
    distance(x: VectorXZ): number;
    distance(x: Direction): number;
    distance(x: number[]): number;
    distance(x: VectorLike, y?: number): number {
        const v = MutVec2._from(x, y);
        return this.copy().subtract(v).length();
    }

    distanceSquared(x: number, y: number): number;
    distanceSquared(x: MutVec2): number;
    distanceSquared(x: Vec2): number;
    distanceSquared(x: Vector2): number;
    distanceSquared(x: VectorXZ): number;
    distanceSquared(x: Direction): number;
    distanceSquared(x: number[]): number;
    distanceSquared(x: VectorLike, y?: number): number {
        const v = MutVec2._from(x, y);
        return this.copy().subtract(v).lengthSquared();
    }

    lerp(v: Vector2, t: number): MutVec2 {
        if (!v || t === undefined) return this;
        if (t === 1) {
            this.x = v.x;
            this.y = v.y;
            return this;
        }
        if (t === 0) return this;
        this.x = this.x + (v.x - this.x) * t;
        this.y = this.y + (v.y - this.y) * t;
        return this;
    }

    slerp(v: Vector2, t: number): MutVec2 {
        if (!v || t === undefined) return this;
        if (t === 1) {
            this.x = v.x;
            this.y = v.y;
            return this;
        }
        if (t === 0) return this;
        const dot = this.dot(v);
        const theta = Math.acos(dot) * t;
        const relative = MutVec2.from(v)
            .subtract(this.copy().multiply(dot))
            .normalize();
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        this.multiply(cosT);
        this.x += relative.x * sinT;
        this.y += relative.y * sinT;
        return this;
    }

    dot(x: number, y: number): number;
    dot(x: MutVec2): number;
    dot(x: Vec2): number;
    dot(x: Vector2): number;
    dot(x: VectorXZ): number;
    dot(x: Direction): number;
    dot(x: number[]): number;
    dot(x: VectorLike, y?: number): number {
        const v = MutVec2._from(x, y);
        return this.x * v.x + this.y * v.y;
    }

    angleBetween(x: number, y: number): number;
    angleBetween(x: MutVec2): number;
    angleBetween(x: Vec2): number;
    angleBetween(x: Vector2): number;
    angleBetween(x: Direction): number;
    angleBetween(x: number[]): number;
    angleBetween(x: VectorLike, y?: number): number {
        const v = MutVec2._from(x, y);
        const dotProduct = this.dot(v);
        const lengths = this.length() * v.length();
        if (lengths === 0) {
            return 0;
        }
        return Math.acos(dotProduct / lengths);
    }

    projectOnto(x: number, y: number): MutVec2;
    projectOnto(x: MutVec2): MutVec2;
    projectOnto(x: Vec2): MutVec2;
    projectOnto(x: Vector2): MutVec2;
    projectOnto(x: VectorXZ): MutVec2;
    projectOnto(x: Direction): MutVec2;
    projectOnto(x: number[]): MutVec2;
    projectOnto(x: VectorLike, y?: number): MutVec2 {
        const v = MutVec2._from(x, y);
        if (v.isZero()) {
            this.x = 0;
            this.y = 0;
            return this;
        }
        const scale = this.dot(v) / v.dot(v);
        this.x = v.x * scale;
        this.y = v.y * scale;
        return this;
    }

    reflect(x: number, y: number): MutVec2;
    reflect(x: MutVec2): MutVec2;
    reflect(x: Vec2): MutVec2;
    reflect(x: Vector2): MutVec2;
    reflect(x: VectorXZ): MutVec2;
    reflect(x: Direction): MutVec2;
    reflect(x: number[]): MutVec2;
    reflect(x: VectorLike, y?: number): MutVec2 {
        const normal = MutVec2._from(x, y);
        const projection = this.copy().projectOnto(normal);
        return this.subtract(projection.multiply(2));
    }

    toVec3(z?: number): Vec3 {
        return new Vec3(this.x, this.y, z || 0);
    }

    setX(value: number): MutVec2;
    setX(value: (x: number) => number): MutVec2;
    setX(value: number | ((x: number) => number)): MutVec2 {
        if (typeof value === 'number') {
            this.x = value;
        } else {
            this.x = value(this.x);
        }
        return this;
    }

    setY(value: number): MutVec2;
    setY(value: (y: number) => number): MutVec2;
    setY(value: number | ((y: number) => number)): MutVec2 {
        if (typeof value === 'number') {
            this.y = value;
        } else {
            this.y = value(this.y);
        }
        return this;
    }

    update(
        x: ((x: number) => number) | undefined,
        y: ((y: number) => number) | undefined
    ): MutVec2 {
        if (!x) x = (v: number) => v;
        if (!y) y = (v: number) => v;
        this.x = x(this.x);
        this.y = y(this.y);
        return this;
    }

    floor(): MutVec2 {
        return this.update(Math.floor, Math.floor);
    }

    floorX(): MutVec2 {
        return this.setX(Math.floor);
    }

    floorY(): MutVec2 {
        return this.setY(Math.floor);
    }

    ceil(): MutVec2 {
        return this.update(Math.ceil, Math.ceil);
    }

    ceilX(): MutVec2 {
        return this.setX(Math.ceil);
    }

    ceilY(): MutVec2 {
        return this.setY(Math.ceil);
    }

    round(): MutVec2 {
        return this.update(Math.round, Math.round);
    }

    roundX(): MutVec2 {
        return this.setX(Math.round);
    }

    roundY(): MutVec2 {
        return this.setY(Math.round);
    }

    north(): MutVec2 {
        return this.add(Direction.North);
    }

    south(): MutVec2 {
        return this.add(Direction.South);
    }

    east(): MutVec2 {
        return this.add(Direction.East);
    }

    west(): MutVec2 {
        return this.add(Direction.West);
    }

    isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    toArray(): number[] {
        return [this.x, this.y];
    }

    toDirection(): Direction {
        if (this.isZero()) {
            throw new Error('Cannot convert zero-length vector to direction');
        }
        const normalized = this.copy().normalize();
        const maxValue = Math.max(
            Math.abs(normalized.x),
            Math.abs(normalized.y)
        );
        if (maxValue === normalized.x) return Direction.East;
        if (maxValue === -normalized.x) return Direction.West;
        if (maxValue === normalized.y) return Direction.North;
        if (maxValue === -normalized.y) return Direction.South;
        throw new Error('Cannot convert vector to direction');
    }

    toBlockLocation(): MutVec2 {
        const blockX =
            (this.x << 0) - (this.x < 0 && this.x !== this.x << 0 ? 1 : 0);
        const blockY =
            (this.y << 0) - (this.y < 0 && this.y !== this.y << 0 ? 1 : 0);
        this.x = blockX;
        this.y = blockY;
        return this;
    }

    almostEqual(x: number, y: number, delta: number): boolean;
    almostEqual(x: MutVec2, delta: number): boolean;
    almostEqual(x: Vec2, delta: number): boolean;
    almostEqual(x: Vector2, delta: number): boolean;
    almostEqual(x: VectorXZ, delta: number): boolean;
    almostEqual(x: Direction, delta: number): boolean;
    almostEqual(x: number[], delta: number): boolean;
    almostEqual(x: VectorLike, y: number, delta?: number): boolean {
        try {
            let other: MutVec2;
            if (typeof x !== 'number' && delta === undefined) {
                other = MutVec2._from(x, undefined);
                delta = y;
            } else {
                other = MutVec2._from(x, y);
            }
            return (
                Math.abs(this.x - other.x) <= delta! &&
                Math.abs(this.y - other.y) <= delta!
            );
        } catch (e) {
            return false;
        }
    }

    equals(x: number, y: number): boolean;
    equals(x: MutVec2): boolean;
    equals(x: Vec2): boolean;
    equals(x: Vector2): boolean;
    equals(x: VectorXZ): boolean;
    equals(x: Direction): boolean;
    equals(x: number[]): boolean;
    equals(x: VectorLike, y?: number): boolean {
        try {
            const other = MutVec2._from(x, y);
            return this.x === other.x && this.y === other.y;
        } catch (e) {
            return false;
        }
    }

    toString(
        format: 'long' | 'short' = 'long',
        separator: string = ', '
    ): string {
        const result = `${this.x + separator + this.y}`;
        return format === 'long' ? `MutVec2(${result})` : result;
    }
}
