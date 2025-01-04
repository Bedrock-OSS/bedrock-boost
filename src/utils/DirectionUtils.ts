import { Direction } from "@minecraft/server";

export default class DirectionUtils {
    /**
     * The opposite directions of the given directions.
     */
    public static readonly Opposites: Record<Direction, Direction> = {
        [Direction.Down]: Direction.Up,
        [Direction.Up]: Direction.Down,
        [Direction.North]: Direction.South,
        [Direction.South]: Direction.North,
        [Direction.East]: Direction.West,
        [Direction.West]: Direction.East,
    };

    /**
     * The positive perpendicular directions of the given directions.
     */
    public static readonly PositivePerpendiculars: Record<Direction, Direction[]> = {
        [Direction.Down]: [Direction.East, Direction.North],
        [Direction.Up]: [Direction.East, Direction.North],
        [Direction.North]: [Direction.East, Direction.Up],
        [Direction.South]: [Direction.East, Direction.Up],
        [Direction.East]: [Direction.North, Direction.Up],
        [Direction.West]: [Direction.North, Direction.Up],
    };

    /**
     * The negative perpendicular directions of the given directions.
     */
    public static readonly NegativePerpendiculars: Record<Direction, Direction[]> = {
        [Direction.Down]: [Direction.West, Direction.South],
        [Direction.Up]: [Direction.West, Direction.South],
        [Direction.North]: [Direction.West, Direction.Down],
        [Direction.South]: [Direction.West, Direction.Down],
        [Direction.East]: [Direction.South, Direction.Down],
        [Direction.West]: [Direction.South, Direction.Down],
    };

    /**
     * All directions.
     */
    public static readonly Values: Direction[] = [
        Direction.Down,
        Direction.Up,
        Direction.North,
        Direction.South,
        Direction.East,
        Direction.West,
    ];
}