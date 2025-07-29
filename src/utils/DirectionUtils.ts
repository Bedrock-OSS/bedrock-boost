import { Direction } from '@minecraft/server';

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
    public static readonly PositivePerpendiculars: Record<
        Direction,
        Direction[]
    > = {
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
    public static readonly NegativePerpendiculars: Record<
        Direction,
        Direction[]
    > = {
        [Direction.Down]: [Direction.West, Direction.South],
        [Direction.Up]: [Direction.West, Direction.South],
        [Direction.North]: [Direction.West, Direction.Down],
        [Direction.South]: [Direction.West, Direction.Down],
        [Direction.East]: [Direction.South, Direction.Down],
        [Direction.West]: [Direction.South, Direction.Down],
    };

    /**
     * The clockwise perpendicular directions of the given directions.
     */
    public static readonly ClockwisePerpendiculars: Record<
        Direction,
        Direction
    > = {
        [Direction.North]: Direction.East,
        [Direction.East]: Direction.South,
        [Direction.South]: Direction.West,
        [Direction.West]: Direction.North,
        // Not sure what should be here
        [Direction.Up]: Direction.Down,
        [Direction.Down]: Direction.Up,
    };

    /**
     * The counter-clockwise perpendicular directions of the given directions.
     */
    public static readonly CounterClockwisePerpendiculars: Record<
        Direction,
        Direction
    > = {
        [Direction.North]: Direction.West,
        [Direction.East]: Direction.North,
        [Direction.South]: Direction.East,
        [Direction.West]: Direction.South,
        // Not sure what should be here
        [Direction.Up]: Direction.Down,
        [Direction.Down]: Direction.Up,
    };

    /**
     * The same axis directions of the given directions.
     */
    public static readonly SameAxis: Record<Direction, Direction> = {
        [Direction.North]: Direction.North,
        [Direction.South]: Direction.North,
        [Direction.East]: Direction.East,
        [Direction.West]: Direction.East,
        [Direction.Up]: Direction.Up,
        [Direction.Down]: Direction.Up,
    };

    /**
     * Directions by their string representation.
     */
    public static readonly FromString: Record<string, Direction> = {
        north: Direction.North,
        east: Direction.East,
        south: Direction.South,
        west: Direction.West,
        up: Direction.Up,
        down: Direction.Down,
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
