//#region Types & error helpers

type Path = (string | number)[];

/**
 * Machine-readable error codes produced by schema validation.
 *
 * @remarks Each member maps to a stable numeric identifier so consumers can
 * branch on validation failures without brittle string matching.
 */
export enum ValidationIssueCode {
    /** Value was required but missing or `undefined`. */
    Required = 1,
    /** Encountered `null` where a string was expected. */
    StringNull = 2,
    /** Encountered a non-string value. */
    StringType = 3,
    /** String must not be empty. */
    StringEmpty = 4,
    /** String length fell below the configured minimum. */
    StringTooShort = 5,
    /** String length exceeded the configured maximum. */
    StringTooLong = 6,
    /** String failed to match the configured regular expression. */
    StringRegexMismatch = 7,
    /** Encountered `null` where a number was expected. */
    NumberNull = 8,
    /** Encountered a non-number value or NaN. */
    NumberType = 9,
    /** Expected an integer but received a fractional value. */
    NumberNotInteger = 10,
    /** Number fell below an inclusive minimum. */
    NumberTooSmall = 11,
    /** Number failed to satisfy a strict greater-than comparison. */
    NumberTooSmallExclusive = 12,
    /** Number exceeded an inclusive maximum. */
    NumberTooLarge = 13,
    /** Number failed to satisfy a strict less-than comparison. */
    NumberTooLargeExclusive = 14,
    /** Encountered `null` where a boolean was expected. */
    BooleanNull = 15,
    /** Encountered a non-boolean value. */
    BooleanType = 16,
    /** Value did not match the expected literal. */
    LiteralMismatch = 17,
    /** Encountered `null` where an enum value was expected. */
    EnumNull = 18,
    /** Value was not one of the allowed enum options. */
    EnumMismatch = 19,
    /** Encountered `null` where an array was expected. */
    ArrayNull = 20,
    /** Encountered a non-array value. */
    ArrayType = 21,
    /** Array length failed to match an exact requirement. */
    ArrayExactLengthMismatch = 22,
    /** Array length fell below the configured minimum. */
    ArrayTooShort = 23,
    /** Array length exceeded the configured maximum. */
    ArrayTooLong = 24,
    /** Encountered `null` where a tuple was expected. */
    TupleNull = 25,
    /** Encountered a non-array value where a tuple was expected. */
    TupleType = 26,
    /** Tuple length did not match its schema definition. */
    TupleLengthMismatch = 27,
    /** Encountered `null` where no union option permits it. */
    UnexpectedNull = 28,
    /** No union option accepted the provided value. */
    UnionNoMatch = 29,
    /** Encountered `null` where an object was expected. */
    ObjectNull = 30,
    /** Encountered a non-object value. */
    ObjectType = 31,
    /** Object contained a property that is not allowed. */
    ObjectUnknownKey = 32,
    /** Custom refinement predicate returned false. */
    RefinementFailed = 33,
}

export type ValidationIssue = {
    path: string; // e.g. $.player.location.x
    message: string;
    code: ValidationIssueCode;
};

/**
 * Aggregated validation failure produced by {@link Schema.parse}.
 *
 * @public
 */
export class ValidationError extends Error {
    /**
     * Creates a new validation error that exposes all collected issues.
     *
     * @param issues - Structured report for each failed path.
     */
    constructor(public issues: ValidationIssue[]) {
        super(issues.map((i) => `${i.path}: ${i.message}`).join('\n'));
        this.name = 'ValidationError';
    }
}

export type SafeParseSuccess<T> = { success: true; data: T };
export type SafeParseFailure = { success: false; errors: ValidationIssue[] };
export type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseFailure;

/**
 * Converts a validation path into a human-readable string for error reporting.
 *
 * @param path - Sequence of object keys and array indices describing location.
 * @returns Path string using JSONPath-like formatting (e.g. `$.foo[0]`).
 */
function pathToString(path: Path): string {
    if (path.length === 0) return '$';
    let s = '$';
    for (const p of path) s += typeof p === 'number' ? `[${p}]` : `.${p}`;
    return s;
}

//#region Public Schema interface

/**
 * Type-safe runtime validator and transformer for a value of type {@link T}.
 *
 * @public
 */
