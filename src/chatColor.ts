/**
 * ChatColor is a class for defining color codes.
 */
export default class ChatColor {
    /**
     * PREFIX is the section sign (§) used in Minecraft color codes.
     */
    private static readonly PREFIX = '§';

    public static BLACK: ChatColor = new ChatColor('0');
    public static DARK_BLUE: ChatColor = new ChatColor('1');
    public static DARK_GREEN: ChatColor = new ChatColor('2');
    public static DARK_AQUA: ChatColor = new ChatColor('3');
    public static DARK_RED: ChatColor = new ChatColor('4');
    public static DARK_PURPLE: ChatColor = new ChatColor('5');
    public static GOLD: ChatColor = new ChatColor('6');
    public static GRAY: ChatColor = new ChatColor('7');
    public static DARK_GRAY: ChatColor = new ChatColor('8');
    public static BLUE: ChatColor = new ChatColor('9');
    public static GREEN: ChatColor = new ChatColor('a');
    public static AQUA: ChatColor = new ChatColor('b');
    public static RED: ChatColor = new ChatColor('c');
    public static LIGHT_PURPLE: ChatColor = new ChatColor('d');
    public static YELLOW: ChatColor = new ChatColor('e');
    public static WHITE: ChatColor = new ChatColor('f');
    public static MINECOIN_GOLD: ChatColor = new ChatColor('g');
    public static MATERIAL_QUARTZ: ChatColor = new ChatColor('h');
    public static MATERIAL_IRON: ChatColor = new ChatColor('i');
    public static MATERIAL_NETHERITE: ChatColor = new ChatColor('j');
    public static MATERIAL_REDSTONE: ChatColor = new ChatColor('m');
    public static MATERIAL_COPPER: ChatColor = new ChatColor('n');
    public static MATERIAL_GOLD: ChatColor = new ChatColor('p');
    public static MATERIAL_EMERALD: ChatColor = new ChatColor('q');
    public static MATERIAL_DIAMOND: ChatColor = new ChatColor('s');
    public static MATERIAL_LAPIS: ChatColor = new ChatColor('t');
    public static MATERIAL_AMETHYST: ChatColor = new ChatColor('u');
    public static OBFUSCATED: ChatColor = new ChatColor('k');
    public static BOLD: ChatColor = new ChatColor('l');
    public static ITALIC: ChatColor = new ChatColor('o');
    public static RESET: ChatColor = new ChatColor('r');

    /**
     * Different ChatColor instances for different tokens in JSON.
     */
    private static readonly OBJECT_BRACKETS_COLOR: ChatColor = ChatColor.YELLOW;
    private static readonly ARRAY_BRACKETS_COLOR: ChatColor = ChatColor.AQUA;
    private static readonly NUMBER_COLOR: ChatColor = ChatColor.DARK_AQUA;
    private static readonly STRING_COLOR: ChatColor = ChatColor.DARK_GREEN;
    private static readonly BOOLEAN_COLOR: ChatColor = ChatColor.GOLD;
    private static readonly NULL_COLOR: ChatColor = ChatColor.GOLD;
    private static readonly KEY_COLOR: ChatColor = ChatColor.GRAY;
    private static readonly ESCAPE_COLOR: ChatColor = ChatColor.GOLD;
    private static readonly FUNCTION_COLOR: ChatColor = ChatColor.GRAY;
    private static readonly CLASS_COLOR: ChatColor = ChatColor.GRAY;
    private static readonly CYCLE_COLOR: ChatColor = ChatColor.DARK_RED;
    private static readonly COMPACT_THRESHOLD: number = 60;

    constructor(private code: string) {
    }

    /**
     * Returns the string representation of the ChatColor instance,
     * which is the PREFIX followed by the color code.
     * @returns PREFIX + this.code
     */
    public toString() {
        return ChatColor.PREFIX + this.code;
    }

