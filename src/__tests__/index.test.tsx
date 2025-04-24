import { expect, test } from "bun:test";
import { generateImage } from "../index";

test("it generates an image", async () => {
  let image = await generateImage(
    <div style={{ display: "flex" }}>Hello, world!</div>,
    {
      width: 100,
      height: 100,
    },
  );
  await Bun.write("./public/test.png", image);
  expect(Bun.file("./public/test.png").size).toBeGreaterThan(0);
});
