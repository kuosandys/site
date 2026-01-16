import type p5 from "p5";

export const prompt = "Order and disorder";

export function setup(sketch: p5) {
  sketch.noLoop();
}

export function draw(sketch: p5) {
  sketch.background(250, 250, 250);

  const rowsCount = 3;
  const linesCount = sketch.width * 0.2;
  const lineHeight = sketch.height * 0.08;
  const padding = sketch.width * 0.12;
  const spacing = (sketch.width - padding * 2) / (linesCount - 1);

  const colors = [
    sketch.color(0, 255, 255),
    sketch.color(255, 0, 255),
    sketch.color(255, 255, 0),
  ];

  sketch.strokeWeight(2);
  sketch.noFill();
  sketch.blendMode(sketch.MULTIPLY);

  for (let row = 0; row < rowsCount; row++) {
    const baseY = (sketch.height * (row + 1)) / (rowsCount + 1);

    for (let i = 0; i < linesCount; i++) {
      const baseX = padding + i * spacing;
      const progress = i / (linesCount - 1);

      const disorderFactor = Math.pow(progress, 4);

      const maxOffsetX = sketch.width * 0.15 * disorderFactor;
      const maxOffsetY = sketch.height * 0.25 * disorderFactor;
      const maxAngle = Math.PI * 1.5 * disorderFactor;
      const baseSlant = 0.05;

      for (let j = 0; j < 3; j++) {
        sketch.push();
        sketch.stroke(colors[j]);

        const angle = baseSlant + sketch.random(-maxAngle, maxAngle);
        const offsetX = sketch.random(-maxOffsetX, maxOffsetX);
        const offsetY = sketch.random(-maxOffsetY, maxOffsetY);

        const x = baseX + offsetX;
        const y = baseY + offsetY;

        sketch.translate(x, y);
        sketch.rotate(angle);
        sketch.line(0, -lineHeight / 2, 0, lineHeight / 2);
        sketch.pop();
      }
    }
  }
}
