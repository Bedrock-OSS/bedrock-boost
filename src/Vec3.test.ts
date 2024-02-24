import { LogLevel, Logger } from './Logging';
import Vec3 from './Vec3';
import { Direction } from '@minecraft/server';

describe('Vec3', () => {
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
    expect(vec.z).toEqual(1);
  });

  it('should create a Vec3 instance with correct values for Direction.South', () => {
    const vec = new Vec3(Direction.South);
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(0);
    expect(vec.z).toEqual(-1);
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

  it('should create a Vec3 instance with correct values for array inputs', () => {
    const vec = new Vec3([4, 5, 6]);
    expect(vec.x).toEqual(4);
    expect(vec.y).toEqual(5);
    expect(vec.z).toEqual(6);
  });

  it('should create a Vec3 instance with correct values for Vec3 inputs', () => {
    const inputVec = new Vec3(7, 8, 9);
    const vec = new Vec3(inputVec);
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
  
  it('should create a copy of Vec3 instance', () => {
    const vec = new Vec3(1, 2, 3);
    const copyVec = vec.copy();
    expect(copyVec.x).toEqual(vec.x);
    expect(copyVec.y).toEqual(vec.y);
    expect(copyVec.z).toEqual(vec.z);
  });
  
  it('should create a Vec3 instance with correct values for number inputs', () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.x).toEqual(1);
    expect(vec.y).toEqual(2);
    expect(vec.z).toEqual(3);
  });

  it('should create a Vec3 instance with correct values for array inputs', () => {
    const vec = new Vec3([4, 5, 6]);
    expect(vec.x).toEqual(4);
    expect(vec.y).toEqual(5);
    expect(vec.z).toEqual(6);
  });

  it('should create a Vec3 instance with correct values for Vec3 inputs', () => {
    const inputVec = new Vec3(7, 8, 9);
    const vec = new Vec3(inputVec);
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
  
  it('should create a copy of Vec3 instance', () => {
    const vec = new Vec3(1, 2, 3);
    const copyVec = vec.copy();
    expect(copyVec.x).toEqual(vec.x);
    expect(copyVec.y).toEqual(vec.y);
    expect(copyVec.z).toEqual(vec.z);
  });

  it('should create a Vec3 instance with correct values for fromYawPitch method', () => {
    const vec = Vec3.fromYawPitch(45, 30);
    expect(vec.x).toBeCloseTo(0.6123724356957945);
    expect(vec.y).toBeCloseTo(0.5);
    expect(vec.z).toBeCloseTo(0.6123724356957945);
  });

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

  it('should return the length of a Vec3 instance', () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.length()).toBeCloseTo(3.7416573867739413);
  });

  it('should return the length squared of a Vec3 instance', () => {
    const vec = new Vec3(1, 2, 3);
    expect(vec.lengthSquared()).toBeCloseTo(14);
  });

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

});