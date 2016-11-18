# mnfst.js
A polyfill for W3C's web app manifest.

## Reasoning
As of writing only Chrome 38+ for Android supports W3C's [web app manifest](https://www.w3.org/TR/appmanifest/) spec. That means for full support across browsers you are stuck using the old browser-specific `<meta>` and `<link>` tags. This purpose of this polyfill is to alleviate that inconvenience.

## Features
- Support for common browsers:
    - Chrome 38+ for Android
    - Browser for Android
    - Safari for iOS 2.1+
    - IE 9+ for Windows 7+ ("pinned sites")
- Safe to include in unsupported browsers.
- No library dependencies.
- Support for common manifest members:
    - name
    - short_name
    - icons
    - display
    - theme_color
    - start_url
- Support for an arbitrary number of any size icons.
    - You should still follow recommended icon sizes for the best browser support.
    - Some browsers expect certain sizes, like Microsoft's pinned sites.
- Support for manifest files not in the server root.

## Usage
1. Link your manifest file like normal:
```html
<link rel="manifest" href="manifest.json">
```
2. Include this polyfill:
```html
<script type="text/javascript" src="mnfst.min.js"></script>
```