export interface Schema<T> {
    /**
     * Validates and returns a value when all schema constraints pass.
     *
     * @param value - Raw input to validate.
     * @returns The parsed value if validation succeeds.
     * @throws ValidationError Thrown when validation fails.
     */
    parse(value: unknown): T;
    /**
     * Validates the value in place, throwing if it does not satisfy the schema.
     *
     * @param value - Raw input to validate.
     * @throws ValidationError Thrown when validation fails.
     */
    assert(value: unknown): asserts value is T;
    /**
     * Attempts to parse a value without throwing.
     *
     * @param value - Raw input to validate.
     * @returns Success with parsed data or failure with validation issues.
     */
    safeParse(value: unknown): SafeParseResult<T>;

    /**
     * Allows `undefined` in addition to the current schema.
     *
     * @returns A schema permitting `undefined`.
     */
    optional(): Schema<T | undefined>;
    /**
     * Removes `undefined` from the accepted set of values.
     *
     * @returns The current schema with `undefined` disallowed.
     */
    required(): this;
    /**
     * Allows `null` in addition to the current schema.
     *
     * @returns A schema permitting `null`.
     */
    nullable(): Schema<T | null>;
    /**
     * Adds a custom predicate to refine acceptable values.
     *
     * @param pred - Predicate returning `true` when the value is valid.
     * @param message - Human friendly description shown on failure.
     * @param code - Optional machine readable identifier for the failure.
     * @returns A schema reflecting the additional refinement.
     */
    refine(
        pred: (v: T) => boolean,
        message: string,
        code?: ValidationIssueCode
    ): Schema<T>;
}

//#region Base schema (mutating)

/**
 * Provides default behaviour for schema refinements, optionality, and parsing.
 */
abstract class BaseSchema<T> implements Schema<T> {
    protected _refinements: Array<{
        pred: (v: T) => boolean;
        message: string;
        code?: ValidationIssueCode;
    }> = [];
    protected _isOptional = false;
    protected _isNullable = false;

    /**
     * Marks the schema as accepting `undefined` values without cloning.
     *
     * @returns The current schema configured to allow `undefined`.
     */
    optional(): Schema<T | undefined> {
        this._isOptional = true;
        return this as unknown as Schema<T | undefined>;
    }
    /**
     * Marks the schema as disallowing `undefined` values.
     *
     * @returns The current schema with optional flag cleared.
     */
    required(): this {
        this._isOptional = false;
        return this;
    }
    /**
     * Marks the schema as accepting `null` values without cloning.
     *
     * @returns The current schema configured to allow `null`.
     */
    nullable(): Schema<T | null> {
        this._isNullable = true;
        return this as unknown as Schema<T | null>;
    }
    /**
     * Appends a refinement predicate that runs after core validation succeeds.
     *
     * @param pred - Predicate invoked with the parsed value.
     * @param message - Error message used when the predicate fails.
     * @param code - Optional issue code to classify the refinement failure.
     * @returns The current schema with the refinement registered.
     */
    refine(
        pred: (v: T) => boolean,
        message: string,
        code?: ValidationIssueCode
    ): Schema<T> {
        this._refinements.push({ pred, message, code });
        return this;
    }

    /**
     * Ensures the provided value satisfies the schema, throwing on failure.
     *
     * @param value - Value to validate.
     * @throws ValidationError When validation fails.
     */
    assert(value: unknown): asserts value is T {
        this.parse(value);
    }

    /**
     * Attempts to parse a value and capture failures without throwing.
     *
     * @param value - Value to validate.
     * @returns Success with the parsed value or failure with collected issues.
     */
    safeParse(value: unknown): SafeParseResult<T> {
        try {
            return { success: true, data: this.parse(value) };
        } catch (e) {
            if (e instanceof ValidationError)
                return { success: false, errors: e.issues };
            throw e;
        }
    }

    /**
     * Parses a value using the schema and executes refinements on success.
     *
     * @param value - Value to validate.
     * @returns The parsed value when validation succeeds.
     * @throws ValidationError When validation or refinement fails.
     */
    parse(value: unknown): T {
        const issues: ValidationIssue[] = [];
        const out = this._validate(
            value,
            [],
            issues,
            this._isOptional,
            this._isNullable
        );
        if (issues.length) throw new ValidationError(issues);
        if (out !== undefined && out !== null) {
            for (const r of this._refinements) {
                if (!r.pred(out as T)) {
                    throw new ValidationError([
                        {
                            path: '$',
                            message: r.message,
                            code:
                                r.code ?? ValidationIssueCode.RefinementFailed,
                        },
                    ]);
                }
            }
        }
        return out as T;
    }

