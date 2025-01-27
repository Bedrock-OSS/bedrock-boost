import { RGBA } from "@minecraft/server";

export default class ColorUtils {
  /**
   * Parse hex string to RGBA. Hex string can be in format AARRGGBB or RRGGBB. Can be prefixed with # or 0x. Can also be a number.
   * @param hex color
   * @returns RGBA color
   */
  public static toRGBA(hex: string): RGBA;
  /**
   * Parse color to RGBA. Number can be in format AARRGGBB or RRGGBB. 
   * @param hex color
   * @returns RGBA color
   */
  public static toRGBA(hex: number): RGBA;
  /**
   * Parse red, green and blue to RGBA. All numbers must be between 0 and 255.
   * @param r red
   * @param g green
   * @param b blue
   * @returns RGBA color
   */
  public static toRGBA(r: number, g: number, b: number): RGBA;
  /**
   * Parse red, green, blue and alpha to RGBA. All numbers must be between 0 and 255.
   * @param r red
   * @param g green
   * @param b blue
   * @param a alpha
   * @returns RGBA color
   */
  public static toRGBA(r: number, g: number, b: number, a: number): RGBA;
  public static toRGBA(hex: string | number, g?: number, b?: number, a?: number): RGBA {
    if (typeof hex === "number") {
      if (g !== void 0 && b !== void 0) {
        return {
          red: hex / 255.0,
          green: g  / 255.0,
          blue: b  / 255.0,
          alpha: a === void 0 ? 1 : (a / 255.0),
        };
      }
      return {
        red: ((hex & 0xff0000) >> 16) / 255.0,
        green: ((hex & 0xff00) >> 8) / 255.0,
        blue: ((hex & 0xff) >> 0) / 255.0,
        alpha: ((hex & 0xff000000) >>> 24) / 255.0,
      };
    }
    if (hex.startsWith("#")) {
      hex = hex.substring(1);
    } else if (hex.startsWith("0x")) {
      hex = hex.substring(2);
    }
    let alpha = 1;
    if (hex.length === 8) {
      alpha = parseInt(hex.substring(0, 2), 16) / 255.0;
      hex = hex.substring(2);
    }
    return {
      red: parseInt(hex.substring(0, 2), 16) / 255.0,
      green: parseInt(hex.substring(2, 4), 16) / 255.0,
      blue: parseInt(hex.substring(4, 6), 16) / 255.0,
      alpha: alpha,
    };
  }
}
