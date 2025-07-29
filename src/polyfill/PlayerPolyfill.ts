import { Entity, Player, Vector3 } from '@minecraft/server';
import { isVersion2 } from '../utils/VersionUtils';

/**
 * Applies an impulse to a player.
 * @param player The player to apply the impulse to.
 * @param vector The vector of the impulse.
 *
 * @author https://github.com/SIsilicon (https://github.com/JaylyDev/ScriptAPI/tree/main/scripts/player-impulse)
 */
// function applyImpulse(player: Player, vector: Vector3) {
//   const { x, y, z } = vector;
//   const horizontal = Math.sqrt(x * x + z * z) * 2.0;
//   const vertical = y < 0.0 ? 0.5 * y : y;
//   player.applyKnockback(x, z, horizontal, vertical);
// }

/**
 * New implementation of applyImpulse. This one tries to replicate the behavior of
 * the normal impulse as much as possible.
 * @param entity The entity to apply the impulse to.
 * @param vector The vector of the impulse.
 */
function applyImpulseNew(entity: Entity, vector: Vector3) {
    const { x, y, z } = vector;
    const previousVelocity = entity.getVelocity();

    // Calculate the norm (magnitude) of the horizontal components (x and z)
    const horizontalNorm = Math.sqrt(x * x + z * z);

    // Calculate directionX and directionZ as normalized values
    let directionX = 0;
    let directionZ = 0;
    if (horizontalNorm !== 0) {
        directionX = x / horizontalNorm;
        directionZ = z / horizontalNorm;
    }

    // The horizontalStrength is the horizontal norm of the input vector
    // multiplied by 2.5 based on experimentation
    const horizontalStrength = horizontalNorm * 2.5;

    // The vertical component is directly taken as verticalStrength
    // The previous velocity is also taken into account, because normal impulse retains
    // the previous velocity and knockback does not
    const verticalStrength = y + previousVelocity.y * 0.9;

    // Apply the knockback
    if (isVersion2(entity)) {
        (entity as any).applyKnockback(
            {
                x: horizontalStrength * directionX,
                z: horizontalStrength * directionZ,
            },
            verticalStrength
        );
    } else {
        (entity as any).applyKnockback(
            directionX,
            directionZ,
            horizontalStrength,
            verticalStrength
        );
    }
}

/**
 * Clears the velocity of an entity. This applies a knockback with the opposite
 * direction and the same strength as the current velocity in horizontal direction.
 * @param entity The entity to clear the velocity of.
 */
function clearVelocity(entity: Entity) {
    const { x, z } = entity.getVelocity();

    // Calculate the norm (magnitude) of the horizontal components (x and z)
    const horizontalNorm = Math.sqrt(x * x + z * z);

    // Calculate directionX and directionZ as normalized values
    let directionX = 0;
    let directionZ = 0;
    if (horizontalNorm !== 0) {
        directionX = -x / horizontalNorm;
        directionZ = -z / horizontalNorm;
    }

    // Apply the knockback
    if (isVersion2(entity)) {
        (entity as any).applyKnockback(
            {
                x: horizontalNorm * directionX,
                z: horizontalNorm * directionZ,
            },
            0
        );
    } else {
        (entity as any).applyKnockback(
            directionX,
            directionZ,
            horizontalNorm,
            0
        );
    }
}

export function install() {
    Player.prototype.applyImpulse = function (vector: Vector3) {
        applyImpulseNew(this, vector);
    };

    Player.prototype.clearVelocity = function () {
        clearVelocity(this);
    };
}
