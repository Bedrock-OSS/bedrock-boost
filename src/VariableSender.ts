import { Entity, Player, system } from "@minecraft/server";

/**
 * Represents a Molang expression. This will be injected into the variable value as Molang expression.
 */
export type MolangExpression = {
  /**
   * The Molang expression to inject.
   */
  value: string
};

/**
 * Represents a Molang value. This can be a number, boolean, or Molang expression.
 */
export type MolangValue = number | boolean | MolangExpression;

/**
 * Sends Molang variables to an entity using `playanimation` command.
 * @param entity The entity to send the data to.
 * @param animation The RP animation to send the data through.
 * @param data The data to send.
 * @param receivers Players to send the data to. If not specified, the data will be sent to all players.
 */
export function sendMolangData(entity: Entity, animation: string, data: { [key: string]: MolangValue }, receivers: Player[] = []) {
  data['v.__time__'] = system.currentTick;
  data['v.__random__'] = (Math.random() * 1000) << 0;
  const stopExpression = Object.entries(data).map(([key, value]) => {
    if (typeof value === "number") {
      return `${key}=${value}`;
    } else if (typeof value === "boolean") {
      return `${key}=${value ? 1 : 0}`;
    } else {
      return `${key}=${value.value}`;
    }
  }).join(";") + ";return 0;";
  entity.playAnimation(animation, {
    stopExpression: stopExpression,
    controller: "__" + animation + "_send_data__",
    players: receivers.length ? receivers.map(player => player.name) : undefined
  });
}