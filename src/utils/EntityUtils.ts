import { Entity } from "@minecraft/server"
import Vec3 from "../Vec3"

export interface EntityHitbox {
	bound: Vec3
	location: Vec3
	offset: Vec3
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
		if (!entity?.isValid) return null

		const direction = (x, y, z) => ({ x, y, z })
		const origin = (x, y, z) => ({ x, y, z }) // kept separate per your request

		const { location: entityLocation, dimension } = entity

		const raycastDistance = (origin, dirVec, maxDist) => {
			let rayDistance = dimension
				.getEntitiesFromRay(origin, dirVec, {
					type: entity.typeId,
					ignoreBlockCollision: true,
					maxDistance: maxDist + 2
				})
				?.find(hit => hit.entity === entity)?.distance

			return maxDist - (rayDistance ?? maxDist)
		}

		const upperHeight = raycastDistance(
			origin(entityLocation.x, entityLocation.y + maxHeight, entityLocation.z),
			direction(0, -1, 0),
			maxHeight
		)

		const lowerHeight = raycastDistance(
			origin(entityLocation.x, entityLocation.y - maxHeight, entityLocation.z),
			direction(0, 1, 0),
			maxHeight
		)

		const rightWidth = raycastDistance(
			origin(entityLocation.x + maxWidth, entityLocation.y, entityLocation.z),
			direction(-1, 0.0001, 0),
			maxWidth
		)

		const leftWidth = raycastDistance(
			origin(entityLocation.x - maxWidth, entityLocation.y, entityLocation.z),
			direction(1, 0.0001, 0),
			maxWidth
		)

		const frontLength = raycastDistance(
			origin(entityLocation.x, entityLocation.y, entityLocation.z + maxWidth),
			direction(0, 0.0001, -1),
			maxWidth
		)

		const backLength = raycastDistance(
			origin(entityLocation.x, entityLocation.y, entityLocation.z - maxWidth),
			direction(0, 0.0001, 1),
			maxWidth
		)

		const height = upperHeight + lowerHeight
		const width = rightWidth + leftWidth
		const length = frontLength + backLength
		
		if (height === 0 || width === 0 || length === 0) return null
		
		let bound = Vec3.from(width, height, length)

		let offset = Vec3.from(
			-leftWidth,
			-lowerHeight,
			-backLength
		)

		let location = Vec3.from(
			entityLocation.x + offset.x,
			entityLocation.y + offset.y,
			entityLocation.z + offset.z
		)

		return {
			bound,
			location,
			offset
		}
	}
}
