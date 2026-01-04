import type p5 from "p5";

let img: p5.Image | null = null;

export function setup(sketch: p5) {
  sketch.loadImage("/data/baymax.jpg", (loadedImg) => {
    img = loadedImg;
    sketch.redraw();
  });
  sketch.noLoop();
}

export function draw(sketch: p5) {
  if (!img) return;
  sketch.background(240, 240, 235);

  const stitchSize = 10;
  const halfStitch = stitchSize / 2;

  const cols = Math.ceil(sketch.width / stitchSize);
  const rows = Math.ceil(sketch.height / stitchSize);

  sketch.strokeCap(sketch.ROUND);
  sketch.strokeWeight(3);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const imageX = Math.floor(x * stitchSize * (img.width / sketch.width));
      const imageY = Math.floor(y * stitchSize * (img.height / sketch.height));

      const baseX = x * stitchSize + halfStitch;
      const baseY = y * stitchSize + halfStitch;

      const centerX = baseX + (sketch.random() - 0.5) * 0.2 * stitchSize;
      const centerY = baseY + (sketch.random() - 0.5) * 0.2 * stitchSize;
      const randomRotation = (sketch.random() - 0.5) * 12;

      sketch.stroke(img.get(imageX, imageY));

      sketch.push();
      sketch.translate(centerX, centerY);
      sketch.rotate(sketch.radians(randomRotation));

      sketch.line(-halfStitch, -halfStitch, halfStitch, halfStitch);
      sketch.line(halfStitch, -halfStitch, -halfStitch, halfStitch);
      sketch.pop();
    }
  }
}
