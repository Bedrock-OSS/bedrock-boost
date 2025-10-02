//#region Types & error helpers

type Path = (string | number)[];

export type ValidationIssue = {
    path: string; // e.g. $.player.location.x
    message: string;
    code?: string; // optional machine-readable code
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
    refine(pred: (v: T) => boolean, message: string, code?: string): Schema<T>;
}

//#region Base schema (mutating)

abstract class BaseSchema<T> implements Schema<T> {
    protected _refinements: Array<{
        pred: (v: T) => boolean;
        message: string;
        code?: string;
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
    refine(pred: (v: T) => boolean, message: string, code?: string): Schema<T> {
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
                        { path: '$', message: r.message, code: r.code },
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
        code?: string
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
            this.issue(issues, path, 'Required');
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(issues, path, 'Expected string, got null');
            return undefined as any;
        }
        if (typeof value !== 'string') {
            this.issue(issues, path, `Expected string, got ${typeof value}`);
            return undefined as any;
        }
        if (this._nonEmpty && value.length === 0)
            this.issue(issues, path, 'String must not be empty', 'too_small');
        if (this._min !== undefined && value.length < this._min)
            this.issue(
                issues,
                path,
                `String length < ${this._min}`,
                'too_small'
            );
        if (this._max !== undefined && value.length > this._max)
            this.issue(issues, path, `String length > ${this._max}`, 'too_big');
        if (this._regex && !this._regex.test(value))
            this.issue(
                issues,
                path,
                `String does not match ${this._regex}`,
                'invalid_string'
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
            this.issue(issues, path, 'Required');
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(issues, path, 'Expected number, got null');
            return undefined as any;
        }
        if (typeof value !== 'number' || Number.isNaN(value)) {
            this.issue(issues, path, `Expected number, got ${typeof value}`);
            return undefined as any;
        }
        if (this._int && !Number.isInteger(value))
            this.issue(issues, path, 'Expected integer', 'invalid_number');
        if (this._min !== undefined && value < this._min)
            this.issue(issues, path, `Number < ${this._min}`, 'too_small');
        if (this._gt !== undefined && !(value > this._gt))
            this.issue(
                issues,
                path,
                `Number must be > ${this._gt}`,
                'too_small'
            );
        if (this._max !== undefined && value > this._max)
            this.issue(issues, path, `Number > ${this._max}`, 'too_big');
        if (this._lt !== undefined && !(value < this._lt))
            this.issue(issues, path, `Number must be < ${this._lt}`, 'too_big');
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
            this.issue(issues, path, 'Required');
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(issues, path, 'Expected boolean, got null');
            return undefined as any;
        }
        if (typeof value !== 'boolean') {
            this.issue(issues, path, `Expected boolean, got ${typeof value}`);
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
        nullable: boolean
    ) {
        if (value === undefined) {
            if (optional) return undefined as any;
            this.issue(issues, path, 'Required');
            return undefined as any;
        }
        if (this._value === null) {
            if (value !== null) {
                this.issue(
                    issues,
                    path,
                    `Expected literal ${JSON.stringify(this._value)}`
                );
                return undefined as any;
            }
            return null as any;
        }
        if (value !== this._value) {
            this.issue(
                issues,
                path,
                `Expected literal ${JSON.stringify(this._value)}`
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
            this.issue(issues, path, 'Required');
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(issues, path, 'Expected enum value, got null');
            return undefined as any;
        }
        if (!this._set.has(value as any)) {
            this.issue(
                issues,
                path,
                `Expected one of ${[...this._set].map(String).join(', ')}`
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
            this.issue(issues, path, 'Required');
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(issues, path, 'Expected array, got null');
            return undefined as any;
        }
        if (!Array.isArray(value)) {
            this.issue(issues, path, 'Expected array');
            return undefined as any;
        }

        const arr = value;
        if (this._exact !== undefined && arr.length !== this._exact)
            this.issue(
                issues,
                path,
                `Array length must be ${this._exact}`,
                'invalid_array'
            );
        if (this._min !== undefined && arr.length < this._min)
            this.issue(
                issues,
                path,
                `Array length < ${this._min}`,
                'too_small'
            );
        if (this._max !== undefined && arr.length > this._max)
            this.issue(issues, path, `Array length > ${this._max}`, 'too_big');

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
            this.issue(issues, path, 'Required');
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(issues, path, 'Expected tuple, got null');
            return undefined as any;
        }
        if (!Array.isArray(value)) {
            this.issue(issues, path, 'Expected tuple (array)');
            return undefined as any;
        }
        if (value.length !== this.elements.length)
            this.issue(
                issues,
                path,
                `Tuple length must be ${this.elements.length}`,
                'invalid_tuple'
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
            this.issue(issues, path, 'Required');
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(issues, path, 'Unexpected null');
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
            'invalid_union'
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
            this.issue(issues, path, 'Required');
            return undefined as any;
        }
        if (value === null) {
            if (nullable) return null as any;
            this.issue(issues, path, 'Expected object, got null');
            return undefined as any;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            this.issue(issues, path, 'Expected object');
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
                    this.issue(issues, path, 'Unknown property', 'unknown_key');
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
