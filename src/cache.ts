import { NumberRange } from "@minecraft/common";
import { Dimension, world } from "@minecraft/server";

const dimensions: { [key: string]: Dimension } = {};

const dimensionHeightRanges: { [key: string]: NumberRange } = {};

/**
 * Returns a dimension from the cache or gets it from the API and caches it.
 * @param name The name of the dimension.
 * @returns The dimension.
 */
export function getDimension(name: string) {
  if (dimensions[name]) return dimensions[name];
  return dimensions[name] = world.getDimension(name);
}

/**
 * Returns a dimension height range from the cache or gets it from the API and caches it.
 * @param name The name of the dimension.
 * @returns The dimension height range.
 */
export function getDimensionHeightRange(name: string) {
  if (dimensionHeightRanges[name]) return dimensionHeightRanges[name];
  return dimensionHeightRanges[name] = getDimension(name).heightRange;
}