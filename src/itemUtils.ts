import { EquipmentSlot, Player } from "@minecraft/server";
import { Logger } from "./logging";

const log = Logger.getLogger("itemUtils", "bedrock-boost", "itemUtils");

/**
 * Consumes durability from the player's selected item.
 * @param player - The player whose item durability will be consumed.
 * @param value - The amount of durability to consume. Defaults to 1.
 * @param slot - The slot to consume durability from. Defaults to the player's selected slot.
 * @returns True if the durability was successfully consumed, false otherwise.
 */
export function consumeDurability(player: Player, value: number = 1, slot: EquipmentSlot = EquipmentSlot.Mainhand): boolean {
  if (value < 1 || !player) {
    log.error("Invalid value or player");
    return false;
  }
  const equippable = player.getComponent("minecraft:equippable");
  if (!equippable) {
    log.error("Player equippable component not found");
    return false;
  }
  const item = equippable.getEquipment(slot);
  if (!item) {
    log.debug("No item in selected slot");
    return false;
  }
  const durabilityComponent = item.getComponent("minecraft:durability");
  if (!durabilityComponent) {
    log.error("Item has no durability component");
    return false;
  }
  if (durabilityComponent.damage + value >= durabilityComponent.maxDurability) {
    log.trace("Item is broken");
    equippable.setEquipment(slot, undefined);
    return true;
  }
  durabilityComponent.damage = durabilityComponent.damage + value;
  log.trace(`Item durability is now ${durabilityComponent.damage}/${durabilityComponent.maxDurability}`);
  equippable.setEquipment(slot, item);
  return true;
}