    /**
     * Call a child schema's internal validator without protected-access errors.
     *
     * @param schema - Child schema to delegate to.
     * @param value - Value to validate.
     * @param path - Current traversal path.
     * @param issues - Mutable issue collection shared across validations.
     * @returns Result produced by the child schema.
     */
    protected _validateChild<U>(
        schema: Schema<U>,
        value: unknown,
        path: Path,
        issues: ValidationIssue[]
    ): U | undefined | null {
        const s = schema as BaseSchema<U>;
        return s._validate(value, path, issues, s._isOptional, s._isNullable);
    }

    /**
     * Core validation hook implemented by concrete schema types.
     *
     * @param value - Value to validate.
     * @param path - Current traversal path.
     * @param issues - Mutable issue collection shared across validations.
     * @param optional - Whether `undefined` should be accepted.
     * @param nullable - Whether `null` should be accepted.
     */
    protected abstract _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        nullable: boolean
    ): T | undefined | null;

    /**
     * Records a validation issue with a positional path and machine code.
     *
     * @param issues - Aggregate issue collection to append to.
     * @param path - Traversal path where the issue occurred.
     * @param message - Human readable explanation of the failure.
     * @param code - Machine readable classification of the failure.
     */
    protected issue(
        issues: ValidationIssue[],
        path: Path,
        message: string,
        code: ValidationIssueCode
    ) {
        issues.push({ path: pathToString(path), message, code });
    }
}

//#region Primitive schemas

class StringSchema extends BaseSchema<string> {
    private _min?: number;
    private _max?: number;
    private _regex?: RegExp;
    private _nonEmpty = false;

    /**
     * Requires strings to have a length greater than or equal to the given number.
     *
     * @param n - Minimum length permitted.
     * @returns The current schema with the constraint applied.
     */
    min(n: number) {
        this._min = n;
        return this;
    }
    /**
     * Requires strings to have a length less than or equal to the given number.
     *
     * @param n - Maximum length permitted.
     * @returns The current schema with the constraint applied.
     */
    max(n: number) {
        this._max = n;
        return this;
    }
    /**
     * Requires strings to match a specific regular expression.
     *
     * @param r - Regular expression the value must satisfy.
     * @returns The current schema with the constraint applied.
     */
    regex(r: RegExp) {
        this._regex = r;
        return this;
    }
    /**
     * Disallows empty strings.
     *
     * @returns The current schema with the constraint applied.
     */
    notEmpty() {
        this._nonEmpty = true;
        return this;
    }

    /**
     * Validates a candidate string value against configured constraints.
     *
     * @inheritdoc
     */
    protected _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        nullable: boolean
    ) {
        if (value === undefined) {
            if (optional) return undefined as any;
            this.issue(issues, path, 'Required', ValidationIssueCode.Required);
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(
                issues,
                path,
                'Expected string, got null',
                ValidationIssueCode.StringNull
            );
            return undefined as any;
        }
        if (typeof value !== 'string') {
            this.issue(
                issues,
                path,
                `Expected string, got ${typeof value}`,
                ValidationIssueCode.StringType
            );
            return undefined as any;
        }
        if (this._nonEmpty && value.length === 0)
            this.issue(
                issues,
                path,
                'String must not be empty',
                ValidationIssueCode.StringEmpty
            );
        if (this._min !== undefined && value.length < this._min)
            this.issue(
                issues,
                path,
                `String length < ${this._min}`,
                ValidationIssueCode.StringTooShort
            );
        if (this._max !== undefined && value.length > this._max)
            this.issue(
                issues,
                path,
                `String length > ${this._max}`,
                ValidationIssueCode.StringTooLong
            );
        if (this._regex && !this._regex.test(value))
            this.issue(
                issues,
                path,
                `String does not match ${this._regex}`,
                ValidationIssueCode.StringRegexMismatch
            );
        return value;
    }
}

class NumberSchema extends BaseSchema<number> {
    private _int = false;
    private _min?: number;
    private _max?: number;
    private _gt?: number;
    private _lt?: number;

