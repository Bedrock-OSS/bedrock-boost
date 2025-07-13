import { Entity } from "@minecraft/server";
import Vec3 from "../Vec3";

export interface EntityHitbox {
	bound: Vec3;
	location: Vec3;
	offset: Vec3;
}

export interface Vector3 {
	x: number;
	y: number;
	z: number;
}

export class EntityUtils {
    /**
     * Finds the hitbox dimensions and base corner location of an entity.
     * @param entity The target entity.
     * @param maxWidth Maximum search width (default: 5 blocks).
     * @param maxHeight Maximum search height (default: 5 blocks).
     * @returns Object with hitbox size (`bound`), corner location (`location`) and corner offset ('offset'), or null if raycast fails.
	 */
	export default function getEntityHitbox(entity: Entity, maxWidth: number = 5, maxHeight: number = 5): EntityHitbox | null {
		if (!entity?.isValid) return null
	
		const direction = (x: number, y: number, z: number): Vector3 => ({ x, y, z })
		const originOffset = direction
	
		const raycastDistance = (origin: Vector3, directionVector: Vector3, maxDistance: number): number => {
			return entity.dimension
				.getEntitiesFromRay(origin, directionVector, {
					type: entity.typeId,
					ignoreBlockCollision: true,
					maxDistance
				})
				?.find(hit => hit.entity === entity)?.distance ?? 0
		}
	
		const { x, y, z } = entity.location
	
		const upperHeight = raycastDistance({ x, y, z }, direction(0, 1, 0), maxHeight)
		const lowerHeight = raycastDistance(
			originOffset(x, y + 0.0001, z),
			direction(0, -1, 0),
			maxHeight
		)
	
		const width = raycastDistance({ x, y, z }, direction(-1, 0.0001, 0), maxWidth)
		const length = raycastDistance({ x, y, z }, direction(0, 0.0001, -1), maxWidth)
	
		if ([upperHeight, lowerHeight, width, length].includes(0)) {
			// Possibly inaccurate reading
			return null
		}
	
		return {
			bound: Vec3.from(width * 2, upperHeight + lowerHeight, length * 2),
			location: Vec3.from(x-width, y-lowerHeight, z-length),
			offset: Vec3.from(-width, -lowerHeight, -length)
		}
	}
}
