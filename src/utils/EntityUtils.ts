import { Entity } from '@minecraft/server';
import Vec3 from '../math/Vec3';

export interface EntityHitbox {
    bound: Vec3;
    location: Vec3;
    offset: Vec3;
}

export class EntityUtils {
    /**
     * Finds the hitbox dimensions, base corner location, and offset of an entity.
     * @param entity The target entity.
     * @param maxWidth Maximum search width (default: 5 blocks).
     * @param maxHeight Maximum search height (default: 5 blocks).
     * @returns Object with hitbox size (`bound`), corner location (`location`), and offset. Returns `null` if invalid.
     */
    static findEntityHitbox(
        entity: Entity,
        maxWidth: number = 5,
        maxHeight: number = maxWidth
    ): EntityHitbox | null {
        if (!entity?.isValid) return null;

        const location = Vec3.from(entity.location);
        const dimension = entity.dimension;

        const raycastDistance = (
            origin: Vec3,
            dirVec: Vec3,
            maxDist: number
        ) => {
            const rayDistance = dimension
                .getEntitiesFromRay(origin, dirVec, {
                    type: entity.typeId,
                    ignoreBlockCollision: true,
                    maxDistance: maxDist + 2,
                })
                ?.find((hit) => hit.entity === entity)?.distance;

            return maxDist - (rayDistance ?? maxDist);
        };

        const upperHeight = raycastDistance(
            location.add(0, maxHeight, 0),
            Vec3.Down,
            maxHeight
        );

        const lowerHeight = raycastDistance(
            location.add(0, -maxHeight, 0),
            Vec3.Up,
            maxHeight
        );

        const rightWidth = raycastDistance(
            location.add(maxWidth, 0, 0),
            Vec3.from(-1, 0.0001, 0),
            maxWidth
        );

        const leftWidth = raycastDistance(
            location.add(-maxWidth, 0, 0),
            Vec3.from(1, 0.0001, 0),
            maxWidth
        );

        const frontLength = raycastDistance(
            location.add(0, 0, maxWidth),
            Vec3.from(0, 0.0001, -1),
            maxWidth
        );

        const backLength = raycastDistance(
            location.add(0, 0, -maxWidth),
            Vec3.from(0, 0.0001, 1),
            maxWidth
        );

        const height = upperHeight + lowerHeight;
        const width = rightWidth + leftWidth;
        const length = frontLength + backLength;

        if (height === 0 || width === 0 || length === 0) return null;

        const bound = Vec3.from(width, height, length);
        const offset = Vec3.from(-leftWidth, -lowerHeight, -backLength);
        const finalLocation = location.add(offset);

        return {
            bound,
            location: finalLocation,
            offset,
        };
    }
}