    /**
     * Restricts numbers to integers.
     *
     * @returns The current schema with the constraint applied.
     */
    int() {
        this._int = true;
        return this;
    }
    /**
     * Requires numbers to be greater than or equal to the provided minimum.
     *
     * @param n - Minimum inclusive value.
     * @returns The current schema with the constraint applied.
     */
    min(n: number) {
        this._min = n;
        return this;
    }
    /**
     * Requires numbers to be less than or equal to the provided maximum.
     *
     * @param n - Maximum inclusive value.
     * @returns The current schema with the constraint applied.
     */
    max(n: number) {
        this._max = n;
        return this;
    }
    /**
     * Requires numbers to be strictly greater than the provided bound.
     *
     * @param n - Exclusive lower bound.
     * @returns The current schema with the constraint applied.
     */
    gt(n: number) {
        this._gt = n;
        return this;
    }
    /**
     * Requires numbers to be strictly less than the provided bound.
     *
     * @param n - Exclusive upper bound.
     * @returns The current schema with the constraint applied.
     */
    lt(n: number) {
        this._lt = n;
        return this;
    }
    /**
     * Convenience helper for values greater than or equal to zero.
     *
     * @returns The current schema with the constraint applied.
     */
    nonNegative() {
        return this.min(0);
    }
    /**
     * Convenience helper for values strictly greater than zero.
     *
     * @returns The current schema with the constraint applied.
     */
    positive() {
        return this.gt(0);
    }

    /**
     * Validates a numeric candidate against configured constraints.
     *
     * @inheritdoc
     */
    protected _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        nullable: boolean
    ) {
        if (value === undefined) {
            if (optional) return undefined as any;
            this.issue(issues, path, 'Required', ValidationIssueCode.Required);
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(
                issues,
                path,
                'Expected number, got null',
                ValidationIssueCode.NumberNull
            );
            return undefined as any;
        }
        if (typeof value !== 'number' || Number.isNaN(value)) {
            this.issue(
                issues,
                path,
                `Expected number, got ${typeof value}`,
                ValidationIssueCode.NumberType
            );
            return undefined as any;
        }
        if (this._int && !Number.isInteger(value))
            this.issue(
                issues,
                path,
                'Expected integer',
                ValidationIssueCode.NumberNotInteger
            );
        if (this._min !== undefined && value < this._min)
            this.issue(
                issues,
                path,
                `Number < ${this._min}`,
                ValidationIssueCode.NumberTooSmall
            );
        if (this._gt !== undefined && !(value > this._gt))
            this.issue(
                issues,
                path,
                `Number must be > ${this._gt}`,
                ValidationIssueCode.NumberTooSmallExclusive
            );
        if (this._max !== undefined && value > this._max)
            this.issue(
                issues,
                path,
                `Number > ${this._max}`,
                ValidationIssueCode.NumberTooLarge
            );
        if (this._lt !== undefined && !(value < this._lt))
            this.issue(
                issues,
                path,
                `Number must be < ${this._lt}`,
                ValidationIssueCode.NumberTooLargeExclusive
            );
        return value;
    }
}

class BooleanSchema extends BaseSchema<boolean> {
    /**
     * Validates that a value is a boolean while respecting optional/nullable flags.
     *
     * @inheritdoc
     */
    protected _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        nullable: boolean
    ) {
        if (value === undefined) {
            if (optional) return undefined as any;
            this.issue(issues, path, 'Required', ValidationIssueCode.Required);
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(
                issues,
                path,
                'Expected boolean, got null',
                ValidationIssueCode.BooleanNull
            );
            return undefined as any;
        }
        if (typeof value !== 'boolean') {
            this.issue(
                issues,
                path,
                `Expected boolean, got ${typeof value}`,
                ValidationIssueCode.BooleanType
            );
            return undefined as any;
        }
        return value;
    }
}

class LiteralSchema<
    V extends string | number | boolean | null,
> extends BaseSchema<V> {
    /**
     * @param _value - Literal value the schema must match.
     */
    constructor(private _value: V) {
        super();
    }
    /**
     * Validates that an input exactly matches the configured literal.
     *
     * @inheritdoc
     */
    protected _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        //LiteralSchema can only be null if the literal is null
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        nullable: boolean
    ) {
        if (value === undefined) {
            if (optional) return undefined as any;
            this.issue(issues, path, 'Required', ValidationIssueCode.Required);
            return undefined as any;
        }
        if (this._value === null) {
            if (value !== null) {
                this.issue(
                    issues,
                    path,
                    `Expected literal ${JSON.stringify(this._value)}`,
                    ValidationIssueCode.LiteralMismatch
                );
                return undefined as any;
            }
            return null as any;
        }
        if (value !== this._value) {
            this.issue(
                issues,
                path,
                `Expected literal ${JSON.stringify(this._value)}`,
                ValidationIssueCode.LiteralMismatch
            );
            return undefined as any;
        }
        return value as V;
    }
}

