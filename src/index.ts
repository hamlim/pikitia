import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import type { ReactNode } from "react";
import satori, {
  type SatoriOptions,
  type Font as FontOptions,
  type SatoriNode,
} from "satori";

let __dirname = fileURLToPath(path.dirname(import.meta.url));

let interBuffer = readFileSync(
  path.join(
    __dirname,
    // up out of src/dist dirs
    "..",
    "assets",
    "inter-regular.ttf",
  ),
);

let inter = {
  name: "Inter",
  data: interBuffer.buffer.slice(
    interBuffer.byteOffset,
    interBuffer.byteOffset + interBuffer.byteLength,
  ) as ArrayBuffer,
  weight: 400,
  style: "normal",
} as const;

async function defaultLoadAdditionalAsset(code: string, segment: string) {
  if (code === "emoji") {
    // if segment is an emoji
    let svgText = readFileSync(
      path.join(
        __dirname,
        // up out of src/dist dirs
        "..",
        "assets",
        "emoji",
        `${segment.codePointAt(0)?.toString(16)}.svg`,
      ),
    ).toString();
    let svgBuf = Buffer.from(svgText).toString("base64");
    return `data:image/svg+xml;base64,${svgBuf}`;
  }

  return `missing-segment - ${code} - ${segment}`;
}

type Options = (
  | {
      width: number;
      height: number;
    }
  | {
      width: number;
    }
  | {
      height: number;
    }
) & {
  fonts?: FontOptions[];
  embedFont?: boolean;
  debug?: boolean;
  graphemeImages?: Record<string, string>;
  loadAdditionalAsset?: (
    languageCode: string,
    segment: string,
  ) => Promise<string | Array<FontOptions>>;
  tailwindConfig?: SatoriOptions["tailwindConfig"];
  onNodeDetected?: (node: SatoriNode) => void;
};

export async function generateImage(
  element: ReactNode,
  options: Options,
): Promise<Buffer> {
  let svg = await satori(element, {
    ...options,
    fonts: options.fonts ? [...options.fonts, inter] : [inter],
    loadAdditionalAsset:
      options.loadAdditionalAsset ?? defaultLoadAdditionalAsset,
  } as SatoriOptions);

  let resvg = new Resvg(svg, {});
  let pngData = resvg.render();
  let pngBuffer = pngData.asPng();

  return pngBuffer;
}
