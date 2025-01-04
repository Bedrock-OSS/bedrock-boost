import { Dimension, Vector3 } from "@minecraft/server";
import { getDimensionHeightRange } from "../Cache";

export function isValidLocation(dimension:Dimension|string, location:Vector3):boolean {
    if (typeof dimension !== "string") {
        dimension = dimension.id;
    }
    const range = getDimensionHeightRange(dimension);
    return location.y >= range.min && location.y <= range.max;
}