class EnumSchema<T extends string | number> extends BaseSchema<T> {
    private _set: Set<T>;
    /**
     * @param values - Collection of allowed enum values.
     */
    constructor(values: readonly T[]) {
        super();
        this._set = new Set(values);
    }
    /**
     * Validates that an input belongs to the configured enum set.
     *
     * @inheritdoc
     */
    protected _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        nullable: boolean
    ) {
        if (value === undefined) {
            if (optional) return undefined as any;
            this.issue(issues, path, 'Required', ValidationIssueCode.Required);
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(
                issues,
                path,
                'Expected enum value, got null',
                ValidationIssueCode.EnumNull
            );
            return undefined as any;
        }
        if (!this._set.has(value as any)) {
            this.issue(
                issues,
                path,
                `Expected one of ${[...this._set].map(String).join(', ')}`,
                ValidationIssueCode.EnumMismatch
            );
            return undefined as any;
        }
        return value as T;
    }
}

//#region Composite schemas

class ArraySchema<T> extends BaseSchema<T[]> {
    private _min?: number;
    private _max?: number;
    private _exact?: number;

    /**
     * @param element - Schema used to validate each array element.
     */
    constructor(private element: Schema<T>) {
        super();
    }

    /**
     * Requires arrays to have at least the given number of elements.
     *
     * @param n - Minimum length permitted.
     * @returns The current schema with the constraint applied.
     */
    min(n: number) {
        this._min = n;
        return this;
    }
    /**
     * Requires arrays to have at most the given number of elements.
     *
     * @param n - Maximum length permitted.
     * @returns The current schema with the constraint applied.
     */
    max(n: number) {
        this._max = n;
        return this;
    }
    /**
     * Requires arrays to have an exact length.
     *
     * @param n - Exact size the array must match.
     * @returns The current schema with the constraint applied.
     */
    size(n: number) {
        this._exact = n;
        return this;
    } // exact length

    /**
     * Validates array structure and each element against configured constraints.
     *
     * @inheritdoc
     */
    protected _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        nullable: boolean
    ) {
        if (value === undefined) {
            if (optional) return undefined as any;
            this.issue(issues, path, 'Required', ValidationIssueCode.Required);
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(
                issues,
                path,
                'Expected array, got null',
                ValidationIssueCode.ArrayNull
            );
            return undefined as any;
        }
        if (!Array.isArray(value)) {
            this.issue(
                issues,
                path,
                'Expected array',
                ValidationIssueCode.ArrayType
            );
            return undefined as any;
        }

        const arr = value;
        if (this._exact !== undefined && arr.length !== this._exact)
            this.issue(
                issues,
                path,
                `Array length must be ${this._exact}`,
                ValidationIssueCode.ArrayExactLengthMismatch
            );
        if (this._min !== undefined && arr.length < this._min)
            this.issue(
                issues,
                path,
                `Array length < ${this._min}`,
                ValidationIssueCode.ArrayTooShort
            );
        if (this._max !== undefined && arr.length > this._max)
            this.issue(
                issues,
                path,
                `Array length > ${this._max}`,
                ValidationIssueCode.ArrayTooLong
            );

        const out: T[] = new Array(arr.length);
        for (let i = 0; i < arr.length; i++) {
            path.push(i);
            const r = this._validateChild(this.element, arr[i], path, issues);
            path.pop();
            out[i] = r as T;
        }
        return out;
    }
}

class TupleSchema<T extends any[]> extends BaseSchema<T> {
    /**
     * @param elements - Ordered list of schemas for each tuple index.
     */
    constructor(private elements: { [K in keyof T]: Schema<T[K]> }) {
        super();
    }

