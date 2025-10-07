import {
    TypeBuilder,
    ValidationError,
    ValidationIssueCode,
} from './TypeAssertion';

describe('TypeAssertion schemas', () => {
    it('parses optional and nullable strings correctly', () => {
        const schema = TypeBuilder.string().optional().nullable();
        expect(schema.parse('hello')).toBe('hello');
        expect(schema.parse(undefined)).toBeUndefined();
        expect(schema.parse(null)).toBeNull();
    });

    it('fails refinement when predicate returns false', () => {
        const schema = TypeBuilder.number().refine((value) => value % 2 === 0, 'Must be even');

        expect(schema.parse(4)).toBe(4);

        try {
            schema.parse(3);
            fail('Expected schema.parse to throw');
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            const validationError = error as ValidationError;
            expect(validationError.issues).toEqual([
                {
                    path: '$',
                    message: 'Must be even',
                    code: ValidationIssueCode.RefinementFailed,
                },
            ]);
        }
    });

    it('collects validation errors with accurate paths for nested schemas', () => {
        const schema = TypeBuilder.object('Numbers')
            .property('values', TypeBuilder.array(TypeBuilder.number()))
            .build();

        try {
            schema.parse({ values: [1, 'two'] });
            fail('Expected schema.parse to throw');
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            const validationError = error as ValidationError;
            expect(validationError.issues).toEqual([
                {
                    path: '$.values[1]',
                    message: 'Expected number, got string',
                    code: ValidationIssueCode.NumberType,
                },
            ]);
        }
    });

    it('supports union schemas and reports combined errors when no option matches', () => {
        const schema = TypeBuilder.union(
            TypeBuilder.string(),
            TypeBuilder.number()
        );

        expect(schema.parse('ok')).toBe('ok');
        expect(schema.parse(1)).toBe(1);

        try {
            schema.parse(true);
            fail('Expected schema.parse to throw');
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            const validationError = error as ValidationError;
            expect(validationError.issues[0]).toMatchObject({
                path: '$',
                code: ValidationIssueCode.UnionNoMatch,
            });
            expect(validationError.issues[0].message).toContain(
                'No union variant matched'
            );
        }
    });

    it('rejects unknown properties unless allowUnknown is set', () => {
        const strictSchema = TypeBuilder.object('Strict')
            .property('name', TypeBuilder.string())
            .build();

        try {
            strictSchema.parse({ name: 'Alex', extra: true });
            fail('Expected strictSchema.parse to throw');
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            const validationError = error as ValidationError;
            expect(validationError.issues).toEqual([
                {
                    path: '$.extra',
                    message: 'Unknown property',
                    code: ValidationIssueCode.ObjectUnknownKey,
                },
            ]);
        }

        const looseSchema = TypeBuilder.object('Loose')
            .property('name', TypeBuilder.string())
            .allowUnknown()
            .build();

        expect(looseSchema.parse({ name: 'Alex', extra: true })).toEqual({
            name: 'Alex',
            extra: true,
        });
    });

    it('safeParse returns structured success and failure results', () => {
        const schema = TypeBuilder.number();

        expect(schema.safeParse(42)).toEqual({
            success: true,
            data: 42,
        });

        const failure = schema.safeParse('nope');
        expect(failure.success).toBe(false);
        if (!failure.success) {
            expect(failure.errors).toEqual([
                {
                    path: '$',
                    message: 'Expected number, got string',
                    code: ValidationIssueCode.NumberType,
                },
            ]);
        }
    });
});
