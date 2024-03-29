import { Dimension, Vector3 } from "@minecraft/server";
import { getDimensionHeightRange } from "./Cache";

// /**
//  * Checks if a block is passable.
//  */
// export function isPassable(block: Block) {
//     if (!block || block.isAir) return true;
//     if (block.isLiquid) return true;
//     const result = block.dimension.getBlockFromRay(Vec3.from(block.location).add(Vec3.from(0, 0.9, 0)), Vec3.from(Direction.Down), {
//         includePassableBlocks: false,
//         includeLiquidBlocks: false,
//         maxDistance: 1
//     });
//     if (!result) return true;
//     return !Vec3.from(result.block.location).equals(block.location);
// }

export function isValidLocation(dimension:Dimension|string, location:Vector3):boolean {
    if (typeof dimension !== "string") {
        dimension = dimension.id;
    }
    const range = getDimensionHeightRange(dimension);
    return location.y >= range.min && location.y <= range.max;
}