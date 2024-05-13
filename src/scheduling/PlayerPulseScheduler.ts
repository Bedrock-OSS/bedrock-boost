import { Player, system, world } from "@minecraft/server";
import PulseScheduler from "./PulseScheduler";
import { Logger } from "../Logging";

const log = Logger.getLogger("PlayerPulseScheduler", "bedrock-boost", "player-pulse-scheduler");

/**
 * Represents a PulseScheduler that processes players.
 */
export default class PlayerPulseScheduler extends PulseScheduler<Player> {

  /**
   * Creates a new EntityPulseScheduler instance.
   * @param period The period of the scheduler.
   * @param queryOptions The query options to use when querying for entities.
   */
  constructor(processor: (t: Player) => void, period: number) {
    super((t: Player) => {
      if (t.isValid()) {
        processor(t);
      } else {
        this.removeIf((entity) => !entity.isValid());
      }
    }, period);
    this.push(...world.getAllPlayers());
  }

  private compareEntities(a: Player, b: Player): boolean {
    return a.id === b.id;
  }

  start(): void {
    world.afterEvents.playerJoin.subscribe((event) => {
      let attempts = 0;
      const pushPlayer = () => {
        attempts++;
        if (attempts > 10) {
          log.warn("Failed to push player to scheduler after 10 attempts.");
          return;
        }
        try {
          const player = world.getEntity(event.playerId);
          if (player === void 0) {
            system.runTimeout(pushPlayer, 1);
          }
          if (player instanceof Player) {
            this.push(player);
          }
        } catch (e) {
          log.debug("Failed to push player to scheduler.", e);
          system.runTimeout(pushPlayer, 1);
        }
      }
      pushPlayer();
    });
    world.afterEvents.playerLeave.subscribe((event) => {
      this.removeIf((entity) => !entity.isValid() || entity.id === event.playerId);
    });
    super.start();
  }

  push(...items: Player[]): number {
    const filtered = items.filter(item => item.isValid() && !this.items.some(existingItem => this.compareEntities(existingItem, item)));
    return super.push(...filtered);
  }

  unshift(...items: Player[]): number {
    const filtered = items.filter(item => item.isValid() && !this.items.some(existingItem => this.compareEntities(existingItem, item)));
    return super.unshift(...filtered);
  }

  splice(start: number, deleteCount?: number | undefined): Player[];
  splice(start: number, deleteCount: number, ...items: Player[]): Player[];
  splice(start: number, deleteCount?: number, ...items: Player[]): Player[] {
    if (deleteCount === void 0) {
      return super.splice(start);
    }
    const filtered = items.filter(item => !this.items.some(existingItem => this.compareEntities(existingItem, item)));
    return super.splice(start, deleteCount, ...filtered);
  }
}