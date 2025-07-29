import Vec2 from './Vec2';
import { Direction } from '@minecraft/server';

describe('Vec2', () => {
    // Constructor tests
    it('should fail to create a Vec2 instance with correct values for Direction.Down', () => {
        expect(() => new Vec2(Direction.Down)).toThrow('Invalid direction');
    });

    it('should fail to create a Vec2 instance with correct values for Direction.Up', () => {
        expect(() => new Vec2(Direction.Up)).toThrow('Invalid direction');
    });

    it('should create a Vec2 instance with correct values for Direction.North', () => {
        const vec = new Vec2(Direction.North);
        expect(vec.x).toEqual(0);
        expect(vec.y).toEqual(1);
    });

    it('should create a Vec2 instance with correct values for Direction.South', () => {
        const vec = new Vec2(Direction.South);
        expect(vec.x).toEqual(0);
        expect(vec.y).toEqual(-1);
    });

    it('should create a Vec2 instance with correct values for Direction.East', () => {
        const vec = new Vec2(Direction.East);
        expect(vec.x).toEqual(1);
        expect(vec.y).toEqual(0);
    });

    it('should create a Vec2 instance with correct values for Direction.West', () => {
        const vec = new Vec2(Direction.West);
        expect(vec.x).toEqual(-1);
        expect(vec.y).toEqual(0);
    });

    it('should create a Vec2 instance with correct values for number inputs', () => {
        const vec = new Vec2(1, 2);
        expect(vec.x).toEqual(1);
        expect(vec.y).toEqual(2);
    });

    it('should create a Vec2 instance with correct values for array input', () => {
        const vec = new Vec2([4, 5]);
        expect(vec.x).toEqual(4);
        expect(vec.y).toEqual(5);
    });

    it('should create a Vec2 instance with correct values for Vec2 input', () => {
        const inputVec = new Vec2(7, 8);
        const vec = new Vec2(inputVec);
        expect(vec.x).toEqual(7);
        expect(vec.y).toEqual(8);
    });

    it('should create a Vec2 instance with correct values for Vector3 input', () => {
        const vec = new Vec2({ x: 7, y: 8 } as any);
        expect(vec.x).toEqual(7);
        expect(vec.y).toEqual(8);
    });

    it('should create a Vec2 instance with correct values for VectorXZ input', () => {
        const vec = new Vec2({ x: 7, z: 8 } as any);
        expect(vec.x).toEqual(7);
        expect(vec.y).toEqual(8);
    });

    it('should throw an error for invalid vector inputs', () => {
        expect(() => new Vec2(null as any)).toThrow('Invalid vector');
        expect(() => new Vec2({} as any)).toThrow('Invalid vector');
        expect(() => new Vec2({ x: 1 } as any)).toThrow('Invalid vector');
        expect(() => new Vec2({ y: 2 } as any)).toThrow('Invalid vector');
        expect(() => new Vec2({ z: 3 } as any)).toThrow('Invalid vector');
    });

    // copy tests
    it('should create a copy of Vec2 instance', () => {
        const vec = new Vec2(1, 2);
        const copyVec = vec.copy();
        expect(copyVec.x).toEqual(vec.x);
        expect(copyVec.y).toEqual(vec.y);
    });

    // fromYawPitch tests
    it('should convert yaw and pitch to a normal vector', () => {
        const vec = Vec2.fromYaw(45);
        expect(vec.x).toBeCloseTo(0.7071067811865475);
        expect(vec.y).toBeCloseTo(0.7071067811865475);
    });

    //toYawPitch tests
    it('should convert a normal vector to yaw and pitch', () => {
        const vec = new Vec2(0.7071067811865475, 0.7071067811865475);
        const yawPitch = vec.toYaw();
        expect(yawPitch).toBeCloseTo(45);
    });

    // normalize tests
    it('should normalize a Vec2 instance', () => {
        const vec = new Vec2(1, 2).normalize();
        expect(vec.x).toBeCloseTo(0.4472135954999579);
        expect(vec.y).toBeCloseTo(0.8944271909999159);
    });

    it('should throw an error when normalizing a zero length Vec2 instance', () => {
        const vec = new Vec2(0, 0);
        expect(() => vec.normalize()).toThrow(
            'Cannot normalize zero-length vector'
        );
    });

    // length tests
    it('should return the length of a Vec2 instance', () => {
        const vec = new Vec2(1, 2);
        expect(vec.length()).toBeCloseTo(2.23606797749979);
    });

    it('should return the length squared of a Vec2 instance', () => {
        const vec = new Vec2(1, 2);
        expect(vec.lengthSquared()).toBeCloseTo(5);
    });

    // dot and cross product tests
    it('should return the dot product of two Vec2 instances', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        expect(vec1.dot(vec2)).toEqual(14);
    });

    // equals tests
    it('should return true when two Vec2 instances are equal', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(1, 2);
        expect(vec1.equals(vec2)).toBe(true);
    });

    it('should return false when two Vec2 instances are not equal', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        expect(vec1.equals(vec2)).toBe(false);
    });

    it('should return true when Vec2 and Vector3 instances are equal', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = { x: 1, y: 2 } as any;
        expect(vec1.equals(vec2)).toBe(true);
    });

    it('should return false when Vec2 and Vector3 instances are not equal', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = { x: 4, y: 5 } as any;
        expect(vec1.equals(vec2)).toBe(false);
    });

    it('should return true when Vec2 and array instances are equal', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = [1, 2] as any;
        expect(vec1.equals(vec2)).toBe(true);
    });

    it('should return false when Vec2 and array instances are not equal', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = [4, 5] as any;
        expect(vec1.equals(vec2)).toBe(false);
    });

    it('should return true when Vec2 and Direction instances are equal', () => {
        const vec1 = new Vec2(0, 1);
        const vec2 = Direction.North as any;
        expect(vec1.equals(vec2)).toBe(true);
    });

    it('should return false when Vec2 and Direction instances are not equal', () => {
        const vec1 = new Vec2(0, 1);
        const vec2 = Direction.South as any;
        expect(vec1.equals(vec2)).toBe(false);
    });

    it('should return false when comparing with an invalid vector input', () => {
        const vec = new Vec2(1, 2);
        expect(vec.equals(null as any)).toBe(false);
        expect(vec.equals({} as any)).toBe(false);
        expect(vec.equals({ x: 1 } as any)).toBe(false);
        expect(vec.equals({ y: 2 } as any)).toBe(false);
        expect(vec.equals({ z: 3 } as any)).toBe(false);
    });

    // add and subtract tests
    it('should add two Vec2 instances correctly', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        const result = vec1.add(vec2);
        expect(result.x).toEqual(5);
        expect(result.y).toEqual(7);
    });

    it('should add a Vec2 instance and three numbers correctly', () => {
        const vec = new Vec2(1, 2);
        const result = vec.add(4, 5);
        expect(result.x).toEqual(5);
        expect(result.y).toEqual(7);
    });

    it('should add a Vec2 instance and a Vec2-like object correctly', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = { x: 4, y: 5 };
        const result = vec1.add(vec2);
        expect(result.x).toEqual(5);
        expect(result.y).toEqual(7);
    });

    it('should add a Vec2 instance and an array correctly', () => {
        const vec = new Vec2(1, 2);
        const result = vec.add([4, 5]);
        expect(result.x).toEqual(5);
        expect(result.y).toEqual(7);
    });

    it('should add a Vec2 instance and a Direction correctly', () => {
        const vec = new Vec2(1, 2);
        const result = vec.add(Direction.North);
        expect(result.x).toEqual(1);
        expect(result.y).toEqual(3);
    });
    it('should subtract two Vec2 instances correctly', () => {
        const vec1 = new Vec2(4, 5);
        const vec2 = new Vec2(1, 2);
        const result = vec1.subtract(vec2);
        expect(result.x).toEqual(3);
        expect(result.y).toEqual(3);
    });

    it('should subtract a Vec2 instance and three numbers correctly', () => {
        const vec = new Vec2(4, 5);
        const result = vec.subtract(1, 2);
        expect(result.x).toEqual(3);
        expect(result.y).toEqual(3);
    });

    it('should subtract a Vec2 instance and a Vec2-like object correctly', () => {
        const vec1 = new Vec2(4, 5);
        const vec2 = { x: 1, y: 2 };
        const result = vec1.subtract(vec2);
        expect(result.x).toEqual(3);
        expect(result.y).toEqual(3);
    });

    it('should subtract a Vec2 instance and an array correctly', () => {
        const vec = new Vec2(4, 5);
        const result = vec.subtract([1, 2]);
        expect(result.x).toEqual(3);
        expect(result.y).toEqual(3);
    });

    it('should subtract a Vec2 instance and a Direction correctly', () => {
        const vec = new Vec2(4, 5);
        const result = vec.subtract(Direction.North);
        expect(result.x).toEqual(4);
        expect(result.y).toEqual(4);
    });

    // multiply and divide tests
    it('should multiply a Vec2 instance by a number correctly', () => {
        const vec = new Vec2(1, 2);
        const result = vec.multiply(2);
        expect(result.x).toEqual(2);
        expect(result.y).toEqual(4);
    });

    it('should multiply a Vec2 instance by individual components correctly', () => {
        const vec = new Vec2(1, 2);
        const result = vec.multiply(2, 3);
        expect(result.x).toEqual(2);
        expect(result.y).toEqual(6);
    });

    it('should multiply a Vec2 instance by another Vec2 instance correctly', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(2, 3);
        const result = vec1.multiply(vec2);
        expect(result.x).toEqual(2);
        expect(result.y).toEqual(6);
    });

    it('should multiply a Vec2 instance by a Vec2-like object correctly', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = { x: 2, y: 3 };
        const result = vec1.multiply(vec2);
        expect(result.x).toEqual(2);
        expect(result.y).toEqual(6);
    });

    it('should multiply a Vec2 instance by an array correctly', () => {
        const vec = new Vec2(1, 2);
        const result = vec.multiply([2, 3]);
        expect(result.x).toEqual(2);
        expect(result.y).toEqual(6);
    });

    it('should divide a Vec2 instance by a number correctly', () => {
        const vec = new Vec2(6, 8);
        const result = vec.divide(2);
        expect(result.x).toEqual(3);
        expect(result.y).toEqual(4);
    });

    it('should divide a Vec2 instance by another Vec2 instance correctly', () => {
        const vec1 = new Vec2(6, 8);
        const vec2 = new Vec2(2, 2);
        const result = vec1.divide(vec2);
        expect(result.x).toEqual(3);
        expect(result.y).toEqual(4);
    });

    it('should divide a Vec2 instance by individual components correctly', () => {
        const vec = new Vec2(6, 8);
        const result = vec.divide(2, 2);
        expect(result.x).toEqual(3);
        expect(result.y).toEqual(4);
    });

    it('should throw an error when dividing by zero', () => {
        const vec = new Vec2(6, 8);
        expect(() => vec.divide(0)).toThrow('Cannot divide by zero');
    });

    // distance tests
    it('should calculate the distance between two Vec2 instances', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        const distance = vec1.distance(vec2);
        expect(distance).toBeCloseTo(4.242640687119285);
    });

    it('should calculate the distance between a Vec2 instance and two numbers', () => {
        const vec = new Vec2(1, 2);
        const distance = vec.distance(4, 5);
        expect(distance).toBeCloseTo(4.242640687119285);
    });

    it('should calculate the distance between a Vec2 instance and a Vec2-like object', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = { x: 4, y: 5 };
        const distance = vec1.distance(vec2);
        expect(distance).toBeCloseTo(4.242640687119285);
    });

    it('should calculate the distance between a Vec2 instance and an array', () => {
        const vec = new Vec2(1, 2);
        const distance = vec.distance([4, 5]);
        expect(distance).toBeCloseTo(4.242640687119285);
    });

    it('should calculate the distance between a Vec2 instance and a Direction', () => {
        const vec = new Vec2(1, 2);
        const distance = vec.distance(Direction.North);
        expect(distance).toBeCloseTo(1.4142135623730951);
    });

    // lerp tests
    it('should interpolate between two Vec2 instances using lerp method', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        const t = 0.5;
        const result = vec1.lerp(vec2, t);
        expect(result.x).toEqual(2.5);
        expect(result.y).toEqual(3.5);
    });

    it('should return a copy of the original Vec2 instance when t is 0', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        const t = 0;
        const result = vec1.lerp(vec2, t);
        expect(result.x).toEqual(vec1.x);
        expect(result.y).toEqual(vec1.y);
    });

    it('should return a copy of the target Vec2 instance when t is 1', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        const t = 1;
        const result = vec1.lerp(vec2, t);
        expect(result.x).toEqual(vec2.x);
        expect(result.y).toEqual(vec2.y);
    });

    it('should return an extrapolation when t is less than 0', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        const t = -1;
        const result = vec1.lerp(vec2, t);
        expect(result.x).toEqual(-2);
        expect(result.y).toEqual(-1);
    });

    it('should return an extrapolation when t is greater than 1', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        const t = 2;
        const result = vec1.lerp(vec2, t);
        expect(result.x).toEqual(7);
        expect(result.y).toEqual(8);
    });

    // slerp tests
    it('should perform slerp interpolation correctly', () => {
        const vec1 = Vec2.fromYaw(0);
        const vec2 = Vec2.fromYaw(90);
        const t = 0.5;
        const result = vec1.slerp(vec2, t);
        expect(result.x).toBeCloseTo(0.7071067811865476);
        expect(result.y).toBeCloseTo(0.7071067811865476);
    });

    it('should return a copy of the original Vec2 instance when t is 0', () => {
        const vec1 = Vec2.fromYaw(0);
        const vec2 = Vec2.fromYaw(90);
        const t = 0;
        const result = vec1.slerp(vec2, t);
        expect(result).toEqual(vec1);
    });

    it('should return a copy of the target Vec2 instance when t is 1', () => {
        const vec1 = Vec2.fromYaw(0);
        const vec2 = Vec2.fromYaw(90);
        const t = 1;
        const result = vec1.slerp(vec2, t);
        expect(result).toEqual(vec2);
    });

    it('should return an extrapolation when t is less than 0', () => {
        const vec1 = Vec2.fromYaw(0);
        const vec2 = Vec2.fromYaw(90);
        const t = -1;
        const result = vec1.slerp(vec2, t);
        expect(result.x).toBeCloseTo(-1);
        expect(result.y).toBeCloseTo(0);
    });

    it('should return an extrapolation when t is greater than 1', () => {
        const vec1 = Vec2.fromYaw(0);
        const vec2 = Vec2.fromYaw(90);
        const t = 2;
        const result = vec1.slerp(vec2, t);
        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(-1);
    });

    // dot tests
    it('should return the dot product of two Vec2 instances', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        expect(vec1.dot(vec2)).toEqual(14);
    });

    it('should return the dot product of a Vec2 instance and a Vec2-like object', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = { x: 4, y: 5 };
        expect(vec1.dot(vec2)).toEqual(14);
    });

    it('should return the dot product of a Vec2 instance and an array', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = [4, 5];
        expect(vec1.dot(vec2)).toEqual(14);
    });

    it('should return the dot product of a Vec2 instance and three numbers', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = 4;
        const vec3 = 5;
        expect(vec1.dot(vec2, vec3)).toEqual(14);
    });

    // angleBetween tests
    it('should return the angle between two Vec2 instances', () => {
        const vec1 = new Vec2(1, 0);
        const vec2 = new Vec2(0, 1);
        const result = vec1.angleBetween(vec2);
        expect(result).toBeCloseTo(Math.PI / 2);
    });

    it('should return 0 when the length of one of the Vec2 instances is 0', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(0, 0);
        const result = vec1.angleBetween(vec2);
        expect(result).toBe(0);
    });

    it('should return the angle between a Vec2 instance and three numbers', () => {
        const vec1 = new Vec2(1, 0);
        const result = vec1.angleBetween(0, 1);
        expect(result).toBeCloseTo(Math.PI / 2);
    });

    it('should return the angle between a Vec2 instance and a Vec2-like object', () => {
        const vec1 = new Vec2(1, 0);
        const vec2 = { x: 0, y: 1 };
        const result = vec1.angleBetween(vec2);
        expect(result).toBeCloseTo(Math.PI / 2);
    });

    it('should return the angle between a Vec2 instance and an array', () => {
        const vec1 = new Vec2(1, 0);
        const result = vec1.angleBetween([0, 1]);
        expect(result).toBeCloseTo(Math.PI / 2);
    });

    it('should return the angle between a Vec2 instance and a Direction', () => {
        const vec1 = new Vec2(1, 0);
        const result = vec1.angleBetween(Direction.North);
        expect(result).toBeCloseTo(Math.PI / 2);
    });

    // projectOnto tests
    it('should return the projected vector onto another vector', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(4, 5);
        const result = vec1.projectOnto(vec2);
        expect(result.x).toBeCloseTo(1.3658536585365855);
        expect(result.y).toBeCloseTo(1.707317073170732);
    });

    it('should return the zero vector when projecting onto a zero-length vector', () => {
        const vec1 = new Vec2(1, 2);
        const result = vec1.projectOnto(Vec2.Zero);
        expect(result.x).toEqual(0);
        expect(result.y).toEqual(0);
    });

    // reflect tests
    it('should reflect a Vec2 instance correctly', () => {
        const vec = new Vec2(1, 2);
        const normal = new Vec2(0, 1);
        const result = vec.reflect(normal);
        expect(result.x).toEqual(1);
        expect(result.y).toEqual(-2);
    });

    it('should reflect a Vec2 instance with optional parameters correctly', () => {
        const vec = new Vec2(1, 2);
        const result = vec.reflect(0, 1);
        expect(result.x).toEqual(1);
        expect(result.y).toEqual(-2);
    });

    it('should reflect a Vec2 instance with a Direction correctly', () => {
        const vec = new Vec2(1, 2);
        const result = vec.reflect(Direction.North);
        expect(result.x).toEqual(1);
        expect(result.y).toEqual(-2);
    });

    // distanceToLineSegment tests
    it('should calculate the distance to a line segment correctly', () => {
        const vec = new Vec2(1, 2);
        const start = new Vec2(0, 0);
        const end = new Vec2(2, 2);
        const distance = vec.distanceToLineSegment(start, end);
        expect(distance).toBeCloseTo(0.7071067811865476);
    });

    it('should return the distance to the start point if the line segment is zero-length', () => {
        const vec = new Vec2(1, 2);
        const start = new Vec2(1, 2);
        const end = new Vec2(1, 2);
        const distance = vec.distanceToLineSegment(start, end);
        expect(distance).toBeCloseTo(0);
    });

    // toDirection tests
    it('should convert a non-zero Vec2 instance to Direction', () => {
        let vec = new Vec2(1, 0);
        let direction = vec.toDirection();
        expect(direction).toEqual(Direction.East);
        vec = new Vec2(0, 1);
        direction = vec.toDirection();
        expect(direction).toEqual(Direction.North);
        vec = new Vec2(-1, 0);
        direction = vec.toDirection();
        expect(direction).toEqual(Direction.West);
        vec = new Vec2(0, -1);
        direction = vec.toDirection();
        expect(direction).toEqual(Direction.South);
    });

    it('should throw an error when converting a zero-length Vec2 instance to Direction', () => {
        const vec = new Vec2(0, 0);
        expect(() => vec.toDirection()).toThrow(
            'Cannot convert zero-length vector to direction'
        );
    });

    it('should return vector offset north when using north function', () => {
        const vec = Vec2.Zero.north();
        expect(vec.x).toEqual(0);
        expect(vec.y).toEqual(1);
    });

    it('should return vector offset south when using south function', () => {
        const vec = Vec2.Zero.south();
        expect(vec.x).toEqual(0);
        expect(vec.y).toEqual(-1);
    });

    it('should return vector offset east when using east function', () => {
        const vec = Vec2.Zero.east();
        expect(vec.x).toEqual(1);
        expect(vec.y).toEqual(0);
    });

    it('should return vector offset west when using west function', () => {
        const vec = Vec2.Zero.west();
        expect(vec.x).toEqual(-1);
        expect(vec.y).toEqual(0);
    });

    it('should return a new Vec2 instance with floored values', () => {
        const vec = new Vec2(1.5, 2.7);
        const result = vec.floor();
        expect(result.x).toEqual(1);
        expect(result.y).toEqual(2);
    });

    it('should return a new Vec2 instance with ceiling values', () => {
        const vec = new Vec2(1.5, 2.7);
        const result = vec.ceil();
        expect(result.x).toEqual(2);
        expect(result.y).toEqual(3);
    });

    it('should return a new Vec2 instance with rounded values', () => {
        const vec = new Vec2(1.5, 2.7);
        const result = vec.round();
        expect(result.x).toEqual(2);
        expect(result.y).toEqual(3);
    });

    it('should return a new Vec2 instance with ceilX and floorY', () => {
        const vec = new Vec2(1.1, 1.9);
        const result = vec.ceilX().floorY();
        expect(result.x).toEqual(2);
        expect(result.y).toEqual(1);
    });

    it('should return true when Vec2 instance is within delta of another Vec2 instance', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(1.1, 2.1);
        expect(vec1.almostEqual(vec2, 0.2)).toBe(true);
    });

    it('should return false when Vec2 instance is not within delta of another Vec2 instance', () => {
        const vec1 = new Vec2(1, 2);
        const vec2 = new Vec2(1.1, 2.1);
        expect(vec1.almostEqual(vec2, 0.05)).toBe(false);
    });

    it('should return true when Vec2 instance is within delta of another location', () => {
        const vec1 = new Vec2(1, 2);
        expect(vec1.almostEqual(1.1, 2.1, 0.2)).toBe(true);
    });

    it('should return "Vec2(1, 1)" when `Vec2.toString()` is called with default values', () => {
        const vec = new Vec2(1, 1);
        expect(vec.toString()).toEqual('Vec2(1, 1)');
    });

    it('should return "Vec2(1;2)" when `Vec2.toString()` is called with "long" format and ";" as separator', () => {
        const vec = new Vec2(1, 2);
        expect(vec.toString('long', ';')).toEqual('Vec2(1;2)');
    });

    it('should return "1, 1" when `Vec2.toString()` is called with "short" format', () => {
        const vec = new Vec2(1, 1);
        expect(vec.toString('short')).toEqual('1, 1');
    });

    it('should return "1;2" when `Vec2.toString()` is called with "short" format and ";" as separator', () => {
        const vec = new Vec2(1, 2);
        expect(vec.toString('short', ';')).toEqual('1;2');
    });
});
