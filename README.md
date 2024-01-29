# Accord's Library

## CSS Utility classes

- `when-js`: only display element if JavaScript is available
- `when-no-js`: only display element if JavaScript is unavailable

- `when-dark-theme`: only display element if the current theme is dark (manually or automatically)
- `when-light-theme`: only display element if the current theme is light (manually or automatically)

- `hide-scrollbar`: hide the element scrollbar
- `texture-dots`: add a background paper like texture to the element

- `font-serif`: by default, everything use sans-serif. Use this class to make the font serif.

## CSS Component classes

- `pressable-icon`: used to make a SVG/Text look pressable
- `keycap`: used to make an element look like a pressable keycap

## CSS Global Variables

- `--color-base-X`: the current theme colors. X can be between 0 and 1000, available in increments of 50.
- `--font-serif`: by default, everything use sans-serif. Use this variable to make the font serif.


## Translations

For all the following exemples, the spaces within the double curly braces are important.


### Variables

Variables allow to embed strings or numbers within a translation.
In the JSON translation file:

`"home.greeting": "Hello {{ name }}!"`

If then you call:

`t("home.greeting", { name: "John" })`

It will produce

`Hello John!`

### Plural

In the JSON translation file:

`"videos": "{{ count }} video{{ count+,>1{s} }}"`

If then you call:

`t("videos", { count: 0 })`  
`t("videos", { count: 1 })`  
`t("videos", { count: 2 })`

It will produce

`0 video`  
`1 video`  
`2 videos`

You can provide multiple options inside a plural:

`"videos": "{{ count+,=0{No},=1{One},>1{{{ count }}} }} video{{ count+,>1{s} }}"`

If then you call:

`t("videos", { count: 0 })`  
`t("videos", { count: 1 })`  
`t("videos", { count: 2 })`

It will produce

`No video`  
`One video`  
`2 videos`

The following operators are supported: =, >, <

### Conditional

In the JSON translation file:

`"returnButton": "Return{{ x?, to {{ x }} }}"`

If then you call:

`t("returnButton", { x: "Home" })`  
`t("returnButton", { x: undefined })`  
`t("returnButton", { x: null })`  
`t("returnButton", { x: "" })`  
`t("returnButton", { x: 0 })`

It will produce

`Return to Home`  
`Return`  
`Return`  
`Return to 0`

The condition is: `variable !== undefined && variable !== null && variable !== ""`  
If the condition is met, the first value is used. If not, the second value is used. The first value is required. If the second value is omited, it will be consider as an empty string.

Here's an exemple where the second option is explicit. In the JSON translation file:

`"returnButton": "Return{{ x?, to {{ x }}, back }}"`

If then you call:

`t("returnButton", { x: "Home" })`  
`t("returnButton", { x: undefined })`

It will produce

`Return to Home`  
`Return back`