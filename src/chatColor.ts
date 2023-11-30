/**
 * ChatColor is a class for defining color codes.
 */
export default class ChatColor {
    public static readonly BLACK: ChatColor = new ChatColor('0', 0x000000);
    public static readonly DARK_BLUE: ChatColor = new ChatColor('1', 0x0000aa);
    public static readonly DARK_GREEN: ChatColor = new ChatColor('2', 0x00aa00);
    public static readonly DARK_AQUA: ChatColor = new ChatColor('3', 0x00aaaa);
    public static readonly DARK_RED: ChatColor = new ChatColor('4', 0xaa0000);
    public static readonly DARK_PURPLE: ChatColor = new ChatColor('5', 0xaa00aa);
    public static readonly GOLD: ChatColor = new ChatColor('6', 0xffaa00);
    public static readonly GRAY: ChatColor = new ChatColor('7', 0xaaaaaa);
    public static readonly DARK_GRAY: ChatColor = new ChatColor('8', 0x555555);
    public static readonly BLUE: ChatColor = new ChatColor('9', 0x5555ff);
    public static readonly GREEN: ChatColor = new ChatColor('a', 0x55ff55);
    public static readonly AQUA: ChatColor = new ChatColor('b', 0x55ffff);
    public static readonly RED: ChatColor = new ChatColor('c', 0xff5555);
    public static readonly LIGHT_PURPLE: ChatColor = new ChatColor('d', 0xff55ff);
    public static readonly YELLOW: ChatColor = new ChatColor('e', 0xffff55);
    public static readonly WHITE: ChatColor = new ChatColor('f', 0xffffff);
    public static readonly MINECOIN_GOLD: ChatColor = new ChatColor('g', 0xded605);
    public static readonly MATERIAL_QUARTZ: ChatColor = new ChatColor('h', 0xe3d4d1);
    public static readonly MATERIAL_IRON: ChatColor = new ChatColor('i', 0xcecaca);
    public static readonly MATERIAL_NETHERITE: ChatColor = new ChatColor('j', 0x443a3b);
    public static readonly MATERIAL_REDSTONE: ChatColor = new ChatColor('m', 0x971607);
    public static readonly MATERIAL_COPPER: ChatColor = new ChatColor('n', 0xb4684d);
    public static readonly MATERIAL_GOLD: ChatColor = new ChatColor('p', 0xdeb12d);
    public static readonly MATERIAL_EMERALD: ChatColor = new ChatColor('q', 0x11a036);
    public static readonly MATERIAL_DIAMOND: ChatColor = new ChatColor('s', 0x2cbaa8);
    public static readonly MATERIAL_LAPIS: ChatColor = new ChatColor('t', 0x21497b);
    public static readonly MATERIAL_AMETHYST: ChatColor = new ChatColor('u', 0x9a5cc6);
    public static readonly OBFUSCATED: ChatColor = new ChatColor('k');
    public static readonly BOLD: ChatColor = new ChatColor('l');
    public static readonly ITALIC: ChatColor = new ChatColor('o');
    public static readonly RESET: ChatColor = new ChatColor('r');

    public static readonly VALUES: ChatColor[] = [
        ChatColor.BLACK,
        ChatColor.DARK_BLUE,
        ChatColor.DARK_GREEN,
        ChatColor.DARK_AQUA,
        ChatColor.DARK_RED,
        ChatColor.DARK_PURPLE,
        ChatColor.GOLD,
        ChatColor.GRAY,
        ChatColor.DARK_GRAY,
        ChatColor.BLUE,
        ChatColor.GREEN,
        ChatColor.AQUA,
        ChatColor.RED,
        ChatColor.LIGHT_PURPLE,
        ChatColor.YELLOW,
        ChatColor.WHITE,
        ChatColor.MINECOIN_GOLD,
        ChatColor.MATERIAL_QUARTZ,
        ChatColor.MATERIAL_IRON,
        ChatColor.MATERIAL_NETHERITE,
        ChatColor.MATERIAL_REDSTONE,
        ChatColor.MATERIAL_COPPER,
        ChatColor.MATERIAL_GOLD,
        ChatColor.MATERIAL_EMERALD,
        ChatColor.MATERIAL_DIAMOND,
        ChatColor.MATERIAL_LAPIS,
        ChatColor.MATERIAL_AMETHYST,
        ChatColor.OBFUSCATED,
        ChatColor.BOLD,
        ChatColor.ITALIC,
        ChatColor.RESET
    ];

