import { Dimension, world } from "@minecraft/server";

const dimensions: { [key: string]: Dimension } = {};

/**
 * Returns a dimension from the cache or gets it from the API and caches it.
 * @param name The name of the dimension.
 * @returns The dimension.
 */
export function getDimension(name: string) {
  if (dimensions[name]) return dimensions[name];
  return dimensions[name] = world.getDimension(name);
}