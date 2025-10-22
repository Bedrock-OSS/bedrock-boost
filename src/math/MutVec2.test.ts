import MutVec2 from './MutVec2';
import Vec2 from './Vec2';
import { Direction } from '@minecraft/server';

describe('MutVec2', () => {
    it('constructs from numbers', () => {
        const v = new MutVec2(1, 2);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
    });

    it('constructs from Vec2 and MutVec2', () => {
        const immutable = new Vec2(3, 4);
        const fromVec2 = new MutVec2(immutable);
        expect(fromVec2).toMatchObject({ x: 3, y: 4 });

        const fromMut = new MutVec2(fromVec2);
        expect(fromMut).toMatchObject({ x: 3, y: 4 });
    });

    it('constructs from Direction and rejects vertical directions', () => {
        expect(() => new MutVec2(Direction.Down)).toThrow('Invalid direction');
        const north = new MutVec2(Direction.North);
        expect(north).toMatchObject({ x: 0, y: 1 });
    });

    it('mutates when adding', () => {
        const v = new MutVec2(1, 2);
        const result = v.add(3, 4);
        expect(result).toBe(v);
        expect(v).toMatchObject({ x: 4, y: 6 });
    });

    it('add can take a single number', () => {
        const v = new MutVec2(1, 2);
        const result = v.add(1);
        expect(result).toBe(v);
        expect(v).toMatchObject({ x: 2, y: 3 });
    });

    it('normalizes in place', () => {
        const v = new MutVec2(3, 4);
        const result = v.normalize();
        expect(result).toBe(v);
        expect(v.length()).toBeCloseTo(1);
    });

    it('converts to immutable Vec2 without mutating original', () => {
        const v = new MutVec2(5, 6);
        const immutable = v.toImmutable();
        expect(immutable).toBeInstanceOf(Vec2);
        expect(immutable.x).toBe(5);
        expect(immutable.y).toBe(6);
        expect(v).toMatchObject({ x: 5, y: 6 });
    });

    it('projects onto another vector in place', () => {
        const v = new MutVec2(2, 0);
        const result = v.projectOnto(new MutVec2(0, 2));
        expect(result).toBe(v);
        expect(v).toMatchObject({ x: 0, y: 0 });
    });

    it('reflects across a normal without allocating new instances', () => {
        const v = new MutVec2(1, 0);
        const result = v.reflect(Direction.North);
        expect(result).toBe(v);
        expect(v).toMatchObject({ x: 1, y: 0 });
    });

    it('should get the direction to a MutVec2 correctly.', () => {
        const vec = new Vec2(0, 0);
        const target = new Vec2(0, 1);
        const desiredResult = new Vec2(0, 1);
        expect(vec.directionTo(target)).toEqual(desiredResult);
    });
});
