# ColorJSON

## Overview

The `ColorJSON` class is designed to transform various data types into a chat-friendly, colored JSON representation. It offers a range of customization options for the formatting and styling of JSON output. This documentation outlines how to use the `ColorJSON` class, including its properties and methods.

### Key Features:

- Color customization for different JSON elements.
- Inline threshold settings for compact JSON representation.
- Maximum depth control for object traversal.
- Class name inclusion in output.
- Ability to override methods for custom formatting.
- Cycle detection and handling.

## Usage

### Initialization

```javascript
import ColorJSON from '@bedrock-oss/bedrock-boost';
const jsonFormatter = new ColorJSON();// or use default instance `ColorJSON.DEFAULT`
```

### Basic JSON Stringification

To convert a value to a colored JSON string:

```javascript
const result = jsonFormatter.stringify(yourValue);
```

### Customization

#### Tokens

Customize JSON tokens like braces, brackets, comma, etc.:

```javascript
jsonFormatter.OpenObject = '{';
jsonFormatter.CloseObject = '}';
// ...similarly for other tokens
```

#### Inline Threshold

Set the inline threshold to control how short arrays and objects representation must be to be displayed inline:

```javascript
jsonFormatter.InlineThreshold = 60;
```
#### Maximum Depth

Set the maximum depth to control how deep the object traversal must go:

```javascript
jsonFormatter.MaxDepth = 5; // or 0 for unlimited
```


#### Class Names

Toggle inclusion of class names:

```javascript
jsonFormatter.IncludeClassNames = true; // or false
```

#### Colors

Customize colors for various elements:

```javascript
jsonFormatter.OpenCloseObjectColor = ChatColor.YELLOW;
jsonFormatter.StringColor = ChatColor.DARK_GREEN;
// ...similarly for other color properties
```

### Customization through Method Overriding

#### Overridable Methods

The `ColorJSON` class contains several methods intended for overriding to customize the output. These methods handle the stringification of different data types and structural elements in JSON.

- `stringifyString(value: string): string`
- `stringifyNumber(value: number): string`
- `stringifyBoolean(value: boolean): string`
- `stringifyFunction(value: function): string`
- `stringifyNull(): string`
- `stringifyUndefined(): string`
- `stringifyCycle(): string`
- `stringifyArray(value: any[]): string`
- `stringifyObject(value: object, className: string, entries: any[][], indentLevel: number): string`

#### How to Override

To override these methods, extend the `ColorJSON` class and redefine the methods as per your requirements.

```javascript
class CustomColorJSON extends ColorJSON {
    // Override methods here
    stringifyString(value) {
        // Custom implementation
    }

    // ... other overrides
}
```

#### Example of Overriding

```javascript
class MyColorJSON extends ColorJSON {
    stringifyString(value) {
        return `${this.StringColor}["${value}"]${ChatColor.RESET}`;
    }

    stringifyNumber(value) {
        return `${this.NumberColor}{${value}}${ChatColor.RESET}`;
    }
    // ... other method overrides
}
```

#### Using Customized Class

```javascript
const jsonFormatter = new MyColorJSON();
const result = jsonFormatter.stringify(yourValue);
```

### Cycle Detection and Handling

The class automatically detects cycles within objects and arrays to prevent infinite loops.

## Examples

### Basic Example

```javascript
const data = { name: "Alice", age: 30, active: true };
const coloredJson = jsonFormatter.stringify(data);
world.sendMessage(coloredJson);
```

### Customized Example

```javascript
jsonFormatter.StringColor = ChatColor.BLUE;
jsonFormatter.BooleanColor = ChatColor.RED;
const customColoredJson = jsonFormatter.stringify(data);
world.sendMessage(customColoredJson);
```
