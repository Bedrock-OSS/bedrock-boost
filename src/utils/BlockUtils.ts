import { Dimension, Vector3 } from "@minecraft/server";
import { getDimensionHeightRange } from "../Cache";

/**
 * Checks if a location is between the min and max height of a dimension.
 * @param dimension The dimension to check.
 * @param location The location to check.
 * @returns True if the location is valid, otherwise false.
 */
export function isValidLocation(dimension:Dimension|string, location:Vector3):boolean {
    if (typeof dimension !== "string") {
        dimension = dimension.id;
    }
    const range = getDimensionHeightRange(dimension);
    return location.y >= range.min && location.y <= range.max;
}