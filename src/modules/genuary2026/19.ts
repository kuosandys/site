import type p5 from "p5";

export const prompt = "16x16";

export function setup(sketch: p5) {
  sketch.noLoop();
}

export function draw(sketch: p5) {
  sketch.background(8, 12, 25);

  const mainRadius = sketch.width * 0.4;
  const subRadius = sketch.width * 2;

  const endpoints = drawLines(
    sketch,
    sketch.width / 2,
    sketch.height / 2,
    mainRadius,
    0,
  );

  for (const point of endpoints) {
    drawLines(
      sketch,
      point.x,
      point.y,
      subRadius,
      point.angle + sketch.random(sketch.TWO_PI),
    );
  }
}

function drawLines(
  sketch: p5,
  x: number,
  y: number,
  baseRadius: number,
  rotationOffset: number,
): { x: number; y: number; angle: number }[] {
  const endpoints: { x: number; y: number; angle: number }[] = [];

  for (let i = 0; i < 8; i++) {
    const baseAngle = (i * Math.PI) / 8 + rotationOffset;

    const angle = baseAngle + sketch.random(-0.2, 0.2);

    const r1 = baseRadius * (1 + sketch.random(-0.2, 0.2));
    const r2 = baseRadius * (1 + sketch.random(-0.2, 0.2));

    const x1 = x + Math.cos(angle) * r1;
    const y1 = y + Math.sin(angle) * r1;
    const x2 = x - Math.cos(angle) * r2;
    const y2 = y - Math.sin(angle) * r2;

    sketch.strokeWeight(2);
    sketch.blendMode(sketch.ADD);
    sketch.stroke(sketch.color(100, 150, 180, 100));
    sketch.line(x1, y1, x2, y2);

    endpoints.push({ x: x1, y: y1, angle: angle });
    endpoints.push({ x: x2, y: y2, angle: angle + Math.PI });
  }

  return endpoints;
}