    /**
     * Validates tuple length and delegates element validation to child schemas.
     *
     * @inheritdoc
     */
    protected _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        nullable: boolean
    ) {
        if (value === undefined) {
            if (optional) return undefined as any;
            this.issue(issues, path, 'Required', ValidationIssueCode.Required);
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(
                issues,
                path,
                'Expected tuple, got null',
                ValidationIssueCode.TupleNull
            );
            return undefined as any;
        }
        if (!Array.isArray(value)) {
            this.issue(
                issues,
                path,
                'Expected tuple (array)',
                ValidationIssueCode.TupleType
            );
            return undefined as any;
        }
        if (value.length !== this.elements.length)
            this.issue(
                issues,
                path,
                `Tuple length must be ${this.elements.length}`,
                ValidationIssueCode.TupleLengthMismatch
            );

        const out: any[] = new Array(this.elements.length);
        for (let i = 0; i < this.elements.length; i++) {
            path.push(i);
            const r = this._validateChild(
                this.elements[i],
                value[i],
                path,
                issues
            );
            path.pop();
            out[i] = r;
        }
        return out as T;
    }
}

class UnionSchema<T> extends BaseSchema<T> {
    /**
     * @param options - Collection of schemas representing union variants.
     */
    constructor(private options: Schema<any>[]) {
        super();
    }

    /**
     * Validates that the value matches at least one union variant.
     *
     * @inheritdoc
     */
    protected _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        nullable: boolean
    ) {
        if (value === undefined) {
            if (optional) return undefined as any;
            this.issue(issues, path, 'Required', ValidationIssueCode.Required);
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(
                issues,
                path,
                'Unexpected null',
                ValidationIssueCode.UnexpectedNull
            );
            return undefined as any;
        }

        const subIssues: ValidationIssue[][] = [];
        for (const opt of this.options) {
            const optIssues: ValidationIssue[] = [];
            const r = this._validateChild(opt, value, path, optIssues);
            if (optIssues.length === 0) return r as T;
            subIssues.push(optIssues);
        }
        const msgs = subIssues
            .slice(0, 3)
            .flat()
            .map((i) => i.message)
            .join(' | ');
        this.issue(
            issues,
            path,
            `No union variant matched: ${msgs}`,
            ValidationIssueCode.UnionNoMatch
        );
        return undefined as any;
    }
}

//#region Object schema & builder

type PropSpec = { schema: Schema<any> };
type PropsRecord = Record<string, PropSpec>;
type InferSchema<S> = S extends Schema<infer T> ? T : never;
type InferProps<P extends PropsRecord> = {
    [K in keyof P]: InferSchema<P[K]['schema']>;
};

class ObjectSchema<
    P extends PropsRecord,
    Out extends object,
> extends BaseSchema<Out> {
    /**
     * @param name - Optional descriptive name for error messages.
     * @param props - Map of property schemas defining the object shape.
     * @param _allowUnknown - Whether properties outside `props` are preserved.
     */
    constructor(
        private name: string | undefined,
        private props: P,
        private _allowUnknown = false
    ) {
        super();
    }

    /**
     * Validates object structure, known properties, and unknown-key policy.
     *
     * @inheritdoc
     */
    protected _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        nullable: boolean
    ): Out {
        if (value === undefined) {
            if (optional) return undefined as any;
            this.issue(issues, path, 'Required', ValidationIssueCode.Required);
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(
                issues,
                path,
                'Expected object, got null',
                ValidationIssueCode.ObjectNull
            );
            return undefined as any;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            this.issue(
                issues,
                path,
                'Expected object',
                ValidationIssueCode.ObjectType
            );
            return undefined as any;
        }

        const v = value as Record<string, unknown>;
        const out: any = {};

        // known props
        for (const key in this.props) {
            path.push(key);
            const schema = this.props[key].schema;
            const r = this._validateChild(schema, v[key], path, issues);
            path.pop();
            if (r !== undefined) out[key] = r;
            else if (Object.prototype.hasOwnProperty.call(v, key)) out[key] = r; // preserve explicit undefined
        }

        // unknown keys handling
        if (!this._allowUnknown) {
            for (const k in v) {
                if (!(k in this.props)) {
                    path.push(k);
                    this.issue(
                        issues,
                        path,
                        'Unknown property',
                        ValidationIssueCode.ObjectUnknownKey
                    );
                    path.pop();
                }
            }
        } else {
            for (const k in v) if (!(k in this.props)) out[k] = v[k];
        }

        return out;
    }
}

/**
 * Fluent object schema builder that produces {@link Schema} instances.
 *
 * @public
 */
export class ObjectBuilder<P extends PropsRecord> {
    private _allowUnknown = false;
    constructor(
        private name: string | undefined,
        private props: P
    ) {}

