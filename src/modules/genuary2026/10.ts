import type p5 from "p5";

export const prompt = "Polar coordinates";

export function setup(sketch: p5) {
  sketch.noLoop();
}

export function draw(sketch: p5) {
  sketch.background(100, 80, 148);
  sketch.noFill();
  sketch.stroke(150, 180, 250);
  sketch.strokeWeight(1);

  const minStepLength = 1;
  const maxRadius =
    Math.sqrt(sketch.width * sketch.width + sketch.height * sketch.height) / 2 +
    minStepLength;

  let currentRadius = 0;
  let currentAngle = 0;
  let isClockwise = true;

  while (currentRadius < maxRadius) {
    const targetAngle = sketch.random(sketch.TWO_PI);

    sketch.arc(
      sketch.width / 2,
      sketch.height / 2,
      currentRadius * 2,
      currentRadius * 2,
      isClockwise ? targetAngle : currentAngle,
      isClockwise ? currentAngle : targetAngle,
    );
    currentAngle = targetAngle;
    isClockwise = !isClockwise;

    const nextRadius = currentRadius + minStepLength + sketch.random(1, 5);
    sketch.line(
      sketch.width / 2 + currentRadius * sketch.cos(currentAngle),
      sketch.height / 2 + currentRadius * sketch.sin(currentAngle),
      sketch.width / 2 + nextRadius * sketch.cos(currentAngle),
      sketch.height / 2 + nextRadius * sketch.sin(currentAngle),
    );

    currentRadius = nextRadius;
  }

  currentRadius = 0;
  currentAngle = 0;
  isClockwise = true;
  sketch.stroke(100, 10, 25);

  while (currentRadius < maxRadius) {
    const targetAngle = sketch.random(sketch.TWO_PI);

    sketch.arc(
      sketch.width / 2,
      sketch.height / 2,
      currentRadius * 2,
      currentRadius * 2,
      isClockwise ? targetAngle : currentAngle,
      isClockwise ? currentAngle : targetAngle,
    );
    currentAngle = targetAngle;
    isClockwise = !isClockwise;

    const nextRadius = currentRadius + minStepLength + sketch.random(1, 5);
    sketch.line(
      sketch.width / 2 + currentRadius * sketch.cos(currentAngle),
      sketch.height / 2 + currentRadius * sketch.sin(currentAngle),
      sketch.width / 2 + nextRadius * sketch.cos(currentAngle),
      sketch.height / 2 + nextRadius * sketch.sin(currentAngle),
    );

    currentRadius = nextRadius;
  }
}
