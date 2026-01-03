import type p5 from "p5";

function fibonacci(count: number): number[] {
  const fib: number[] = [1, 1];
  for (let i = 2; i < count; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib;
}

export function setup(sketch: p5) {
  sketch.colorMode(sketch.HSB, 360, 100, 100, 100);
  sketch.noLoop();
}

export function draw(sketch: p5) {
  const canvasLength = sketch.width;

  // triadic colours
  const baseHue = sketch.random(360);
  const verticalColor = sketch.color(baseHue, 40, 80, 40);
  const horizontalColor = sketch.color((baseHue + 120) % 360, 50, 70, 40);
  const backgroundColor = sketch.color((baseHue + 240) % 360, 15, 80, 40);

  sketch.background(backgroundColor);

  const sequence = fibonacci(12);
  const scaledSequence = sequence.map((n) => Math.sqrt(n));
  const reversedScaledSequence = [...scaledSequence].reverse();

  const lines: Array<{ position: number; width: number }> = [];
  let currentPosition = 0;

  for (let i = 0; i < scaledSequence.length; i++) {
    lines.push({ position: currentPosition, width: scaledSequence[i] });
    currentPosition += scaledSequence[i];

    if (i < reversedScaledSequence.length - 1) {
      currentPosition += reversedScaledSequence[i];
    }
  }

  const scale = canvasLength / currentPosition;

  for (const line of lines) {
    const endPosition = line.position * scale;
    const width = line.width * scale;
    if (endPosition < canvasLength) {
      const drawSize = Math.min(width, canvasLength - endPosition);
      sketch.fill(verticalColor);
      sketch.noStroke();
      sketch.rect(endPosition, 0, drawSize, canvasLength);
      sketch.fill(horizontalColor);
      sketch.noStroke();
      sketch.rect(0, endPosition, canvasLength, drawSize);
    }
  }
}
