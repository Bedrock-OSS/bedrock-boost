import { Entity, Vector3 } from "@minecraft/server";

export class EntityUtils {
    /**
     * Finds the hitbox dimensions and base corner location of an entity.
     * @param entity The target entity.
     * @param maxWidth Maximum search width (default: 5 blocks).
     * @param maxHeight Maximum search height (default: 5 blocks).
     * @returns Object with hitbox size (`bound`) and corner location (`location`).
     */
    static findEntityHitbox(
        entity: Entity,
        maxWidth: number = 5,
        maxHeight: number = 5
    ): { bound: Vector3; location: Vector3 } {
        const { location: { x, y, z }, dimension } = entity;

        const getRaycastHitDistance = (
            ox: number, oy: number, oz: number,
            dx: number, dy: number, dz: number,
            maxDistance: number
        ): number => {
            const rayHit = dimension
                .getEntitiesFromRay(
                    { x: ox, y: oy, z: oz },
                    { x: dx, y: dy, z: dz },
                    { maxDistance, ignoreBlockCollision: true, type: entity.typeId }
                )
                .find((res) => res.entity === entity);

            return rayHit ? maxDistance - rayHit.distance : 0;
        };

        const height = getRaycastHitDistance(x, y + maxHeight, z, 0, -1, 0, maxHeight);
        const yMid = y + (height ? height / 2 : 0);

        const width = getRaycastHitDistance(x - maxWidth, yMid, z, 1, 0, 0, maxWidth);
        const length = getRaycastHitDistance(x, yMid, z - maxWidth, 0, 0, 1, maxWidth);

        return {
            bound: { x: width * 2, y: height, z: length * 2 },
            location: { x: x - width, y: y, z: z - length }
        };
    }

    // Additional utility methods can be added here
    // Example:
    // static isGrounded(entity: Entity): boolean { ... }
}
