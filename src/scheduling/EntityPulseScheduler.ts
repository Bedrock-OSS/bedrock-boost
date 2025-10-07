import { Entity, EntityQueryOptions, system, world } from '@minecraft/server';
import PulseScheduler from './PulseScheduler';
import { Logger } from '../Logging';

/**
 * Represents a PulseScheduler that processes entities matching a query.
 */
export default class EntityPulseScheduler extends PulseScheduler<Entity> {
    private static readonly logger = Logger.getLogger(
        'EntityPulseScheduler',
        'bedrock-boost',
        'entity-pulse-scheduler'
    );
    private readonly filteredScratch: Entity[] = [];
    /**
     * Creates a new EntityPulseScheduler instance.
     * @param period The period of the scheduler.
     * @param queryOptions The query options to use when querying for entities.
     */
    constructor(
        processor: (t: Entity) => void,
        period: number,
        private queryOptions: EntityQueryOptions
    ) {
        super((t: Entity) => {
            if (t.isValid) {
                processor(t);
            } else {
                this.removeIf((entity) => !entity.isValid);
            }
        }, period);
        this.push(
            ...world
                .getDimension('minecraft:overworld')
                .getEntities(this.queryOptions)
        );
        this.push(
            ...world
                .getDimension('minecraft:nether')
                .getEntities(this.queryOptions)
        );
        this.push(
            ...world
                .getDimension('minecraft:the_end')
                .getEntities(this.queryOptions)
        );
    }

    private compareEntities(a: Entity, b: Entity): boolean {
        return a.id === b.id;
    }

    start(): void {
        world.afterEvents.entityLoad.subscribe((event) => {
            this.addIfMatchesWithRetry(event.entity);
        });
        world.afterEvents.entitySpawn.subscribe((event) => {
            this.addIfMatchesWithRetry(event.entity);
        });
        world.afterEvents.entityRemove.subscribe((event) => {
            this.removeIf(
                (entity) =>
                    !entity.isValid || entity.id === event.removedEntityId
            );
        });
        super.start();
    }

    /**
     * Adds an entity to the scheduler if it matches the query options. In case the entity is not valid, it will retry a tick later.
     * @param entity The entity to add.
     */
    private addIfMatchesWithRetry(entity: Entity): void {
        try {
            if (!entity) {
                return;
            }
            // Special case for when the entity is loaded from a structure and removed the same tick
            if (!entity.isValid) {
                const runId = system.runInterval(() => {
                    if (entity.isValid && entity.matches(this.queryOptions)) {
                        system.clearRun(runId);
                        this.push(entity);
                    }
                }, 1);
            } else if (entity.matches(this.queryOptions)) {
                this.push(entity);
            }
        } catch (e) {
            //TODO: Maybe it should be scheduled for reprocessing?
            EntityPulseScheduler.logger.debug(
                'Failed to push entity to scheduler.',
                e
            );
        }
    }

    push(...items: Entity[]): number {
        const filtered = this.filteredScratch;
        filtered.length = 0;
        for (const item of items) {
            if (!item.isValid) {
                continue;
            }
            let duplicate = false;
            for (const existingItem of this.items) {
                if (this.compareEntities(existingItem, item)) {
                    duplicate = true;
                    break;
                }
            }
            if (!duplicate) {
                filtered.push(item);
            }
        }
        const result = super.push(...filtered);
        filtered.length = 0;
        return result;
    }

    unshift(...items: Entity[]): number {
        const filtered = this.filteredScratch;
        filtered.length = 0;
        for (const item of items) {
            if (!item.isValid) {
                continue;
            }
            let duplicate = false;
            for (const existingItem of this.items) {
                if (this.compareEntities(existingItem, item)) {
                    duplicate = true;
                    break;
                }
            }
            if (!duplicate) {
                filtered.push(item);
            }
        }
        const result = super.unshift(...filtered);
        filtered.length = 0;
        return result;
    }

    splice(start: number, deleteCount?: number | undefined): Entity[];
    splice(start: number, deleteCount: number, ...items: Entity[]): Entity[];
    splice(start: number, deleteCount?: number, ...items: Entity[]): Entity[] {
        if (deleteCount === void 0) {
            return super.splice(start);
        }
        const filtered = this.filteredScratch;
        filtered.length = 0;
        for (const item of items) {
            let duplicate = false;
            for (const existingItem of this.items) {
                if (this.compareEntities(existingItem, item)) {
                    duplicate = true;
                    break;
                }
            }
            if (!duplicate) {
                filtered.push(item);
            }
        }
        const result = super.splice(start, deleteCount, ...filtered);
        filtered.length = 0;
        return result;
    }
}
