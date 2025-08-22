import { Dimension, Entity, Player, Vector3 } from '@minecraft/server';

export enum InputPermission {
    Movement = 'movement',
    Camera = 'camera',
}
export enum CameraShakeType {
    Positional = 'positional',
    Rotational = 'rotational',
}
export enum SlotLocation {
    Armor = 'slot.armor',
    Body = 'slot.armor.body',
    ArmorChest = 'slot.armor.chest',
    Feet = 'slot.armor.feet',
    Head = 'slot.armor.head',
    Legs = 'slot.armor.legs',
    Chest = 'slot.chest',
    EnderChest = 'slot.enderchest',
    Equippable = 'slot.equippable',
    Hotbar = 'slot.hotbar',
    Inventory = 'slot.inventory',
    Saddle = 'slot.saddle',
    MainHand = 'slot.weapon.mainhand',
    OffHand = 'slot.weapon.offhand',
}

export type Quantity =
    | number
    | {
          min?: number;
          max: number;
      }
    | {
          min: number;
          max?: number;
      };

export type ItemMatcher = {
    // these properties are always allowed
    item?: string;
    quantity?: Quantity;
    data?: number;
    slotLocation?: SlotLocation;
    slot?: number;
} & ( // if slot is specified, slotLocation must also be defined
    | { slot?: undefined; slotLocation?: SlotLocation }
    | { slot: number; slotLocation: SlotLocation }
);

/**
 * This is a collection of utility methods for working with commands until a proper API is available.
 * Once a proper API is available and stable, I'll change function to use that instead and mark it as deprecated.
 */
export class CommandUtils {
    /**
     * Adds camera shake effect to the specified player.
     * @param player - The player to apply the camera shake effect to.
     * @param type - The type of camera shake effect.
     * @param intensity - The intensity of the camera shake effect.
     * @param duration - The duration of the camera shake effect in seconds.
     */
    public static addCameraShake(
        player: Player,
        type: CameraShakeType,
        intensity: number,
        duration: number
    ): void {
        player.runCommand(
            `camerashake add @s ${intensity.toFixed(20)} ${duration.toFixed(
                20
            )} ${type}`
        );
    }
    /**
     * Stops the camera shake for the specified player.
     * @param player The player for whom to stop the camera shake.
     */
    public static stopCameraShake(player: Player): void {
        player.runCommand(`camerashake stop @s`);
    }
    /**
     * Destroys the block as if it's broken by a player.
     * @param dimension The dimension in which to destroy the block.
     * @param location The location of the block to destroy.
     */
    public static destroyBlock(dimension: Dimension, location: Vector3): void {
        dimension.runCommand(
            `setblock ${location.x} ${location.y} ${location.z} air destroy`
        );
    }
    /**
     * Checks if an entity have items matching the specified matchers.
     * @param entity The entity to check.
     * @param matchers The matchers to check.
     * @returns True if the entity has items matching the matchers, false otherwise.
     *
     * @remarks
     * This method uses the `testfor` command and `hasitem` selector, so that you can check for the data of the item.
     */
    public static isItem(entity: Entity, matchers: ItemMatcher[]): boolean {
        let cmd = `testfor @s[hasitem=[`;
        for (let i = 0; i < matchers.length; i++) {
            const matcher = matchers[i];
            cmd += `{item=${matcher.item}`;
            if (matcher.quantity !== void 0) {
                cmd += ',quantity=';
                if (typeof matcher.quantity === 'number') {
                    cmd += matcher.quantity;
                } else {
                    if (matcher.quantity.min !== void 0) {
                        cmd += matcher.quantity.min;
                    }
                    cmd += '..';
                    if (matcher.quantity.max !== void 0) {
                        cmd += matcher.quantity.max;
                    }
                }
            }
            if (matcher.data !== void 0) {
                cmd += `,data=${matcher.data}`;
            }
            if (matcher.slotLocation !== void 0) {
                cmd += `,location=${matcher.slotLocation}`;
                if (matcher.slot !== void 0) {
                    cmd += `,slot=${matcher.slot}`;
                }
            }
            cmd += '}';
        }
        cmd += ']]';
        const result = entity.runCommand(cmd);
        return result.successCount > 0;
    }

    /**
     * Pushes a fog to the top of the player's fog stack with the specified user provided ID.
     * @param player The player to push the fog to.
     * @param fogId The ID of the fog to push.
     * @param userProvidedId The user-provided ID of the fog to push.
     * @returns True if the fog was pushed successfully, false otherwise.
     *
     * @remarks
     * This method uses the `fog` command and `push` subcommand.
     */
    public static pushFog(
        player: Player,
        fogId: string,
        userProvidedId: string
    ): boolean {
        return (
            player.runCommand(`fog @s push ${fogId} ${userProvidedId}`)
                .successCount > 0
        );
    }

    /**
     * Pops a fog from the top of the player's fog stack matching the specified user provided ID.
     * @param player The player to pop the fog from.
     * @param fogId The ID of the fog to pop.
     * @param userProvidedId The user-provided ID of the fog to pop.
     * @returns True if the fog was popped successfully, false otherwise.
     *
     * @remarks
     * This method uses the `fog` command and `pop` subcommand.
     */
    public static popFog(
        player: Player,
        fogId: string,
        userProvidedId: string
    ): boolean {
        return (
            player.runCommand(`fog @s pop ${fogId} ${userProvidedId}`)
                .successCount > 0
        );
    }

    /**
     * Removes all fogs from the player's fog stack matching the specified user provided ID.
     * @param player The player to remove the fog from.
     * @param fogId The ID of the fog to remove.
     * @param userProvidedId The user-provided ID of the fog to remove.
     * @returns True if the fog was removed successfully, false otherwise.
     *
     * @remarks
     * This method uses the `fog` command and `remove` subcommand.
     */
    public static removeFog(
        player: Player,
        fogId: string,
        userProvidedId: string
    ): boolean {
        return (
            player.runCommand(`fog @s remove ${fogId} ${userProvidedId}`)
                .successCount > 0
        );
    }
}
