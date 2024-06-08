# Accord's Library

## Tech overview

- Client-side framework: None
- Web framework / server: [Astro](https://astro.build)
- Content management system: [Payload](https://payloadcms.com)
- Database: MongoDB

## Core

- https://resilientwebdesign.com/

Accord's Library v3.0 (shorten to AL3.0) follows the Metamodernist Web model described by Frédéric Bonnet in his article [From Classicism to Metamodernism — A Short History of Web Development](https://dev.to/fredericbonnet/the-third-age-of-web-development-kgj#the-metamodernist-period).

- Embrace web standards instead of reinventing the wheel
- [Progressive enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement): SSG or SSR for noscript clients. SPA-like enhancements such as partial page updates and view transitions for clients with JS support.
- Mimimal dependencies. Dependencies can be self-hosted or loaded directly from CDNs instead of being bundled up.
- Accessible, fast, lightweight, substainable
- Complexity is moved away from client devices

## Focal points

- Progressive enhancement / Graceful degradation

  - Fully functional without JS
    - Only use JS for non-essential features
    - When JS is not available, hide / fallback impacted elements
  - Reading mode / Reader view support
  - Print-able
    - Remove interactable / navigational elements
    - Simplify layout and design
    - Remove background images/colors

- Accessibility (read: https://webaim.org):

  - Keyboard navigation
  - Hotkeys when applicable

- Respect user preferences

  - Support for prefers-reduced-transparency, prefers-contrast, and prefers-reduced-motion
  - Theme switch: light, dark, auto
  - Language and currency selection

- Multilingual

  - Contents can be available in any number of languages
  - Language specific URLs, subdirectories with gTLD e.g: accords-library.com/fr/...
  - Visitors can manually select their preferred language (which also affect the UI language)
  - For each content, visitors can see which languages are available, and are able to temporarily see it in another language without changing their UI language.
  - By default, the best matching language will be presented to the user:
    1. Consider the visitor’s explicit preferences
    2. Imply the visitor’s preferences using Accept-Language HTTP header
    3. Consider the language-specific URL
    4. If all fail, fallback to default language (English)
  - The CJK languages (Chinese, Japanese, Korean) all uses Chinese ideographs. Some of these ideographs are drawn different in their respective languages, despite being encoded under the same Unicode character. In order to display the character correctly, a different font must be used depending on the content's language. Here are the fonts used:
    - `Noto Sans JP` and `Noto Serif JP` for Japanese content
    - `Noto Sans SC` and `Noto Serif SC` for Simplified Chinese content
    - `Noto Sans` and `Noto Serif` for everything else.

- Fast

  - Barely any JS
  - Simple design
  - Responsive images
    - Multiple image sizes provided (srcset and sizes attributes)
    - Lazy loaded
    - Space reservation to reduce Cumulative Layout Shift
    - Use of efficient formats (mostly WebP) and meaningful quality settings
  - Server side rendered (both good and bad for speed)
    - Reduced data transfer
    - Reduced client-side complexity
    - Would require edge computing to reduce latency
  - Astro built-in View transitions and client-side navigation
  - Some data caching between the web server and CMS (to be improved)

- SEO

  - Good defaults for the metadata and OpenGraph properties
  - Each page can provide a custom title, description, thumbnail, video, audio to be used
  - Each language variants are indexes seperately.

- Complexity
  - The complexity should be moved away from public-facing parts of the codebase
  - The CMS should handle most of the complexity:
    - Check for data completeness and conformity
    - Provides a ready-to-use type-safe SDK to the web framework
  - The Web framework should only worry about presentation
    - Handle different browsers
    - Respect user preferences
    - Handle user interactions
  - On the client device, there should be minimal complexity
    - Handle responsiveness
    - Handle view transitions (if JS is available)
    - Use of web standards: let the browser handle most of the client-side complexity

## Enhancement provided with JavaScript

- Background images

  - Only start the fade-in animation once the image is fully loaded. Without this, the image can suddently appear during the animation (or even after the animation is over) and it doesn't look as nice.

- Navigation

  - Smooth scrolling when using anchor links
  - On image pages (scans, gallery, image files), allow the user to navigate to the previous or next image using keyboard arrows.

- On media pages (scans, images, audios, videos), provide a download button. This way, the user doesn't have to right-click -> "save media as..."

- Partial page reload

  - Allow for temporary language switching on multilingual content.

- Tooltips
  - Quicker access to user settings. Instead of going to a sepeare "settings" page, the user can set their favorite language, theme, and currency from any page.
  - If a page has multiple parent pages, when the user click on the "Go back" button, it will open a tooltip with the list of parent pages. Right now, the parent pages are only displayed to noscript users if there is only one parent page.
  - On the timeline, metadata such as credits, additional notes, language switching are not available to noscript users.

## Browser-specific tricks

### Dotted texture

A dotted texture is displayed on the page background. It uses `background-blend-mode` to blend the image with the background color. This blending mode doesn't seem to work on iOS devices. This dotted texture is currently disabled on iOS devices. Other alternatives could include:

- Removing the effet entirely
- Replacing the image with a transparent image (no need for blending)
- Replacing the image with a non-transparent image where the blending is baked-in
- Check if there are ways to make the blending work on iOS

### Parallax effect

A parallax effect is applied on the webpages' background image. This effect can be a bit demanding, it is disabled on mobiles and tablets to lessen the impact. Other alternatives could include:

- Removing the effet entirely
- Moving away from JavaScript and using CSS parallax tricks (transform 3D, sticky)

## CSS Utility classes

- `.dark-theme`: force dark theming to the element and its children.
- `.light-theme`: force light theming to the element and its children.

- `when-js`: only display element if JavaScript is available
- `when-no-js`: only display element if JavaScript is unavailable

- `when-dark-theme`: only display element if the current theme is dark (manually or automatically)
- `when-light-theme`: only display element if the current theme is light (manually or automatically)

- `when-no-print`: only display when not printing

- `font-serif`: by default, everything use sans-serif. Use this class to make the font serif.
- `font-[size]`: apply size from font size system. Valid sizes are `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`, `4xl`, and `5xl`

- `hide-scrollbar`: hide the element scrollbar
- `texture-dots`: add a background paper like texture to the element
- `high-contrast-text`: add a shadow around the text to increase perceived contrast.
- `prose`: apply typography rules. Useful for main text content
- `error-message`: make the element flash with a red background.

## CSS Component classes

- `pressable-icon`: used to make a SVG/Text look pressable
- `pressable-link`: used to make links look pressable (text with underline)
- `pressable`: used to make a container look pressable

## CSS Global Variables

- `--color-base-X`: the current theme colors. X can be between 0 and 1000, available in increments of 50.
- `--font-size-[size]`: apply size from font size system. Valid sizes are `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`, `4xl`, and `5xl`

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

## Understand Astro's scoped CSS

By default, everything is scoped to the current custom component. This mean you can't style a custom child component.
If you do want to style a custom child component, there are two ways:

- Using :global()
- Passing a class to the child component

Passing a class will enable two things on one element of the child component (typically the root element):

- It will now have the class
- It will also have the parent component CID (Astro's Scope-CSS ID)

### Example

We have two components:

```html
// Component A

<div data-astro-cid-hnifvupa>
  <p>This is Component A</p>
  <ComponentB />
</div>

// Component B

<div data-astro-cid-ywfdi5qi>
  <p>This is Component B</p>
</div>
```

Now if Component A pass a class "test" to Component B:

```html
<div data-astro-cid-hnifvupa>
  <p>This is Component A</p>
  <ComponentB class="test" />
</div>
```

The resulting Component B will be:

```
<div class="test" data-astro-cid-hnifvupa data-astro-cid-ywfdi5qi>
  <p>This is Component B</p>
</div>
```

Things to consider:

- The root element of Component B (the one where we applied the CID) is now in the scope of Component A's CSS.
- The opposite isn't true: Component B's scoped CSS cannot affect Component A.

### Standards for this repo regarding Scope-CSS

- Avoid :global()
- Try to avoid passing a class to custom elements
- If you do, the naming scheme should be `parent_name-child_name`
