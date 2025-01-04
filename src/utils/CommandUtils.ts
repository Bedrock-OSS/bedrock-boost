import { Dimension, InputPermissionCategory, Player, Vector3 } from "@minecraft/server";

export enum InputPermission {
  Movement = "movement",
  Camera = "camera"
}
export enum CameraShakeType {
  Positional = "positional",
  Rotational = "rotational",
}

/**
 * This is a collection of utility methods for working with commands until a proper API is available.
 * Once a proper API is available and stable, I'll change function to use that instead and mark it as deprecated.
 */
export default class CommandUtils {
  /**
   * Sets the input permission for a player.
   * @param player The player for whom to set the input permission.
   * @param permission The input permission to set.
   * @param value The value to set the input permission to.
   * 
   * @deprecated Use `player.inputPermissions.setPermissionCategory` instead.
   */
  public static setInputPermission(player: Player, permission: InputPermission, value: boolean): void {
    player.inputPermissions.setPermissionCategory(
      permission === InputPermission.Movement ?
        InputPermissionCategory.Movement : InputPermissionCategory.Camera,
      value
    );
  }
  /**
   * Adds camera shake effect to the specified player.
   * @param player - The player to apply the camera shake effect to.
   * @param type - The type of camera shake effect.
   * @param intensity - The intensity of the camera shake effect.
   * @param duration - The duration of the camera shake effect in seconds.
   */
  public static addCameraShake(player: Player, type: CameraShakeType, intensity: number, duration: number): void {
    player.runCommand(`camerashake add @s ${intensity.toFixed(20)} ${duration.toFixed(20)} ${type}`);
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
    dimension.runCommand(`setblock ${location.x} ${location.y} ${location.z} air destroy`);
  }
}