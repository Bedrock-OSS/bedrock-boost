/* eslint-disable @typescript-eslint/no-explicit-any */
import ChatColor from './ChatColor';
import ColorJSON from './ColorJSON';

describe('ColorJSON', () => {
  let colorJson: ColorJSON;

  beforeEach(() => {
    colorJson = new ColorJSON();
  });

  it('should stringify an object', () => {
    const value = { name: 'John', age: 30 };
    const expected = `§e{§r§7age§r: §330§r, §7name§r: §2"John"§r§e}§r`;
    const result = colorJson.stringify(value);
    expect(result).toEqual(expected);
  });

  it('should stringify a string', () => {
    const value = 'Hello, world!';
    const expected = `§2"Hello, world!"§r`;
    const result = colorJson.stringify(value);
    expect(result).toEqual(expected);
  });

  it('should stringify a number', () => {
    const value = 42;
    const expected = `§342§r`;
    const result = colorJson.stringify(value);
    expect(result).toEqual(expected);
  });

  it('should stringify a boolean', () => {
    const value = true;
    const expected = `§6true§r`;
    const result = colorJson.stringify(value);
    expect(result).toEqual(expected);
  });

  it('should stringify null', () => {
    const value = null;
    const expected = `§6null§r`;
    const result = colorJson.stringify(value);
    expect(result).toEqual(expected);
  });

  it('should stringify undefined', () => {
    const value = undefined;
    const expected = `§6undefined§r`;
    const result = colorJson.stringify(value);
    expect(result).toEqual(expected);
  });

  it('should escape double quotes', () => {
    const value = 'Hello, "world"!';
    const expected = `§2"Hello, §6\\"§2world§6\\"§2!"§r`;
    const result = colorJson.stringify(value);
    expect(result).toEqual(expected);
  });

  it('should stringify an array', () => {
    const value = [1, 2, 3];
    const expected = `[1, 2, 3]`;
    const result = ChatColor.stripColor(colorJson.stringify(value));
    expect(result).toEqual(expected);
  });

  it('should stringify nested arrays', () => {
    const value = [1, 2, 3, [4, 5, 6]];
    const expected = `[
  1,
  2,
  3,
  [4, 5, 6]
]`;
    const result = ChatColor.stripColor(colorJson.stringify(value));
    expect(result).toEqual(expected);
  });

  it('should stringify nested objects', () => {
    const value = { name: 'John', age: 30, nested: { foo: 'bar' } };
    const expected = `{
  age: 30,
  name: "John",
  nested: {foo: "bar"}
}`;
    const result = ChatColor.stripColor(colorJson.stringify(value));
    expect(result).toEqual(expected);
  });

  it('should detect circular references', () => {
    const value: any = { name: 'John', age: 30 };
    value.self = value;
    const expected = `{
  age: 30,
  name: "John",
  self: [...cycle...]
}`;
    const result = ChatColor.stripColor(colorJson.stringify(value));
    expect(result).toEqual(expected);
  });

  it('should detect circular references in arrays', () => {
    const value: any = [1, 2, 3];
    value.push(value);
    const expected = `[1, 2, 3, [...cycle...]]`;
    const result = ChatColor.stripColor(colorJson.stringify(value));
    expect(result).toEqual(expected);
  });

  it('should detect circular references in nested objects', () => {
    const value: any = { name: 'John', age: 30 };
    value.self = value;
    value.nested = { value };
    const expected = `{
  age: 30,
  name: "John",
  nested: {value: [...cycle...]},
  self: [...cycle...]
}`;
    const result = ChatColor.stripColor(colorJson.stringify(value));
    expect(result).toEqual(expected);
  });

  it('should detect circular references in nested arrays', () => {
    const value: any = [1, 2, 3];
    value.push(value);
    value.push([value]);
    const expected = `[
  1,
  2,
  3,
  [...cycle...],
  [[...cycle...]]
]`;
    const result = ChatColor.stripColor(colorJson.stringify(value));
    expect(result).toEqual(expected);
  });

});