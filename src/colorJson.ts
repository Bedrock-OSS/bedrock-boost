import ChatColor from "./chatColor";

export default class ColorJSON {
    // Tokens
    public OpenObject: string = '{';
    public CloseObject: string = '}';
    public OpenArray: string = '[';
    public CloseArray: string = ']';
    public Comma: string = ',';
    public KeyValueSeparator: string = ':';
    public StringDelimiter: string = '"';
    public KeyDelimiter: string = '';
    public Indent: string = '  ';
    public NewLine: string = '\n';
    public Space: string = ' ';

    // Threshold for inline representation
    public InlineThreshold: number = 60;
    // Maximum depth to which objects will be traversed
    public MaxDepth: number = 1;
    // Whether to include class names
    public IncludeClassNames: boolean = true;

    // Values
    public FunctionValue: string = 'ƒ';
    public NullValue: string = 'null';
    public UndefinedValue: string = 'undefined';
    public TrueValue: string = 'true';
    public FalseValue: string = 'false';
    public CycleValue: string = '[...cycle...]';
    public TruncatedObjectValue: string = '{...}';

    // Colors
    public OpenCloseObjectColor: ChatColor = ChatColor.YELLOW;
    public OpenCloseArrayColor: ChatColor = ChatColor.AQUA;
    public NumberColor: ChatColor = ChatColor.DARK_AQUA;
    public StringColor: ChatColor = ChatColor.DARK_GREEN;
    public BooleanColor: ChatColor = ChatColor.GOLD;
    public NullColor: ChatColor = ChatColor.GOLD;
    public KeyColor: ChatColor = ChatColor.GRAY;
    public EscapeColor: ChatColor = ChatColor.GOLD;
    public FunctionColor: ChatColor = ChatColor.GRAY;
    public ClassColor: ChatColor = ChatColor.GRAY;
    public ClassStyle: ChatColor = ChatColor.BOLD;
    public CycleColor: ChatColor = ChatColor.DARK_RED;

    public static readonly DEFAULT: ColorJSON = new ColorJSON();

    /**
     * Transforms a value into a chat-friendly, colored JSON representation.
     * @param value - The value to transform.
     */
    public stringify(value: any): string {
        return this.stringifyValue(value);
    }

    /**
     * Transforms a string into a JSON representation.
     * @param value - The string to transform.
     */
    protected stringifyString(value: string): string {
        // Escaping and concatenating with color, and delimiter
        return this.StringColor + this.StringDelimiter + this.escapeString(value) + this.StringDelimiter + ChatColor.RESET;
    }

    /**
     * Transforms a number into a JSON representation.
     * @param value - The number to transform.
     */
    protected stringifyNumber(value: number): string {
        // Converting to string and concatenating with colors
        return this.NumberColor + value.toString() + ChatColor.RESET;
    }

    /**
     * Transforms a boolean into a JSON representation.
     * @param value - The boolean to transform.
     */
    protected stringifyBoolean(value: boolean): string {
        // Boolean to string transformation along with colors
        return this.BooleanColor + (value ? this.TrueValue : this.FalseValue) + ChatColor.RESET;
    }

    /**
     * Transforms a function into a JSON representation.
     * @param value - The function to transform.
     */
    protected stringifyFunction(value: any): string {
        // Functions are transformed to predefined function token
        return this.FunctionColor + this.FunctionValue + ChatColor.RESET;
    }

    /**
     * Returns a null JSON representation.
     */
    protected stringifyNull(): string {
        // Null transformation
        return this.NullColor + this.NullValue + ChatColor.RESET;
    }

    /**
     * Returns an undefined JSON representation.
     */
    protected stringifyUndefined(): string {
        // Undefined transformation
        return this.NullColor + this.UndefinedValue + ChatColor.RESET;
    }

    /**
     * Returns a cycle JSON representation.
     */
    protected stringifyCycle(): string {
        return this.CycleColor + this.CycleValue + ChatColor.RESET;
    }

    /**
     * Transforms an array into a JSON representation.
     * @param value - The array to transform.
     * @param indentLevel - The indentation level for pretty-printing.
     * @param knownElements - Known elements, for cycle detection.
     */
    protected stringifyArray(value: any[], indentLevel: number = 0, knownElements: Set<any> = new Set()): string {
        const indentSpace = this.Indent.repeat(indentLevel);
        // If array is empty, just returns colored `[]`
        if (value.length === 0) {
            return this.OpenCloseArrayColor + this.OpenArray + this.CloseArray + ChatColor.RESET;
        }
        let result = this.OpenCloseArrayColor + this.OpenArray + ChatColor.RESET + this.NewLine;
        let compactResult = this.OpenCloseArrayColor + this.OpenArray + ChatColor.RESET;
        value.forEach((item, index) => {
            result += indentSpace + this.Indent + this.stringifyValue(item, indentLevel + 1, knownElements);
            result += (index < value.length - 1 ? this.Comma + this.NewLine : this.NewLine);

            compactResult += this.stringifyValue(item, indentLevel + 1, knownElements);
            compactResult += (index < value.length - 1 ? this.Comma + this.Space : '');
        });
        result += indentSpace + this.OpenCloseArrayColor + this.CloseArray + ChatColor.RESET;
        compactResult += this.OpenCloseArrayColor + this.CloseArray + ChatColor.RESET;

        // If the compact representation is small enough, use it
        if (compactResult.length < this.InlineThreshold) {
            return compactResult;
        }
        return result;
    }

