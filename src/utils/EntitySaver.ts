import { Dimension, Entity, StructureSaveMode, world } from '@minecraft/server';
import Vec3 from '../Vec3';
import { getDimensionHeightRange } from '../Cache';

export default class EntitySaver {
    /**
     * Saves an entity to the structure.
     * @param entity The entity to save.
     * @param prefix The prefix to use for the structure.
     * @param removeEntity Whether to remove the entity after saving.
     * @returns The ID of the structure without the prefix.
     */
    public static save(
        entity: Entity,
        prefix: string,
        removeEntity: boolean = true
    ): number {
        // Find a free ID
        let id = (Math.random() * 1000000 + 1) << 0;
        const structureManager = world.structureManager;
        let i = 0;
        while (structureManager.get(prefix + id)) {
            id = (Math.random() * 1000000 + 1) << 0;
            i++;
            if (i > 1000) {
                // Should NEVER happen
                throw new Error('Failed to find a free ID');
            }
        }
        const dimension = entity.dimension;
        const originalLocation = Vec3.from(entity.location);
        const location = originalLocation.setY(
            getDimensionHeightRange(dimension.id).min
        );
        // Teleport the entity to the bottom of the world for saving
        entity.teleport(location);
        // Tag the entity for easier identification
        entity.addTag(prefix + id);
        // Create a structure with only entities
        structureManager.createFromWorld(
            prefix + id,
            dimension,
            location,
            location,
            {
                includeBlocks: false,
                includeEntities: true,
                saveMode: StructureSaveMode.World,
            }
        );
        if (removeEntity) {
            // If the entity should be removed, remove it now
            entity.remove();
        } else {
            // Otherwise, teleport the entity back to its original location
            entity.teleport(originalLocation);
        }
        return id;
    }
    /**
     * Loads an entity from the structure.
     * @param id The ID of the structure without the prefix.
     * @param prefix The prefix used for the structure.
     * @param dimension The dimension to load the entity in.
     * @param location The location to load the entity at.
     * @param removeStructure Whether to remove the structure after loading.
     * @returns The loaded entity, or undefined if the entity was not found.
     */
    public static load(
        id: number,
        prefix: string,
        dimension: Dimension,
        location: Vec3,
        removeStructure: boolean = true
    ): Entity | undefined {
        const structureManager = world.structureManager;
        // Find the structure
        const structure = structureManager.get(prefix + id);
        if (!structure) {
            return undefined;
        }
        // Set place location at the bottom of the world
        const placeLocation = location.setY(
            getDimensionHeightRange(dimension.id).min
        );
        // Place the structure
        structureManager.place(structure, dimension, placeLocation, {
            includeBlocks: false,
            includeEntities: true,
        });
        // Find the entity
        const entities = dimension.getEntities({
            location: placeLocation,
            tags: [prefix + id],
            closest: 1,
        });
        if (entities.length === 0) {
            return undefined;
        }
        const entity = entities[0];
        // Clean tag id
        entity.removeTag(prefix + id);
        // Teleport the entity back to its original location
        entity.teleport(location);
        if (removeStructure) {
            // If the structure should be removed, remove it now
            structureManager.delete(prefix + id);
        }
        return entity;
    }
    /**
     * Removes all structures with the specified prefix.
     * @param prefix The prefix to remove.
     */
    public static clean(prefix: string) {
        const structureManager = world.structureManager;
        structureManager
            .getWorldStructureIds()
            .filter((id) => id.startsWith(prefix))
            .forEach((id) => {
                structureManager.delete(id);
            });
    }
}
