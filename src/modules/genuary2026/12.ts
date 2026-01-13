import type p5 from "p5";

export const prompt = "Boxes only";

export function setup(sketch: p5) {
  sketch.noLoop();
  sketch.strokeWeight(0.5);
  sketch.rectMode(sketch.CENTER);
}

export function draw(sketch: p5) {
  sketch.background(sketch.color(15, 25, 45));

  const stepSize = Math.ceil(sketch.width / 20);

  for (let i = stepSize / 2; i <= sketch.width + stepSize / 2; i += stepSize) {
    for (
      let j = stepSize / 2;
      j <= sketch.height + stepSize / 2;
      j += stepSize
    ) {
      const factor = j / sketch.height;
      drawBox(sketch, i, j, stepSize * 0.5, stepSize * 0.5, factor);
    }
  }
}

function drawBox(
  sketch: p5,
  x: number,
  y: number,
  length: number,
  height: number,
  factor: number,
) {
  const w = length * (1 + sketch.random(-0.5, 0.5) * factor);
  const h = height * (1 + sketch.random(-0.5, 0.5) * factor);
  const ox = sketch.random(-length * 0.5, length * 0.5) * factor;
  const oy = sketch.random(-height * 0.5, height * 0.5) * factor;
  const angle = sketch.random(-Math.PI / 6, Math.PI / 6) * factor;

  const points = [
    { x: -w / 2, y: -w / 2, z: -h / 2 },
    { x: w / 2, y: -w / 2, z: -h / 2 },
    { x: w / 2, y: w / 2, z: -h / 2 },
    { x: -w / 2, y: w / 2, z: -h / 2 },
    { x: -w / 2, y: -w / 2, z: h / 2 },
    { x: w / 2, y: -w / 2, z: h / 2 },
    { x: w / 2, y: w / 2, z: h / 2 },
    { x: -w / 2, y: w / 2, z: h / 2 },
  ];

  const faces = [
    [4, 5, 6, 7],
    [1, 2, 6, 5],
    [2, 3, 7, 6],
  ];

  sketch.push();
  sketch.translate(x + ox, y + oy);
  sketch.rotate(angle);

  const projected = points.map((p) => ({
    x: (p.x - p.y) * Math.cos(Math.PI / 6),
    y: (p.x + p.y) * Math.sin(Math.PI / 6) - p.z,
  }));

  sketch.fill(15, 25, 45);
  sketch.stroke(sketch.color(225, 198, 153));
  for (const face of faces) {
    sketch.beginShape();
    for (const idx of face) {
      sketch.vertex(projected[idx].x, projected[idx].y);
    }
    sketch.endShape(sketch.CLOSE);
  }
  sketch.pop();
}