    /**
     * Transforms an object into a truncated JSON representation.
     * @param value - The object to transform.
     * @param className - Class Name of the object.
     * @param indentLevel - The indentation level for pretty-printing.
     * @param knownElements - Known elements, for cycle detection.
     */
    protected stringifyTruncatedObject(value: object, className: string, indentLevel: number = 0, knownElements: Set<any>): string {
        return (this.IncludeClassNames ? this.ClassColor + '' + this.ClassStyle + className + ChatColor.RESET + this.Space : '') + this.TruncatedObjectValue;
    }

    /**
     * Transforms an object into a JSON representation.
     * @param value - The object to transform.
     * @param className - Class Name of the object.
     * @param entries - Entries of the object to transform.
     * @param indentLevel - The indentation level for pretty-printing.
     * @param knownElements - Known elements, for cycle detection.
     */
    protected stringifyObject(value: object, className: string, entries: any[][], indentLevel: number = 0, knownElements: Set<any>): string {
        const indentSpace = this.Indent.repeat(indentLevel);
        const prefix = (this.IncludeClassNames && className !== 'Object' ? this.ClassColor + '' + this.ClassStyle + className + ChatColor.RESET + this.Space : '');
        // If object has no entries, just return `{}` possibly preceded by class name
        if (entries.length === 0) {
            return prefix + this.OpenCloseObjectColor + this.OpenObject + this.CloseObject + ChatColor.RESET;
        }
        // Create both a compact and a multi-line representation
        let result = prefix + this.OpenCloseObjectColor + this.OpenObject + ChatColor.RESET + this.NewLine;
        let compactResult = prefix + this.OpenCloseObjectColor + this.OpenObject + ChatColor.RESET;

        // Stringify each entry
        entries.forEach(([key, val], index) => {
            let compactVal = this.stringifyValue(val, indentLevel + 1, knownElements);
            result += indentSpace + this.Indent + this.KeyColor + this.KeyDelimiter + key + this.KeyDelimiter + ChatColor.RESET + this.KeyValueSeparator + this.Space + compactVal;
            result += (index < entries.length - 1) ? this.Comma + this.NewLine : this.NewLine;

            compactResult += this.KeyColor + key + ChatColor.RESET + this.KeyValueSeparator + this.Space + compactVal;
            compactResult += (index < entries.length - 1) ? this.Comma + this.Space : '';
        });
        // Close the object
        result += indentSpace + this.OpenCloseObjectColor + this.CloseObject + ChatColor.RESET;
        compactResult += this.OpenCloseObjectColor + this.CloseObject + ChatColor.RESET;

        // If the compact representation is small enough, use it
        if (compactResult.length < this.InlineThreshold) {
            return compactResult;
        }
        return result;
    }

    protected shouldTruncateObject(value: object, className: string, indentLevel: number = 0, knownElements: Set<any>): boolean {
        return className === 'Object' || knownElements.size <= this.MaxDepth || this.MaxDepth <= 0;
    }

    /**
     * Transforms a value of any type into a JSON representation. This function is not meant to be overridden.
     * @param value - The value to transform.
     * @param indentLevel - The indentation level for pretty-printing.
     * @param knownElements - Known elements, for cycle detection.
     */
    protected stringifyValue(value: any, indentLevel: number = 0, knownElements: Set<any> = new Set()): string {
        // Stringify primitives like null, undefined, number, string, boolean
        if (value === null) return this.stringifyNull();
        if (value === void 0) return this.stringifyUndefined();
        if (typeof value === 'number') return this.stringifyNumber(value);
        if (typeof value === 'string') return this.stringifyString(value);
        if (typeof value === 'boolean') return this.stringifyBoolean(value);
        if (typeof value === 'function') return this.stringifyFunction(value);

        // Check for cycles
        if (knownElements.has(value)) {
            return this.CycleColor + this.CycleValue + ChatColor.RESET;
        }
        knownElements.add(value);

        // Stringify arrays
        if (Array.isArray(value)) {
            return this.stringifyArray(value, indentLevel + 1, knownElements);
        }

        // Stringify objects
        if (typeof value === 'object') {
            // Get class name
            let name = value.constructor.name;
            // If it's a plain object, or we haven't reached the max depth, stringify it
            if (this.shouldTruncateObject(value, name, indentLevel, knownElements)) {
                // Get all keys
                let keySet: Set<string> = new Set();
                // Get all keys from the prototype chain
                let prototype = Object.getPrototypeOf(value);
                let keys = Object.keys(prototype);
                while (keys.length > 0) {
                    keys.forEach(key => keySet.add(key));
                    prototype = Object.getPrototypeOf(prototype);
                    keys = Object.keys(prototype);
                }
                // Get all keys from the object itself
                Object.keys(value).forEach(key => keySet.add(key));
                // Sort the keys
                const allKeys = [...keySet].sort();
                // Get all entries
                const entries = allKeys.map((key: string) => [key, (value as any)[key]]).filter(([key, val]) => typeof val !== 'function' && val !== void 0);
                return this.stringifyObject(value, name, entries, indentLevel, knownElements);
            } else {
                return this.stringifyTruncatedObject(value, name, indentLevel, knownElements);
            }
        }

        // Stringify unknowns
        return ChatColor.RESET + value.toString();
    }

    /**
     * Escapes a string for JSON.
     * @param str - The string to escape.
     */
    protected escapeString(str: string): string {
        return str.replace(/\\/g, this.EscapeColor + '\\\\' + this.StringColor)
            .replace(/"/g, this.EscapeColor + '\\"' + this.StringColor)
            .replace(/\n/g, this.EscapeColor + '\\n' + this.StringColor)
            .replace(/\r/g, this.EscapeColor + '\\r' + this.StringColor)
            .replace(/\t/g, this.EscapeColor + '\\t' + this.StringColor);
    }
}