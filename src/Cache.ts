import { NumberRange } from '@minecraft/common';
import { BlockPermutation, Dimension, world } from '@minecraft/server';

const dimensions: { [key: string]: Dimension } = {};

const dimensionHeightRanges: { [key: string]: NumberRange } = {};

const permutations: { [key: string]: BlockPermutation } = {};

/**
 * Returns a dimension from the cache or gets it from the API and caches it.
 * @param name The name of the dimension.
 * @returns The dimension.
 */
export function getDimension(name: string) {
    if (dimensions[name]) return dimensions[name];
    return (dimensions[name] = world.getDimension(name));
}

/**
 * Returns a dimension height range from the cache or gets it from the API and caches it.
 * @param name The name of the dimension.
 * @returns The dimension height range.
 */
export function getDimensionHeightRange(name: string) {
    if (dimensionHeightRanges[name]) return dimensionHeightRanges[name];
    return (dimensionHeightRanges[name] = getDimension(name).heightRange);
}

/**
 * Returns a block permutation from the cache or gets it from the API and caches it.
 * @param blockName The name of the block.
 * @param states The block states.
 * @returns The block permutation.
 */
export function getBlockPermutation(
    blockName: string,
    states?: Record<string, boolean | number | string>
): BlockPermutation {
    const key = `${blockName}:${JSON.stringify(states)}`;
    if (permutations[key]) return permutations[key];
    return (permutations[key] = BlockPermutation.resolve(blockName, states));
}