    static stripColor(str: string) {
        return str.replace(/§[0-9a-u]/g, '');
    }
    /**
   * Transforms a value into a chat-friendly, colored JSON representation.
   * @param value - The value to transform.
   */
    static prettyChatJSON(value: any): string {
        return this.prettyChatJSONInternal(value);
    }
    static prettyChatJSONInternal(value: any, indentLevel: number = 0, knownElements: Set<any> = new Set()): string {
        const indentSpace = ' '.repeat(indentLevel * 2);

        if (value === null) return `${ChatColor.NULL_COLOR}null${ChatColor.RESET}`;
        if (value === void 0) return `${ChatColor.NULL_COLOR}undefined${ChatColor.RESET}`;
        if (typeof value === 'number') return `${ChatColor.NUMBER_COLOR}${value}${ChatColor.RESET}`;
        if (typeof value === 'string') return `${ChatColor.STRING_COLOR}"${this.escapeString(value)}"${ChatColor.RESET}`;
        if (typeof value === 'boolean') return `${ChatColor.BOOLEAN_COLOR}${value}${ChatColor.RESET}`;
        if (typeof value === 'function') return `${ChatColor.FUNCTION_COLOR}f()${ChatColor.RESET}`;

        if (Array.isArray(value)) {
            if (knownElements.has(value)) {
                return `${ChatColor.CYCLE_COLOR}[...cycle...]${ChatColor.RESET}`;
            }
            if (value.length === 0) {
                return `${ChatColor.ARRAY_BRACKETS_COLOR}[]${ChatColor.RESET}`;
            }
            let result = `${ChatColor.ARRAY_BRACKETS_COLOR}[${ChatColor.RESET}\n`;
            knownElements.add(value);
            value.forEach((item, index) => {
                result += `${indentSpace}  ${ChatColor.prettyChatJSONInternal(item, indentLevel + 1, knownElements)}`;
                result += (index < value.length - 1 ? `,\n` : '\n');
            });
            knownElements.delete(value);
            return result + `${indentSpace}${ChatColor.ARRAY_BRACKETS_COLOR}]${ChatColor.RESET}`;
        }

        if (typeof value === 'object') {
            if (knownElements.has(value)) {
                return `${ChatColor.CYCLE_COLOR}[...cycle...]${ChatColor.RESET}`;
            }
            let name = value.constructor.name;
            if (name === 'Object' || knownElements.size === 0) {
                let keySet: Set<string> = new Set();
                let prototype = Object.getPrototypeOf(value);
                let keys = Object.keys(prototype);
                while (keys.length > 0) {
                    keys.forEach(key => keySet.add(key));
                    prototype = Object.getPrototypeOf(prototype);
                    keys = Object.keys(prototype);
                }
                Object.keys(value).forEach(key => keySet.add(key));
                const allKeys = [...keySet].sort();
                const entries = allKeys.map((key: string) => [key, value[key]]).filter(([key, val]) => typeof val !== 'function' && val !== void 0);

                if (entries.length === 0) {
                    return `${ChatColor.CLASS_COLOR}${ChatColor.BOLD}${name}${ChatColor.RESET} ${ChatColor.OBJECT_BRACKETS_COLOR}{}${ChatColor.RESET}`;
                }
                let result = `${ChatColor.OBJECT_BRACKETS_COLOR}{${ChatColor.RESET}\n`;
                let compactResult = `${ChatColor.OBJECT_BRACKETS_COLOR}{${ChatColor.RESET}`;

                knownElements.add(value);
                entries.forEach(([key, val], index) => {
                    let compactVal = this.prettyChatJSONInternal(val, indentLevel + 1, knownElements);
                    result += `${indentSpace}  ${this.KEY_COLOR}${key}${this.RESET}: ${compactVal}`;
                    result += (index < entries.length - 1) ? `,\n` : '\n';
                    compactResult += `${this.KEY_COLOR}${key}${this.RESET}: ${compactVal}`;
                    compactResult += (index < entries.length - 1) ? `, ` : '';
                });
                knownElements.delete(value);
                result += `${indentSpace}${ChatColor.OBJECT_BRACKETS_COLOR}}${ChatColor.RESET}`;
                compactResult += `${ChatColor.OBJECT_BRACKETS_COLOR}}${ChatColor.RESET}`;
                if (compactResult.length < ChatColor.COMPACT_THRESHOLD) {
                    return compactResult;
                }
                return result;
            } else {
                return `${ChatColor.CLASS_COLOR}${ChatColor.BOLD}${name}${ChatColor.RESET} {...}`;
            }
        }

        return `${ChatColor.RESET}${value}`;
    }

    private static escapeString(str: string): string {
        return str.replace(/\\/g, ChatColor.ESCAPE_COLOR + '\\\\' + ChatColor.STRING_COLOR)
            .replace(/"/g, ChatColor.ESCAPE_COLOR + '\\"' + ChatColor.STRING_COLOR)
            .replace(/\n/g, ChatColor.ESCAPE_COLOR + '\\n' + ChatColor.STRING_COLOR)
            .replace(/\r/g, ChatColor.ESCAPE_COLOR + '\\r' + ChatColor.STRING_COLOR)
            .replace(/\t/g, ChatColor.ESCAPE_COLOR + '\\t' + ChatColor.STRING_COLOR);
    }
}