    /**
     * Adds a property schema to the current builder.
     *
     * @typeParam K - Property name being added.
     * @typeParam S - Schema that validates the property.
     * @param key - Object key to associate with the schema.
     * @param schema - Schema that validates the property value.
     * @returns The builder with an updated type signature.
     */
    property<K extends string, S extends Schema<any>>(
        key: K,
        schema: S
    ): ObjectBuilder<P & { [Q in K]: { schema: S } }> {
        (this.props as any)[key] = { schema };
        return this as unknown as ObjectBuilder<
            P & { [Q in K]: { schema: S } }
        >;
    }

    /**
     * Permits keys not explicitly defined in the builder.
     *
     * @returns The current builder with unknown-key support enabled.
     */
    allowUnknown(): this {
        this._allowUnknown = true;
        return this;
    }

    /**
     * Finalises and freezes the builder into an object schema.
     *
     * @returns An immutable schema that validates the configured shape.
     */
    build(): ObjectSchema<P, InferProps<P>> {
        const frozen = Object.freeze({ ...(this.props as any) }) as P;
        return new ObjectSchema<P, InferProps<P>>(
            this.name,
            frozen,
            this._allowUnknown
        );
    }

    /**
     * Convenience wrapper that returns the built schema directly.
     *
     * @returns A schema equivalent to the result of {@link build}.
     */
    asSchema(): Schema<InferProps<P>> {
        return this.build();
    }
}

//#region Factory (public API)

/**
 * Factory helpers for constructing common {@link Schema} variants.
 *
 * @public
 */
export const TypeBuilder = {
    // primitives
    /**
     * Creates a schema that validates string values.
     *
     * @returns A string schema.
     */
    string: () => new StringSchema(),
    /**
     * Creates a schema that validates numeric values.
     *
     * @returns A number schema.
     */
    number: () => new NumberSchema(),
    /**
     * Creates a schema that validates boolean values.
     *
     * @returns A boolean schema.
     */
    boolean: () => new BooleanSchema(),
    /**
     * Creates a schema that accepts a single literal value.
     *
     * @typeParam V - Literal value type.
     * @param v - Literal value the schema must match.
     * @returns A literal schema.
     */
    literal: <V extends string | number | boolean | null>(v: V) =>
        new LiteralSchema(v),
    /**
     * Creates a schema that validates members of an enum-like collection.
     *
     * @typeParam T - Enumeration member type.
     * @param values - Allowed values for the enum.
     * @returns An enum schema.
     */
    enum: <T extends string | number>(values: readonly T[]) =>
        new EnumSchema(values),

    // arrays & tuples
    /**
     * Creates a schema that validates arrays of another schema.
     *
     * @typeParam T - Element type validated by `elem`.
     * @param elem - Schema for each array element.
     * @returns An array schema.
     */
    array: <T>(elem: Schema<T>) => new ArraySchema(elem),
    /**
     * Creates a schema that validates tuples with positional schemas.
     *
     * @typeParam T - Tuple element types.
     * @param elements - Schema for each tuple member.
     * @returns A tuple schema.
     */
    tuple: <T extends any[]>(...elements: { [K in keyof T]: Schema<T[K]> }) =>
        new TupleSchema<T>(elements as any),

    // unions
    /**
     * Creates a schema that accepts one of two possible shapes.
     *
     * @typeParam A - First schema type.
     * @typeParam B - Second schema type.
     * @param a - Schema for the first option.
     * @param b - Schema for the second option.
     * @returns A union schema covering both input schemas.
     */
    union: <A, B>(a: Schema<A>, b: Schema<B>): Schema<A | B> =>
        new UnionSchema<any>([a, b]),
    /**
     * Creates a schema that accepts any of the provided options.
     *
     * @typeParam T - Tuple of schema types.
     * @param options - Schemas for each union variant.
     * @returns A union schema covering all provided schemas.
     */
    oneOf: <T extends any[]>(...options: { [K in keyof T]: Schema<T[K]> }) =>
        new UnionSchema<any>(options as any),

    // objects (ESLint-safe default type)
    /**
     * Starts building an object schema through {@link ObjectBuilder}.
     *
     * @typeParam P - Property record type.
     * @param name - Optional human-readable schema name.
     * @returns A new object schema builder.
     */
    object: <P extends PropsRecord = Record<string, never>>(name?: string) =>
        new ObjectBuilder<P>(name, {} as P),
};