    public static readonly ALL_COLORS: ChatColor[] = [
        ChatColor.BLACK,
        ChatColor.DARK_BLUE,
        ChatColor.DARK_GREEN,
        ChatColor.DARK_AQUA,
        ChatColor.DARK_RED,
        ChatColor.DARK_PURPLE,
        ChatColor.GOLD,
        ChatColor.GRAY,
        ChatColor.DARK_GRAY,
        ChatColor.BLUE,
        ChatColor.GREEN,
        ChatColor.AQUA,
        ChatColor.RED,
        ChatColor.LIGHT_PURPLE,
        ChatColor.YELLOW,
        ChatColor.WHITE,
        ChatColor.MINECOIN_GOLD,
        ChatColor.MATERIAL_QUARTZ,
        ChatColor.MATERIAL_IRON,
        ChatColor.MATERIAL_NETHERITE,
        ChatColor.MATERIAL_REDSTONE,
        ChatColor.MATERIAL_COPPER,
        ChatColor.MATERIAL_GOLD,
        ChatColor.MATERIAL_EMERALD,
        ChatColor.MATERIAL_DIAMOND,
        ChatColor.MATERIAL_LAPIS,
        ChatColor.MATERIAL_AMETHYST
    ];

    private r?: number;
    private g?: number;
    private b?: number;

    /**
     * Class ChatColor Constructor.
     * @param code - The color code as a string.
     * @param color - The color code as a hexadecimal number. Can be undefined.
     */
    constructor(private code: string, private color?: number) {
        if (color) {
            this.r = (color >> 16) & 0xff;
            this.g = (color >> 8) & 0xff;
            this.b = color & 0xff;
        }
    }

    /**
     * PREFIX is the section sign (§) used in Minecraft color codes.
     */
    private static readonly PREFIX = '§';

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

    /**
     * Returns the string representation of the ChatColor instance,
     * which includes the PREFIX followed by the color code.
     * @returns A string representing the ChatColor instance
     */
    public toString() {
        return ChatColor.PREFIX + this.code;
    }

    /**
     * Returns the color code of the ChatColor instance.
     * @returns The color code of this ChatColor instance.
     */
    public toRGB(): number | undefined {
        return this.color;
    }

    /**
     * Returns the hexadecimal string representation of the color code
     * @returns {string | undefined} The hexadecimal representation of the color.
     */
    public toHex(): string | undefined {
        return this.color?.toString(16);
    }

    /**
     * Retrieve the value of the red component.
     *
     * @returns {number | undefined} The value of the red component, or undefined if it is not set.
     */
    public getRed(): number | undefined {
        return this.r;
    }

    /**
     * Retrieves the green value of the current color.
     *
     * @returns {number | undefined} The green value of the color, or undefined if it is not set.
     */
    public getGreen(): number | undefined {
        return this.g;
    }

    /**
     * Retrieves the blue value of a color.
     *
     * @returns The blue value of the color.
     * @type {number | undefined}
     */
    public getBlue(): number | undefined {
        return this.b;
    }

    /**
     * Retrieves the format code associated with the chat color.
     *
     * @returns {string} The format code of the chat color.
     */
    public getCode(): string {
        return this.code;
    }

    /**
     * Removes color codes from the specified string
     * @param str - The string from which color codes will be removed.
     * @returns The string cleared from color codes.
     */
    static stripColor(str: string) {
        return str.replace(/§[0-9a-u]/g, '');
    }

    /**
     * Finds the closest ChatColor code for the given RGB values
     * @param r - Red part of the color.
     * @param g - Green part of the color.
     * @param b - Blue part of the color.
     * @returns The closest ChatColor for the given RGB values.
     */
    static findClosestColor(r: number, g: number, b: number): ChatColor {
        let minDistance = Number.MAX_VALUE;
        let closestColor: ChatColor = ChatColor.WHITE;
        for (const color of ChatColor.ALL_COLORS) {
            if (color.r && color.g && color.b) {
                const distance = Math.sqrt(Math.pow(color.r - r, 2) + Math.pow(color.g - g, 2) + Math.pow(color.b - b, 2));
                if (distance < minDistance) {
                    minDistance = distance;
                    closestColor = color;
                }
            }
        }
        return closestColor;
    }

    /**
   * Transforms a value into a chat-friendly, colored JSON representation.
   * @param value - The value to transform.
   */
    static prettyChatJSON(value: any): string {
        return this.prettyChatJSONInternal(value);
    }
    private static prettyChatJSONInternal(value: any, indentLevel: number = 0, knownElements: Set<any> = new Set()): string {
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

