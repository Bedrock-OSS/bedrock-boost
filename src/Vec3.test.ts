import Vec3 from './Vec3';
import { Direction, StructureRotation } from '@minecraft/server';

describe('Vec3', () => {
  // Constructor tests
  it('should create a Vec3 instance with correct values for Direction.Down', () => {
    const vec = new Vec3(Direction.Down);
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(-1);
    expect(vec.z).toEqual(0);
  });

  it('should create a Vec3 instance with correct values for Direction.Up', () => {
    const vec = new Vec3(Direction.Up);
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(1);
    expect(vec.z).toEqual(0);
  });

  it('should create a Vec3 instance with correct values for Direction.North', () => {
    const vec = new Vec3(Direction.North);
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(0);
    expect(vec.z).toEqual(-1);
  });

  it('should create a Vec3 instance with correct values for Direction.South', () => {
    const vec = new Vec3(Direction.South);
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(0);
    expect(vec.z).toEqual(1);
  });

  it('should create a Vec3 instance with correct values for Direction.East', () => {
    const vec = new Vec3(Direction.East);
    expect(vec.x).toEqual(1);
    expect(vec.y).toEqual(0);
    expect(vec.z).toEqual(0);
  });

  it('should create a Vec3 instance with correct values for Direction.West', () => {
    const vec = new Vec3(Direction.West);
    expect(vec.x).toEqual(-1);
    expect(vec.y).toEqual(0);
    expect(vec.z).toEqual(0);
  });

  it('should create a Vec3 instance with correct values for number inputs', () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.x).toEqual(1);
    expect(vec.y).toEqual(2);
    expect(vec.z).toEqual(3);
  });

  it('should create a Vec3 instance with correct values for array input', () => {
    const vec = new Vec3([4, 5, 6]);
    expect(vec.x).toEqual(4);
    expect(vec.y).toEqual(5);
    expect(vec.z).toEqual(6);
  });

  it('should create a Vec3 instance with correct values for Vec3 input', () => {
    const inputVec = new Vec3(7, 8, 9);
    const vec = new Vec3(inputVec);
    expect(vec.x).toEqual(7);
    expect(vec.y).toEqual(8);
    expect(vec.z).toEqual(9);
  });

  it('should create a Vec3 instance with correct values for Vector3 input', () => {
    const vec = new Vec3({ x: 7, y: 8, z: 9 } as any);
    expect(vec.x).toEqual(7);
    expect(vec.y).toEqual(8);
    expect(vec.z).toEqual(9);
  });

  it('should throw an error for invalid vector inputs', () => {
    expect(() => new Vec3(null as any)).toThrow('Invalid vector');
    expect(() => new Vec3({} as any)).toThrow('Invalid vector');
    expect(() => new Vec3({ x: 1 } as any)).toThrow('Invalid vector');
    expect(() => new Vec3({ y: 2 } as any)).toThrow('Invalid vector');
    expect(() => new Vec3({ z: 3 } as any)).toThrow('Invalid vector');
  });

  // copy tests
  it('should create a copy of Vec3 instance', () => {
    const vec = new Vec3(1, 2, 3);
    const copyVec = vec.copy();
    expect(copyVec.x).toEqual(vec.x);
    expect(copyVec.y).toEqual(vec.y);
    expect(copyVec.z).toEqual(vec.z);
  });

  // fromYawPitch tests
  it('should convert yaw and pitch to a normal vector', () => {
    const vec = Vec3.fromYawPitch(45, 30);
    expect(vec.x).toBeCloseTo(0.6123724356957945);
    expect(vec.y).toBeCloseTo(0.5);
    expect(vec.z).toBeCloseTo(0.6123724356957945);
  });
  
  it('should convert Vector2 with rotations to a normal vector', () => {
    const vec = Vec3.fromYawPitch({x: 30, y: 45});
    expect(vec.x).toBeCloseTo(0.6123724356957945);
    expect(vec.y).toBeCloseTo(0.5);
    expect(vec.z).toBeCloseTo(0.6123724356957945);
  });

  //toYawPitch tests
  it('should convert a normal vector to yaw and pitch', () => {
    const vec = new Vec3(0.6123724356957945, 0.5, 0.6123724356957945);
    const yawPitch = vec.toYawPitch();
    expect(yawPitch.x).toBeCloseTo(30);
    expect(yawPitch.y).toBeCloseTo(45);
  });

  // normalize tests
  it('should normalize a Vec3 instance', () => {
    const vec = new Vec3(1, 2, 3).normalize();
    expect(vec.x).toBeCloseTo(0.2672612419124244);
    expect(vec.y).toBeCloseTo(0.5345224838248488);
    expect(vec.z).toBeCloseTo(0.8017837257372732);
  });

  it('should throw an error when normalizing a zero length Vec3 instance', () => {
    const vec = new Vec3(0, 0, 0);
    expect(() => vec.normalize()).toThrow('Cannot normalize zero-length vector');
  });

  // length tests
  it('should return the length of a Vec3 instance', () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.length()).toBeCloseTo(3.7416573867739413);
  });

  it('should return the length squared of a Vec3 instance', () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.lengthSquared()).toBeCloseTo(14);
  });

  // dot and cross product tests
  it('should return the dot product of two Vec3 instances', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    expect(vec1.dot(vec2)).toEqual(32);
  });

  it('should return the cross product of two Vec3 instances', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    const result = vec1.cross(vec2);
    expect(result.x).toEqual(-3);
    expect(result.y).toEqual(6);
    expect(result.z).toEqual(-3);
  });

  // equals tests
  it('should return true when two Vec3 instances are equal', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(1, 2, 3);
    expect(vec1.equals(vec2)).toBe(true);
  });

  it('should return false when two Vec3 instances are not equal', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    expect(vec1.equals(vec2)).toBe(false);
  });

  it('should return true when Vec3 and Vector3 instances are equal', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = { x: 1, y: 2, z: 3 } as any;
    expect(vec1.equals(vec2)).toBe(true);
  });

  it('should return false when Vec3 and Vector3 instances are not equal', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = { x: 4, y: 5, z: 6 } as any;
    expect(vec1.equals(vec2)).toBe(false);
  });

  it('should return true when Vec3 and array instances are equal', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = [1, 2, 3] as any;
    expect(vec1.equals(vec2)).toBe(true);
  });

  it('should return false when Vec3 and array instances are not equal', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = [4, 5, 6] as any;
    expect(vec1.equals(vec2)).toBe(false);
  });

  it('should return true when Vec3 and Direction instances are equal', () => {
    const vec1 = new Vec3(0, 1, 0);
    const vec2 = Direction.Up as any;
    expect(vec1.equals(vec2)).toBe(true);
  });

  it('should return false when Vec3 and Direction instances are not equal', () => {
    const vec1 = new Vec3(0, 1, 0);
    const vec2 = Direction.Down as any;
    expect(vec1.equals(vec2)).toBe(false);
  });

  it('should return false when comparing with an invalid vector input', () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.equals(null as any)).toBe(false);
    expect(vec.equals({} as any)).toBe(false);
    expect(vec.equals({ x: 1 } as any)).toBe(false);
    expect(vec.equals({ y: 2 } as any)).toBe(false);
    expect(vec.equals({ z: 3 } as any)).toBe(false);
  });

  // add and subtract tests
  it('should add two Vec3 instances correctly', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    const result = vec1.add(vec2);
    expect(result.x).toEqual(5);
    expect(result.y).toEqual(7);
    expect(result.z).toEqual(9);
  });

  it('should add a Vec3 instance and three numbers correctly', () => {
    const vec = new Vec3(1, 2, 3);
    const result = vec.add(4, 5, 6);
    expect(result.x).toEqual(5);
    expect(result.y).toEqual(7);
    expect(result.z).toEqual(9);
  });

  it('should add a Vec3 instance and a Vec3-like object correctly', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = { x: 4, y: 5, z: 6 };
    const result = vec1.add(vec2);
    expect(result.x).toEqual(5);
    expect(result.y).toEqual(7);
    expect(result.z).toEqual(9);
  });

  it('should add a Vec3 instance and an array correctly', () => {
    const vec = new Vec3(1, 2, 3);
    const result = vec.add([4, 5, 6]);
    expect(result.x).toEqual(5);
    expect(result.y).toEqual(7);
    expect(result.z).toEqual(9);
  });

  it('should add a Vec3 instance and a Direction correctly', () => {
    const vec = new Vec3(1, 2, 3);
    const result = vec.add(Direction.Up);
    expect(result.x).toEqual(1);
    expect(result.y).toEqual(3);
    expect(result.z).toEqual(3);
  });
  it('should subtract two Vec3 instances correctly', () => {
    const vec1 = new Vec3(4, 5, 6);
    const vec2 = new Vec3(1, 2, 3);
    const result = vec1.subtract(vec2);
    expect(result.x).toEqual(3);
    expect(result.y).toEqual(3);
    expect(result.z).toEqual(3);
  });

  it('should subtract a Vec3 instance and three numbers correctly', () => {
    const vec = new Vec3(4, 5, 6);
    const result = vec.subtract(1, 2, 3);
    expect(result.x).toEqual(3);
    expect(result.y).toEqual(3);
    expect(result.z).toEqual(3);
  });

  it('should subtract a Vec3 instance and a Vec3-like object correctly', () => {
    const vec1 = new Vec3(4, 5, 6);
    const vec2 = { x: 1, y: 2, z: 3 };
    const result = vec1.subtract(vec2);
    expect(result.x).toEqual(3);
    expect(result.y).toEqual(3);
    expect(result.z).toEqual(3);
  });

  it('should subtract a Vec3 instance and an array correctly', () => {
    const vec = new Vec3(4, 5, 6);
    const result = vec.subtract([1, 2, 3]);
    expect(result.x).toEqual(3);
    expect(result.y).toEqual(3);
    expect(result.z).toEqual(3);
  });

  it('should subtract a Vec3 instance and a Direction correctly', () => {
    const vec = new Vec3(4, 5, 6);
    const result = vec.subtract(Direction.Up);
    expect(result.x).toEqual(4);
    expect(result.y).toEqual(4);
    expect(result.z).toEqual(6);
  });

  // multiply and divide tests
  it('should multiply a Vec3 instance by a number correctly', () => {
    const vec = new Vec3(1, 2, 3);
    const result = vec.multiply(2);
    expect(result.x).toEqual(2);
    expect(result.y).toEqual(4);
    expect(result.z).toEqual(6);
  });

  it('should multiply a Vec3 instance by individual components correctly', () => {
    const vec = new Vec3(1, 2, 3);
    const result = vec.multiply(2, 3, 4);
    expect(result.x).toEqual(2);
    expect(result.y).toEqual(6);
    expect(result.z).toEqual(12);
  });

  it('should multiply a Vec3 instance by another Vec3 instance correctly', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(2, 3, 4);
    const result = vec1.multiply(vec2);
    expect(result.x).toEqual(2);
    expect(result.y).toEqual(6);
    expect(result.z).toEqual(12);
  });

  it('should multiply a Vec3 instance by a Vec3-like object correctly', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = { x: 2, y: 3, z: 4 };
    const result = vec1.multiply(vec2);
    expect(result.x).toEqual(2);
    expect(result.y).toEqual(6);
    expect(result.z).toEqual(12);
  });

  it('should multiply a Vec3 instance by an array correctly', () => {
    const vec = new Vec3(1, 2, 3);
    const result = vec.multiply([2, 3, 4]);
    expect(result.x).toEqual(2);
    expect(result.y).toEqual(6);
    expect(result.z).toEqual(12);
  });

  it('should divide a Vec3 instance by a number correctly', () => {
    const vec = new Vec3(6, 8, 10);
    const result = vec.divide(2);
    expect(result.x).toEqual(3);
    expect(result.y).toEqual(4);
    expect(result.z).toEqual(5);
  });

  it('should divide a Vec3 instance by another Vec3 instance correctly', () => {
    const vec1 = new Vec3(6, 8, 10);
    const vec2 = new Vec3(2, 2, 2);
    const result = vec1.divide(vec2);
    expect(result.x).toEqual(3);
    expect(result.y).toEqual(4);
    expect(result.z).toEqual(5);
  });

  it('should divide a Vec3 instance by individual components correctly', () => {
    const vec = new Vec3(6, 8, 10);
    const result = vec.divide(2, 2, 2);
    expect(result.x).toEqual(3);
    expect(result.y).toEqual(4);
    expect(result.z).toEqual(5);
  });

  it('should throw an error when dividing by zero', () => {
    const vec = new Vec3(6, 8, 10);
    expect(() => vec.divide(0)).toThrow('Cannot divide by zero');
  });

  // distance tests
  it('should calculate the distance between two Vec3 instances', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    const distance = vec1.distance(vec2);
    expect(distance).toBeCloseTo(5.196152422706632);
  });

  it('should calculate the distance between a Vec3 instance and three numbers', () => {
    const vec = new Vec3(1, 2, 3);
    const distance = vec.distance(4, 5, 6);
    expect(distance).toBeCloseTo(5.196152422706632);
  });

  it('should calculate the distance between a Vec3 instance and a Vec3-like object', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = { x: 4, y: 5, z: 6 };
    const distance = vec1.distance(vec2);
    expect(distance).toBeCloseTo(5.196152422706632);
  });

  it('should calculate the distance between a Vec3 instance and an array', () => {
    const vec = new Vec3(1, 2, 3);
    const distance = vec.distance([4, 5, 6]);
    expect(distance).toBeCloseTo(5.196152422706632);
  });

  it('should calculate the distance between a Vec3 instance and a Direction', () => {
    const vec = new Vec3(1, 2, 3);
    const distance = vec.distance(Direction.Up);
    expect(distance).toBeCloseTo(3.3166247903554);
  });

  // lerp tests
  it('should interpolate between two Vec3 instances using lerp method', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    const t = 0.5;
    const result = vec1.lerp(vec2, t);
    expect(result.x).toEqual(2.5);
    expect(result.y).toEqual(3.5);
    expect(result.z).toEqual(4.5);
  });

  it('should return a copy of the original Vec3 instance when t is 0', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    const t = 0;
    const result = vec1.lerp(vec2, t);
    expect(result.x).toEqual(vec1.x);
    expect(result.y).toEqual(vec1.y);
    expect(result.z).toEqual(vec1.z);
  });

  it('should return a copy of the target Vec3 instance when t is 1', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    const t = 1;
    const result = vec1.lerp(vec2, t);
    expect(result.x).toEqual(vec2.x);
    expect(result.y).toEqual(vec2.y);
    expect(result.z).toEqual(vec2.z);
  });

  it('should return an extrapolation when t is less than 0', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    const t = -1;
    const result = vec1.lerp(vec2, t);
    expect(result.x).toEqual(-2);
    expect(result.y).toEqual(-1);
    expect(result.z).toEqual(0);
  });

  it('should return an extrapolation when t is greater than 1', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    const t = 2;
    const result = vec1.lerp(vec2, t);
    expect(result.x).toEqual(7);
    expect(result.y).toEqual(8);
    expect(result.z).toEqual(9);
  });

  // slerp tests
  it('should perform slerp interpolation correctly', () => {
    const vec1 = Vec3.fromYawPitch(0, 0);
    const vec2 = Vec3.fromYawPitch(90, 0);
    const t = 0.5;
    const result = vec1.slerp(vec2, t);
    expect(result.x).toBeCloseTo(0.7071067811865476);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(0.7071067811865476);
  });

  it('should return a copy of the original Vec3 instance when t is 0', () => {
    const vec1 = Vec3.fromYawPitch(0, 0);
    const vec2 = Vec3.fromYawPitch(90, 0);
    const t = 0;
    const result = vec1.slerp(vec2, t);
    expect(result).toEqual(vec1);
  });

  it('should return a copy of the target Vec3 instance when t is 1', () => {
    const vec1 = Vec3.fromYawPitch(0, 0);
    const vec2 = Vec3.fromYawPitch(90, 0);
    const t = 1;
    const result = vec1.slerp(vec2, t);
    expect(result).toEqual(vec2);
  });

  it('should return an extrapolation when t is less than 0', () => {
    const vec1 = Vec3.fromYawPitch(0, 0);
    const vec2 = Vec3.fromYawPitch(90, 0);
    const t = -1;
    const result = vec1.slerp(vec2, t);
    expect(result.x).toBeCloseTo(-1);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(0);
  });

  it('should return an extrapolation when t is greater than 1', () => {
    const vec1 = Vec3.fromYawPitch(0, 0);
    const vec2 = Vec3.fromYawPitch(90, 0);
    const t = 2;
    const result = vec1.slerp(vec2, t);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(-1);
  });

  // dot tests
  it('should return the dot product of two Vec3 instances', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    expect(vec1.dot(vec2)).toEqual(32);
  });

  it('should return the dot product of a Vec3 instance and a Vec3-like object', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = { x: 4, y: 5, z: 6 };
    expect(vec1.dot(vec2)).toEqual(32);
  });

  it('should return the dot product of a Vec3 instance and an array', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = [4, 5, 6];
    expect(vec1.dot(vec2)).toEqual(32);
  });

  it('should return the dot product of a Vec3 instance and three numbers', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = 4;
    const vec3 = 5;
    const vec4 = 6;
    expect(vec1.dot(vec2, vec3, vec4)).toEqual(32);
  });

  // angleBetween tests
  it('should return the angle between two Vec3 instances', () => {
    const vec1 = new Vec3(1, 0, 0);
    const vec2 = new Vec3(0, 1, 0);
    const result = vec1.angleBetween(vec2);
    expect(result).toBeCloseTo(Math.PI / 2);
  });

  it('should return 0 when the length of one of the Vec3 instances is 0', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(0, 0, 0);
    const result = vec1.angleBetween(vec2);
    expect(result).toBe(0);
  });

  it('should return the angle between a Vec3 instance and three numbers', () => {
    const vec1 = new Vec3(1, 0, 0);
    const result = vec1.angleBetween(0, 1, 0);
    expect(result).toBeCloseTo(Math.PI / 2);
  });

  it('should return the angle between a Vec3 instance and a Vec3-like object', () => {
    const vec1 = new Vec3(1, 0, 0);
    const vec2 = { x: 0, y: 1, z: 0 };
    const result = vec1.angleBetween(vec2);
    expect(result).toBeCloseTo(Math.PI / 2);
  });

  it('should return the angle between a Vec3 instance and an array', () => {
    const vec1 = new Vec3(1, 0, 0);
    const result = vec1.angleBetween([0, 1, 0]);
    expect(result).toBeCloseTo(Math.PI / 2);
  });

  it('should return the angle between a Vec3 instance and a Direction', () => {
    const vec1 = new Vec3(1, 0, 0);
    const result = vec1.angleBetween(Direction.Up);
    expect(result).toBeCloseTo(Math.PI / 2);
  });

  // projectOnto tests
  it('should return the projected vector onto another vector', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(4, 5, 6);
    const result = vec1.projectOnto(vec2);
    expect(result.x).toBeCloseTo(1.6623376623376624);
    expect(result.y).toBeCloseTo(2.077922077922078);
    expect(result.z).toBeCloseTo(2.4935064935064934);
  });

  it('should return the zero vector when projecting onto a zero-length vector', () => {
    const vec1 = new Vec3(1, 2, 3);
    const result = vec1.projectOnto(Vec3.Zero);
    expect(result.x).toEqual(0);
    expect(result.y).toEqual(0);
    expect(result.z).toEqual(0);
  });

  // reflect tests
  it('should reflect a Vec3 instance correctly', () => {
    const vec = new Vec3(1, 2, 3);
    const normal = new Vec3(0, 1, 0);
    const result = vec.reflect(normal);
    expect(result.x).toEqual(1);
    expect(result.y).toEqual(-2);
    expect(result.z).toEqual(3);
  });

  it('should reflect a Vec3 instance with optional parameters correctly', () => {
    const vec = new Vec3(1, 2, 3);
    const result = vec.reflect(0, 1, 0);
    expect(result.x).toEqual(1);
    expect(result.y).toEqual(-2);
    expect(result.z).toEqual(3);
  });

  it('should reflect a Vec3 instance with a Direction correctly', () => {
    const vec = new Vec3(1, 2, 3);
    const result = vec.reflect(Direction.Up);
    expect(result.x).toEqual(1);
    expect(result.y).toEqual(-2);
    expect(result.z).toEqual(3);
  });

  // rotate tests
  it('should rotate a Vec3 instance correctly', () => {
    const vec = new Vec3(1, 0, 0);
    const axis = { x: 0, y: 0, z: 1 };
    const angle = 90;
    const result = vec.rotate(axis, angle);
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(1);
    expect(result.z).toBeCloseTo(0);
  });

  // distanceToLineSegment tests
  it('should calculate the distance to a line segment correctly', () => {
    const vec = new Vec3(1, 2, 3);
    const start = new Vec3(0, 0, 0);
    const end = new Vec3(2, 2, 2);
    const distance = vec.distanceToLineSegment(start, end);
    expect(distance).toBeCloseTo(1.4142135623730951);
  });

  it('should return the distance to the start point if the line segment is zero-length', () => {
    const vec = new Vec3(1, 2, 3);
    const start = new Vec3(1, 2, 3);
    const end = new Vec3(1, 2, 3);
    const distance = vec.distanceToLineSegment(start, end);
    expect(distance).toBeCloseTo(0);
  });

  // toDirection tests
  it('should convert a non-zero Vec3 instance to Direction', () => {
    let vec = new Vec3(1, 0, 0);
    let direction = vec.toDirection();
    expect(direction).toEqual(Direction.East);
    vec = new Vec3(0, 1, 0);
    direction = vec.toDirection();
    expect(direction).toEqual(Direction.Up);
    vec = new Vec3(0, 0, 1);
    direction = vec.toDirection();
    expect(direction).toEqual(Direction.South);
    vec = new Vec3(-1, 0, 0);
    direction = vec.toDirection();
    expect(direction).toEqual(Direction.West);
    vec = new Vec3(0, -1, 0);
    direction = vec.toDirection();
    expect(direction).toEqual(Direction.Down);
    vec = new Vec3(0, 0, -1);
    direction = vec.toDirection();
    expect(direction).toEqual(Direction.North);

    // Weird cases
    vec = new Vec3(0.5, 0.7, 0.5);
    direction = vec.toDirection();
    expect(direction).toEqual(Direction.Up);
  });

  it('should throw an error when converting a zero-length Vec3 instance to Direction', () => {
    const vec = new Vec3(0, 0, 0);
    expect(() => vec.toDirection()).toThrow('Cannot convert zero-length vector to direction');
  });

  it('should return vector offset up when using up function', () => {
    const vec = Vec3.Zero.up();
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(1);
    expect(vec.z).toEqual(0);
  })

  it('should return vector offset down when using down function', () => {
    const vec = Vec3.Zero.down();
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(-1);
    expect(vec.z).toEqual(0);
  })

  it('should return vector offset north when using north function', () => {
    const vec = Vec3.Zero.north();
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(0);
    expect(vec.z).toEqual(-1);
  })

  it('should return vector offset south when using south function', () => {
    const vec = Vec3.Zero.south();
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(0);
    expect(vec.z).toEqual(1);
  })

  it('should return vector offset east when using east function', () => {
    const vec = Vec3.Zero.east();
    expect(vec.x).toEqual(1);
    expect(vec.y).toEqual(0);
    expect(vec.z).toEqual(0);
  })

  it('should return vector offset west when using west function', () => {
    const vec = Vec3.Zero.west();
    expect(vec.x).toEqual(-1);
    expect(vec.y).toEqual(0);
    expect(vec.z).toEqual(0);
  })


  it('should return a new Vec3 instance with floored values', () => {
    const vec = new Vec3(1.5, 2.7, 3.9);
    const result = vec.floor();
    expect(result.x).toEqual(1);
    expect(result.y).toEqual(2);
    expect(result.z).toEqual(3);
  });

  it('should return a new Vec3 instance with ceiling values', () => {
    const vec = new Vec3(1.5, 2.7, 3.9);
    const result = vec.ceil();
    expect(result.x).toEqual(2);
    expect(result.y).toEqual(3);
    expect(result.z).toEqual(4);
  });

  it('should return a new Vec3 instance with rounded values', () => {
    const vec = new Vec3(1.5, 2.7, 3.9);
    const result = vec.round();
    expect(result.x).toEqual(2);
    expect(result.y).toEqual(3);
    expect(result.z).toEqual(4);
  });

  it('should return a new Vec3 instance with ceilX, floorY and roundZ', () => {
    const vec = new Vec3(1.1, 1.9, 1.5);
    const result = vec.ceilX().floorY().roundZ();
    expect(result.x).toEqual(2);
    expect(result.y).toEqual(1);
    expect(result.z).toEqual(2);
  });

  it('should return true when Vec3 instance is within delta of another Vec3 instance', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(1.1, 2.1, 3.1);
    expect(vec1.almostEqual(vec2, 0.2)).toBe(true);
  });

  it('should return false when Vec3 instance is not within delta of another Vec3 instance', () => {
    const vec1 = new Vec3(1, 2, 3);
    const vec2 = new Vec3(1.1, 2.1, 3.1);
    expect(vec1.almostEqual(vec2, 0.05)).toBe(false);
  });

  it('should return true when Vec3 instance is within delta of another location', () => {
    const vec1 = new Vec3(1, 2, 3);
    expect(vec1.almostEqual(1.1, 2.1, 3.1, 0.2)).toBe(true);
  });

  it('should return "Vec3(1, 1, 1)" when `Vec3.toString()` is called with default values', () => {
    const vec = new Vec3(1, 1, 1);
    expect(vec.toString()).toEqual('Vec3(1, 1, 1)');
  });

  it('should return "Vec3(1;2;3)" when `Vec3.toString()` is called with "long" format and ";" as separator', () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.toString('long', ';')).toEqual('Vec3(1;2;3)');
  });

  it('should return "1, 1, 1" when `Vec3.toString()` is called with "short" format', () => {
    const vec = new Vec3(1, 1, 1);
    expect(vec.toString('short')).toEqual('1, 1, 1');
  });

  it('should return "1;2;3" when `Vec3.toString()` is called with "short" format and ";" as separator', () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.toString('short', ';')).toEqual('1;2;3');
  });

  it('should return correct rotation values', () => {
    const cases = [
      {"normal":{"x":0,"y":1,"z":0},"rotation":{"x":-90,"y":0}},
      {"normal":{"x":0,"y":-1,"z":0},"rotation":{"x":90,"y":0}},
      {"normal":{"x":0,"y":0,"z":-1},"rotation":{"x":0,"y":-180}},
      {"normal":{"x":0,"y":0,"z":1},"rotation":{"x":0,"y":0}},
      {"normal":{"x":1,"y":0,"z":0},"rotation":{"x":0,"y":-90}},
      {"normal":{"x":-1,"y":0,"z":0},"rotation":{"x":0,"y":90}},
    ];
    for (const testCase of cases) {
      const vec = Vec3.from(testCase.normal.x, testCase.normal.y, testCase.normal.z);
      const rotation = vec.toRotation();
      expect(rotation.x).toBeCloseTo(testCase.rotation.x, 1);
      expect(rotation.y).toBeCloseTo(testCase.rotation.y, 1);
    }
  });

  describe('toStructureRotation', () => {
    it('should return StructureRotation.None when aligned rotation is 0', () => {
      const vec = Vec3.fromRotation({
        x: 0,
        y: 0,
      });
      expect(vec.toStructureRotation()).toEqual(StructureRotation.None);
    });

    it('should return StructureRotation.Rotate90 when aligned rotation is 90', () => {
      const vec = Vec3.fromRotation({
        x: 0,
        y: 90,
      });
      expect(vec.toStructureRotation()).toEqual(StructureRotation.Rotate90);
    });

    it('should return StructureRotation.Rotate180 when aligned rotation is 180', () => {
      const vec = Vec3.fromRotation({
        x: 0,
        y: 180,
      });
      expect(vec.toStructureRotation()).toEqual(StructureRotation.Rotate180);
    });

    it('should return StructureRotation.Rotate270 when aligned rotation is -90', () => {
      const vec = Vec3.fromRotation({
        x: 0,
        y: -90,
      });
      expect(vec.toStructureRotation()).toEqual(StructureRotation.Rotate270);
    });

    it('should return StructureRotation.Rotate90 when aligned rotation is 120 degrees', () => {
      const vec = Vec3.fromRotation({
        x: 0,
        y: 120,
      });
      expect(vec.toStructureRotation()).toEqual(StructureRotation.Rotate90);
    });

    it('should throw an error when the vector is a zero vector', () => {
      const vec = new Vec3(0, 0, 0);
      expect(() => vec.toStructureRotation()).toThrow('Cannot convert zero-length vector to direction');
    });
  });

});