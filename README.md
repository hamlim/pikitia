# `pikitia`

A minimal wrapper around satori to generate images using React!

_Note:_ This library is meant for use in one-off scripts / build time image generation, and isn't meant for usage at runtime like `@vercel/og` or similar libraries.

## Getting Started:

```bash
bun add pikitia
```

### Usage:

```tsx
import { generateImage } from "pikitia";

let pngBuffer = await generateImage(
  <div
    style={{
      display: "flex",
      flexDirection: "column",
    }}
  >
    <h1>Hello World! 👋</h1>
    <p>Image generation via JSX</p>
  </div>,
  {
    width: 1200,
    height: 600,
  },
);

// write the pngBuffer to a file
Bun.write('./my-png.png', pngBuffer);
```


## Contributing:

TODO

## Thanks:

This library depends on the following:

- [Satori](https://github.com/vercel/satori) for transforming JSX to an SVG
- [resvg-js](https://github.com/thx/resvg-js) for transforming SVG to a PNG
- [Inter](https://rsms.me/inter/) as a default font
- [twemoji](https://github.com/jdecked/twemoji) v16 as a default emoji font