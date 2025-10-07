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

export class ValidationError extends Error {
    constructor(public issues: ValidationIssue[]) {
        super(issues.map((i) => `${i.path}: ${i.message}`).join('\n'));
        this.name = 'ValidationError';
    }
}

export type SafeParseSuccess<T> = { success: true; data: T };
export type SafeParseFailure = { success: false; errors: ValidationIssue[] };
export type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseFailure;

function pathToString(path: Path): string {
    if (path.length === 0) return '$';
    let s = '$';
    for (const p of path) s += typeof p === 'number' ? `[${p}]` : `.${p}`;
    return s;
}

//#region Public Schema interface

export interface Schema<T> {
    parse(value: unknown): T;
    assert(value: unknown): asserts value is T;
    safeParse(value: unknown): SafeParseResult<T>;

    optional(): Schema<T | undefined>;
    required(): this;
    nullable(): Schema<T | null>;
    refine(
        pred: (v: T) => boolean,
        message: string,
        code?: ValidationIssueCode
    ): Schema<T>;
}

//#region Base schema (mutating)

abstract class BaseSchema<T> implements Schema<T> {
    protected _refinements: Array<{
        pred: (v: T) => boolean;
        message: string;
        code?: ValidationIssueCode;
    }> = [];
    protected _isOptional = false;
    protected _isNullable = false;

    // Mutating chainers (no allocations)
    optional(): Schema<T | undefined> {
        this._isOptional = true;
        return this as unknown as Schema<T | undefined>;
    }
    required(): this {
        this._isOptional = false;
        return this;
    }
    nullable(): Schema<T | null> {
        this._isNullable = true;
        return this as unknown as Schema<T | null>;
    }
    refine(
        pred: (v: T) => boolean,
        message: string,
        code?: ValidationIssueCode
    ): Schema<T> {
        this._refinements.push({ pred, message, code });
        return this;
    }

    assert(value: unknown): asserts value is T {
        this.parse(value);
    }

    safeParse(value: unknown): SafeParseResult<T> {
        try {
            return { success: true, data: this.parse(value) };
        } catch (e) {
            if (e instanceof ValidationError)
                return { success: false, errors: e.issues };
            throw e;
        }
    }

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
                            code: r.code ?? ValidationIssueCode.RefinementFailed,
                        },
                    ]);
                }
            }
        }
        return out as T;
    }

    /** Call a child schema's internal validator without protected-access errors */
    protected _validateChild<U>(
        schema: Schema<U>,
        value: unknown,
        path: Path,
        issues: ValidationIssue[]
    ): U | undefined | null {
        const s = schema as BaseSchema<U>;
        return s._validate(value, path, issues, s._isOptional, s._isNullable);
    }

    protected abstract _validate(
        value: unknown,
        path: Path,
        issues: ValidationIssue[],
        optional: boolean,
        nullable: boolean
    ): T | undefined | null;

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

    min(n: number) {
        this._min = n;
        return this;
    }
    max(n: number) {
        this._max = n;
        return this;
    }
    regex(r: RegExp) {
        this._regex = r;
        return this;
    }
    notEmpty() {
        this._nonEmpty = true;
        return this;
    }

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

    int() {
        this._int = true;
        return this;
    }
    min(n: number) {
        this._min = n;
        return this;
    }
    max(n: number) {
        this._max = n;
        return this;
    }
    gt(n: number) {
        this._gt = n;
        return this;
    }
    lt(n: number) {
        this._lt = n;
        return this;
    }
    nonNegative() {
        return this.min(0);
    }
    positive() {
        return this.gt(0);
    }

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
    constructor(private _value: V) {
        super();
    }
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
    constructor(values: readonly T[]) {
        super();
        this._set = new Set(values);
    }
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

    constructor(private element: Schema<T>) {
        super();
    }

    min(n: number) {
        this._min = n;
        return this;
    }
    max(n: number) {
        this._max = n;
        return this;
    }
    size(n: number) {
        this._exact = n;
        return this;
    } // exact length

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
    constructor(private elements: { [K in keyof T]: Schema<T[K]> }) {
        super();
    }

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
    constructor(private options: Schema<any>[]) {
        super();
    }

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
    constructor(
        private name: string | undefined,
        private props: P,
        private _allowUnknown = false
    ) {
        super();
    }

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

export class ObjectBuilder<P extends PropsRecord> {
    private _allowUnknown = false;
    constructor(
        private name: string | undefined,
        private props: P
    ) {}

    /** Mutates in place for speed; TS type is widened via return type */
    property<K extends string, S extends Schema<any>>(
        key: K,
        schema: S
    ): ObjectBuilder<P & { [Q in K]: { schema: S } }> {
        (this.props as any)[key] = { schema };
        return this as unknown as ObjectBuilder<
            P & { [Q in K]: { schema: S } }
        >;
    }

    allowUnknown(): this {
        this._allowUnknown = true;
        return this;
    }

    /** One-off shallow copy & freeze to stabilize the schema */
    build(): ObjectSchema<P, InferProps<P>> {
        const frozen = Object.freeze({ ...(this.props as any) }) as P;
        return new ObjectSchema<P, InferProps<P>>(
            this.name,
            frozen,
            this._allowUnknown
        );
    }

    asSchema(): Schema<InferProps<P>> {
        return this.build();
    }
}

//#region Factory (public API)

export const TypeBuilder = {
    // primitives
    string: () => new StringSchema(),
    number: () => new NumberSchema(),
    boolean: () => new BooleanSchema(),
    literal: <V extends string | number | boolean | null>(v: V) =>
        new LiteralSchema(v),
    enum: <T extends string | number>(values: readonly T[]) =>
        new EnumSchema(values),

    // arrays & tuples
    array: <T>(elem: Schema<T>) => new ArraySchema(elem),
    tuple: <T extends any[]>(...elements: { [K in keyof T]: Schema<T[K]> }) =>
        new TupleSchema<T>(elements as any),

    // unions
    union: <A, B>(a: Schema<A>, b: Schema<B>): Schema<A | B> =>
        new UnionSchema<any>([a, b]),
    oneOf: <T extends any[]>(...options: { [K in keyof T]: Schema<T[K]> }) =>
        new UnionSchema<any>(options as any),

    // objects (ESLint-safe default type)
    object: <P extends PropsRecord = Record<string, never>>(name?: string) =>
        new ObjectBuilder<P>(name, {} as P),
};
