import { Player, Vector3 } from "@minecraft/server";

/**
 * Applies an impulse to a player.
 * @param player The player to apply the impulse to.
 * @param vector The vector of the impulse.
 * 
 * @author https://github.com/SIsilicon (https://github.com/JaylyDev/ScriptAPI/tree/main/scripts/player-impulse)
 */
function applyImpulse(player: Player, vector: Vector3) {
  const { x, y, z } = vector;
  const horizontal = Math.sqrt(x * x + z * z) * 2.0;
  const vertical = y < 0.0 ? 0.5 * y : y;
  player.applyKnockback(x, z, horizontal, vertical);
}

Player.prototype.applyImpulse = function (vector: Vector3) {
  applyImpulse(this, vector);
};