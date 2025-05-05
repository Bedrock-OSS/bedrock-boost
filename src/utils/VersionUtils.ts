import { Entity } from "@minecraft/server";

/**
 * Returns true if the script API version is 2.0.0 or higher, otherwise false.
 * @param entity The entity to check.
 * @returns True if the script API version is 2.0.0 or higher, otherwise false.
 * @remarks
 * This function is a workaround, that checks whether isValid is a boolean or a function.
 */
export function isVersion2(entity: Entity): boolean {
    return typeof Object.getPrototypeOf(entity).isValid !== 'function';
}

/**
 * Returns true if the entity is valid, otherwise false.
 * @param entity The entity to check.
 * @returns True if the entity is valid, otherwise false.
 * @remarks
 * This function is a workaround, that checks isValid both as a boolean and a function.
 */
export function isValid(entity: Entity): boolean {
    const f = Object.getPrototypeOf(entity).isValid;
    if (typeof f === 'function') {
        return f.call(entity) as boolean;
    }
    return (entity.isValid as any) as boolean;
}