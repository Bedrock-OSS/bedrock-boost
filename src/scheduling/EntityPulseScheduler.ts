import { Entity, EntityQueryOptions, MinecraftDimensionTypes, world } from "@minecraft/server";
import PulseScheduler from "./PulseScheduler";

/**
 * Represents a PulseScheduler that processes entities matching a query.
 */
export default class EntityPulseScheduler extends PulseScheduler<Entity> {

  /**
   * Creates a new EntityPulseScheduler instance.
   * @param period The period of the scheduler.
   * @param queryOptions The query options to use when querying for entities.
   */
  constructor(processor: (t: Entity) => void, period: number, private queryOptions: EntityQueryOptions) {
    super((t: Entity) => {
      if (t.isValid()) {
        processor(t);
      } else {
        this.removeIf((entity) => !entity.isValid());
      }
    }, period);
    this.push(...world.getDimension(MinecraftDimensionTypes.overworld).getEntities(this.queryOptions));
    this.push(...world.getDimension(MinecraftDimensionTypes.nether).getEntities(this.queryOptions));
    this.push(...world.getDimension(MinecraftDimensionTypes.theEnd).getEntities(this.queryOptions));
  }

  private compareEntities(a: Entity, b: Entity): boolean {
    return a.id === b.id;
  }

  start(): void {
    world.afterEvents.entityLoad.subscribe((event) => {
      if (event.entity.matches(this.queryOptions)) {
        this.push(event.entity);
      }
    });
    world.afterEvents.entitySpawn.subscribe((event) => {
      let matches;
      try {
        matches = event.entity.matches(this.queryOptions);
      } catch (e) {
        matches = false;
      }
      if (matches) {
        this.push(event.entity);
      }
    });
    world.afterEvents.entityRemove.subscribe((event) => {
      this.removeIf((entity) => !entity.isValid() || entity.id === event.removedEntityId);
    });
    super.start();
  }

  push(...items: Entity[]): number {
    const filtered = items.filter(item => item.isValid() && !this.items.some(existingItem => this.compareEntities(existingItem, item)));
    return super.push(...filtered);
  }

  unshift(...items: Entity[]): number {
    const filtered = items.filter(item => item.isValid() && !this.items.some(existingItem => this.compareEntities(existingItem, item)));
    return super.unshift(...filtered);
  }

  splice(start: number, deleteCount?: number | undefined): Entity[];
  splice(start: number, deleteCount: number, ...items: Entity[]): Entity[];
  splice(start: number, deleteCount?: number, ...items: Entity[]): Entity[] {
    if (deleteCount === void 0) {
      return super.splice(start);
    }
    const filtered = items.filter(item => !this.items.some(existingItem => this.compareEntities(existingItem, item)));
    return super.splice(start, deleteCount, ...filtered);
  }
}