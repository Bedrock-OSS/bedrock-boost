import { EntityEquippableComponent, EquipmentSlot, ItemDurabilityComponent, ItemEnchantableComponent, Player } from "@minecraft/server";
import { Logger } from "../Logging";

const log = Logger.getLogger("itemUtils", "bedrock-boost", "itemUtils");

export interface ConsumeDurabilityOptions {
  /**
   * Whether to ignore enchantments when consuming durability.
   */
  ignoreEnchantments?: boolean;
  /**
   * The amount of durability to consume. Defaults to 1.
   */
  value?: number;
  /**
   * The slot to consume durability from. Defaults to the player's main hand.
   */
  slot?: EquipmentSlot;
  /**
   * Whether to suppress playing a sound when item breaks. Defaults to "random.break". If set to an empty string, no sound will be played.
   */
  breakSound?: string;
}

export class ItemUtils {
  /**
   * Consumes durability from the player's selected item.
   * @param player - The player whose item durability will be consumed.
   * @param value - The amount of durability to consume. Defaults to 1.
   * @param slot - The slot to consume durability from. Defaults to the player's selected slot.
   * @returns True if the durability was consumed, false otherwise.
   * 
   * @remarks 
   * Return value `false` does not always mean that the function failed. It can also mean that the item was not damaged due to unbreaking enchantment.
   */
  public static consumeDurability(player: Player, options: ConsumeDurabilityOptions = {}): boolean {
    if (options.value === void 0) {
      options.value = 1;
    }
    if (options.slot === void 0) {
      options.slot = EquipmentSlot.Mainhand;
    }
    if (options.breakSound === void 0) {
      options.breakSound = 'random.break';
    }
    if (options.value < 1 || !player) {
      log.error("Invalid value or player");
      return false;
    }
    const equippable = player.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent;
    if (!equippable) {
      log.error("Player equippable component not found");
      return false;
    }
    const item = equippable.getEquipment(options.slot);
    if (!item) {
      log.debug("No item in selected slot");
      return false;
    }
    const durabilityComponent = item.getComponent(ItemDurabilityComponent.componentId) as ItemDurabilityComponent;
    if (!durabilityComponent) {
      log.error("Item has no durability component");
      return false;
    }
    if (!options.ignoreEnchantments) {
      const enchantable = item.getComponent(ItemEnchantableComponent.componentId) as ItemEnchantableComponent;
      if (enchantable) {
        const unbreakingLevel = enchantable.getEnchantment('unbreaking')?.level ?? 0;
        if (ItemUtils.getUnbreakingChance(unbreakingLevel) < Math.random()) {
          return false;
        }
      }
    }
    if (durabilityComponent.damage + options.value >= durabilityComponent.maxDurability) {
      log.trace("Item is broken");
      equippable.setEquipment(options.slot, undefined);
      if (options.breakSound.length > 0) {
        player.playSound(options.breakSound);
      }
      return true;
    }
    durabilityComponent.damage = durabilityComponent.damage + options.value;
    log.trace(`Item durability is now ${durabilityComponent.damage}/${durabilityComponent.maxDurability}`);
    equippable.setEquipment(options.slot, item);
    return true;
  }
  /**
   * Returns the chance to consume durability from item based on the unbreaking level.
   * @param unbreakingLevel - The unbreaking level of the item.
   * @returns The chance to consume durability from item based on the unbreaking level.
   */
  public static getUnbreakingChance(unbreakingLevel: number) {
    if (unbreakingLevel === 0) {
      return 1;
    }
    return 1 / (unbreakingLevel + 1);
  }
}

/**
 * Consumes durability from the player's selected item.
 * @param player - The player whose item durability will be consumed.
 * @param value - The amount of durability to consume. Defaults to 1.
 * @param slot - The slot to consume durability from. Defaults to the player's selected slot.
 * @returns True if the durability was successfully consumed, false otherwise.
 * 
 * @deprecated Use `ItemUtils.consumeDurability` instead.
 */
export function consumeDurability(player: Player, value: number = 1, slot: EquipmentSlot = EquipmentSlot.Mainhand): boolean {
  return ItemUtils.consumeDurability(player, {
    slot,
    value,
    ignoreEnchantments: true,
    breakSound: '',
  });
}