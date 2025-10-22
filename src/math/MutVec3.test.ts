import MutVec3 from './MutVec3';
import Vec3 from './Vec3';
import { Direction, StructureRotation } from '@minecraft/server';

describe('MutVec3', () => {
    // Constructor tests
    it('creates with Direction constants', () => {
        expect(new MutVec3(Direction.Down)).toMatchObject({
            x: 0,
            y: -1,
            z: 0,
        });
        expect(new MutVec3(Direction.Up)).toMatchObject({ x: 0, y: 1, z: 0 });
        expect(new MutVec3(Direction.North)).toMatchObject({
            x: 0,
            y: 0,
            z: -1,
        });
        expect(new MutVec3(Direction.South)).toMatchObject({
            x: 0,
            y: 0,
            z: 1,
        });
        expect(new MutVec3(Direction.East)).toMatchObject({ x: 1, y: 0, z: 0 });
        expect(new MutVec3(Direction.West)).toMatchObject({
            x: -1,
            y: 0,
            z: 0,
        });
    });

    it('creates from numbers/array/objects', () => {
        expect(new MutVec3(1, 2, 3)).toMatchObject({ x: 1, y: 2, z: 3 });
        expect(new MutVec3([4, 5, 6])).toMatchObject({ x: 4, y: 5, z: 6 });
        const src = new MutVec3(7, 8, 9);
        expect(new MutVec3(src)).toMatchObject({ x: 7, y: 8, z: 9 });
        expect(new MutVec3({ x: 7, y: 8, z: 9 } as any)).toMatchObject({
            x: 7,
            y: 8,
            z: 9,
        });
    });

    it('throws for invalid vector inputs', () => {
        expect(() => new MutVec3(null as any)).toThrow('Invalid vector');
        expect(() => new MutVec3({} as any)).toThrow('Invalid vector');
        expect(() => new MutVec3({ x: 1 } as any)).toThrow('Invalid vector');
        expect(() => new MutVec3({ y: 2 } as any)).toThrow('Invalid vector');
        expect(() => new MutVec3({ z: 3 } as any)).toThrow('Invalid vector');
    });

    // copy and convert tests
    it('copy creates a separate instance with same values', () => {
        const v = new MutVec3(1, 2, 3);
        const c = v.copy();
        expect(c).not.toBe(v);
        expect(c).toMatchObject({ x: 1, y: 2, z: 3 });
    });

    it('toImmutable conversion', () => {
        const m = new MutVec3(3, 4, 5);
        const im = m.toImmutable();
        expect(im).toBeInstanceOf(Vec3);
        expect(im.x).toBe(3);
        expect(im.y).toBe(4);
        expect(im.z).toBe(5);
    });

    // Direction to tests
    it('should get the direction to a MutVec3 correctly.', () => {
        const vec = new MutVec3(0, 0, 0);
        const target = new MutVec3(0, 0, 1);
        const desiredResult = new MutVec3(0, 0, 1);
        const result = vec.directionTo(target).add(0); // Make tests not fail: -0 ~= 0?
        expect(result).toMatchObject(desiredResult);
    });

    // normalize / length tests
    it('normalizes in place', () => {
        const v = new MutVec3(1, 2, 3);
        const ret = v.normalize();
        expect(ret).toBe(v);
        expect(v.x).toBeCloseTo(0.2672612419124244);
        expect(v.y).toBeCloseTo(0.5345224838248488);
        expect(v.z).toBeCloseTo(0.8017837257372732);
    });

    it('normalize throws on zero', () => {
        const v = new MutVec3(0, 0, 0);
        expect(() => v.normalize()).toThrow(
            'Cannot normalize zero-length vector'
        );
    });

    it('length and lengthSquared', () => {
        const v = new MutVec3(1, 2, 3);
        expect(v.length()).toBeCloseTo(3.7416573867739413);
        expect(v.lengthSquared()).toBe(14);
    });

    // equals tests
    it('equals works across inputs', () => {
        const v = new MutVec3(1, 2, 3);
        expect(v.equals(new MutVec3(1, 2, 3))).toBe(true);
        expect(v.equals(new MutVec3(4, 5, 6))).toBe(false);
        expect(v.equals({ x: 1, y: 2, z: 3 } as any)).toBe(true);
        expect(v.equals([1, 2, 3] as any)).toBe(true);
        expect(v.equals(Direction.Up as any)).toBe(false);
        expect(v.equals(null as any)).toBe(false);
    });

    // add / subtract
    it('add mutates and returns same instance', () => {
        const v = new MutVec3(1, 2, 3);
        const ret = v.add(new MutVec3(4, 5, 6));
        expect(ret).toBe(v);
        expect(v).toMatchObject({ x: 5, y: 7, z: 9 });
    });

    it('add numbers mutates', () => {
        const v = new MutVec3(1, 2, 3);
        v.add(4, 5, 6);
        expect(v).toMatchObject({ x: 5, y: 7, z: 9 });
    });

    it('subtract mutates', () => {
        const v = new MutVec3(4, 5, 6);
        v.subtract(1, 2, 3);
        expect(v).toMatchObject({ x: 3, y: 3, z: 3 });
    });

    // multiply / divide
    it('multiply by number mutates', () => {
        const v = new MutVec3(1, 2, 3);
        const ret = v.multiply(2);
        expect(ret).toBe(v);
        expect(v).toMatchObject({ x: 2, y: 4, z: 6 });
    });

    it('multiply by vector mutates component-wise', () => {
        const v = new MutVec3(1, 2, 3);
        v.multiply(new MutVec3(2, 3, 4));
        expect(v).toMatchObject({ x: 2, y: 6, z: 12 });
    });

    it('divide by number mutates', () => {
        const v = new MutVec3(6, 8, 10);
        v.divide(2);
        expect(v).toMatchObject({ x: 3, y: 4, z: 5 });
    });

    it('divide by zero throws', () => {
        const v = new MutVec3(1, 1, 1);
        expect(() => v.divide(0)).toThrow('Cannot divide by zero');
    });

    // distance / dot / angleBetween
    it('distance is computed without mutating', () => {
        const v = new MutVec3(1, 2, 3);
        const d = v.distance(new MutVec3(4, 5, 6));
        expect(d).toBeCloseTo(5.196152422706632);
        expect(v).toMatchObject({ x: 1, y: 2, z: 3 });
    });

    it('dot returns scalar', () => {
        const a = new MutVec3(1, 2, 3);
        const b = new MutVec3(4, 5, 6);
        expect(a.dot(b)).toBe(32);
    });

    it('cross mutates to cross product', () => {
        const a = new MutVec3(1, 2, 3);
        const b = new MutVec3(4, 5, 6);
        const ret = a.cross(b);
        expect(ret).toBe(a);
        expect(a).toMatchObject({ x: -3, y: 6, z: -3 });
    });

    // interpolation
    it('lerp t=0 keeps original', () => {
        const a = new MutVec3(1, 2, 3);
        a.lerp(new MutVec3(4, 5, 6), 0);
        expect(a).toMatchObject({ x: 1, y: 2, z: 3 });
    });

    it('lerp t=1 sets to target', () => {
        const a = new MutVec3(1, 2, 3);
        a.lerp(new MutVec3(4, 5, 6), 1);
        expect(a).toMatchObject({ x: 4, y: 5, z: 6 });
    });

    // projection and reflection
    it('projectOnto mutates to projection', () => {
        const v = new MutVec3(1, 2, 3);
        v.projectOnto(new MutVec3(4, 5, 6));
        expect(v.x).toBeCloseTo(1.6623376623376624);
        expect(v.y).toBeCloseTo(2.077922077922078);
        expect(v.z).toBeCloseTo(2.4935064935064934);
    });

    it('projectOnto zero sets to zero', () => {
        const v = new MutVec3(1, 2, 3);
        v.projectOnto(new MutVec3(0, 0, 0));
        expect(v).toMatchObject({ x: 0, y: 0, z: 0 });
    });

    it('reflect mutates correctly', () => {
        const v = new MutVec3(1, 2, 3);
        v.reflect(new MutVec3(0, 1, 0));
        expect(v).toMatchObject({ x: 1, y: -2, z: 3 });
    });

    // rotation
    it('rotate mutates correctly', () => {
        const v = new MutVec3(1, 0, 0);
        v.rotate({ x: 0, y: 0, z: 1 }, 90);
        expect(v.x).toBeCloseTo(0);
        expect(v.y).toBeCloseTo(1);
        expect(v.z).toBeCloseTo(0);
    });

    // rounding helpers
    it('floor/ceil/round mutate', () => {
        const a = new MutVec3(1.5, 2.7, 3.9).floor();
        expect(a).toMatchObject({ x: 1, y: 2, z: 3 });
        const b = new MutVec3(1.5, 2.7, 3.1).ceil();
        expect(b).toMatchObject({ x: 2, y: 3, z: 4 });
        const c = new MutVec3(1.5, 2.7, 3.1).round();
        expect(c).toMatchObject({ x: 2, y: 3, z: 3 });
    });

    it('axis helpers mutate', () => {
        const v = new MutVec3(0, 0, 0);
        v.up();
        expect(v).toMatchObject({ x: 0, y: 1, z: 0 });
        v.down();
        expect(v).toMatchObject({ x: 0, y: 0, z: 0 });
        v.north();
        expect(v).toMatchObject({ x: 0, y: 0, z: -1 });
        v.south();
        expect(v).toMatchObject({ x: 0, y: 0, z: 0 });
        v.east();
        expect(v).toMatchObject({ x: 1, y: 0, z: 0 });
        v.west();
        expect(v).toMatchObject({ x: 0, y: 0, z: 0 });
    });

    // toDirection
    it('toDirection converts non-zero vectors to a Direction or throws for zero', () => {
        expect(new MutVec3(1, 0, 0).toDirection()).toBe(Direction.East);
        expect(new MutVec3(0, 1, 0).toDirection()).toBe(Direction.Up);
        expect(new MutVec3(0, 0, 1).toDirection()).toBe(Direction.South);
        expect(new MutVec3(-1, 0, 0).toDirection()).toBe(Direction.West);
        expect(new MutVec3(0, -1, 0).toDirection()).toBe(Direction.Down);
        expect(new MutVec3(0, 0, -1).toDirection()).toBe(Direction.North);
        const weird = new MutVec3(0.5, 0.7, 0.5).toDirection();
        expect(weird).toBe(Direction.Up);
        expect(() => new MutVec3(0, 0, 0).toDirection()).toThrow(
            'Cannot convert zero-length vector to direction'
        );
    });

    // string formatting
    it('toString formats values', () => {
        expect(new MutVec3(1, 1, 1).toString()).toBe('MutVec3(1, 1, 1)');
        expect(new MutVec3(1, 2, 3).toString('long', ';')).toBe(
            'MutVec3(1;2;3)'
        );
        expect(new MutVec3(1, 1, 1).toString('short')).toBe('1, 1, 1');
        expect(new MutVec3(1, 2, 3).toString('short', ';')).toBe('1;2;3');
    });

    it('fromString parses values', () => {
        expect(MutVec3.fromString('MutVec3(1, 2, 3)')).toMatchObject({
            x: 1,
            y: 2,
            z: 3,
        });
        expect(MutVec3.fromString('MutVec3(1;2;3)', 'long', ';')).toMatchObject(
            { x: 1, y: 2, z: 3 }
        );
        expect(MutVec3.fromString('1, 1, 1', 'short')).toMatchObject({
            x: 1,
            y: 1,
            z: 1,
        });
        expect(MutVec3.fromString('1;2;3', 'short', ';')).toMatchObject({
            x: 1,
            y: 2,
            z: 3,
        });
    });

    describe('toStructureRotation', () => {
        it('returns proper structure rotation for standard rotations', () => {
            const v0 = MutVec3.fromRotation({ x: 0, y: 0 });
            expect(v0.toStructureRotation()).toEqual(StructureRotation.None);
            const v90 = MutVec3.fromRotation({ x: 0, y: 90 });
            expect(v90.toStructureRotation()).toEqual(
                StructureRotation.Rotate90
            );
            const v180 = MutVec3.fromRotation({ x: 0, y: 180 });
            expect(v180.toStructureRotation()).toEqual(
                StructureRotation.Rotate180
            );
            const v270 = MutVec3.fromRotation({ x: 0, y: -90 });
            expect(v270.toStructureRotation()).toEqual(
                StructureRotation.Rotate270
            );
            const v120 = MutVec3.fromRotation({ x: 0, y: 120 });
            expect(v120.toStructureRotation()).toEqual(
                StructureRotation.Rotate90
            );
        });

        it('throws for zero vector', () => {
            const v = new MutVec3(0, 0, 0);
            expect(() => v.toStructureRotation()).toThrow(
                'Cannot convert zero-length vector to direction'
            );
        });
    });

    // almostEqual
    it('almostEqual works with delta', () => {
        const a = new MutVec3(1, 2, 3);
        expect(a.almostEqual(new MutVec3(1.1, 2.1, 3.1), 0.2)).toBe(true);
        expect(a.almostEqual(new MutVec3(1.1, 2.1, 3.1), 0.05)).toBe(false);
        expect(a.almostEqual(1.1, 2.1, 3.1, 0.2)).toBe(true);
    });
});
