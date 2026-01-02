import type p5 from "p5";

let lastDrawnSliceIndex = -1;

export function setup(sketch: p5) {
  sketch.frameRate(20);
  sketch.background(20, 30, 50);
  sketch.colorMode(sketch.HSB, 360, 100, 100);
}

export function draw(sketch: p5) {
  const centerX = sketch.width / 2;
  const centerY = sketch.height / 2;
  const maxRadius =
    Math.sqrt(Math.pow(sketch.width / 2, 2) + Math.pow(sketch.height / 2, 2)) *
    1.1;

  const bezierValues: number[] = [];
  for (let i = 0; i < 50; i++) {
    const t = i / 49;
    const spacingRate =
      t <= 0.5
        ? sketch.bezierPoint(1, 10, 30, 100, t * 2)
        : sketch.bezierPoint(100, 30, 10, 1, (t - 0.5) * 2);
    bezierValues.push(spacingRate);
  }

  const totalSpacing = bezierValues.reduce((sum, val) => sum + val, 0);
  const scaleFactor = (2 * Math.PI) / totalSpacing;

  let currentAngle = -Math.PI / 2;
  const angles: number[] = [currentAngle];
  for (let i = 0; i < bezierValues.length - 1; i++) {
    currentAngle += bezierValues[i] * scaleFactor;
    angles.push(currentAngle);
  }

  const minSpacing = Math.min(...bezierValues);
  const maxSpacing = Math.max(...bezierValues);
  const bezierRange = maxSpacing - minSpacing;

  const cumulativeInvertedSpacing: number[] = [0];
  let cumulative = 0;
  for (let i = 0; i < bezierValues.length; i++) {
    const invertedValue =
      bezierRange > 0 ? maxSpacing - bezierValues[i] + minSpacing : 1;
    cumulative += invertedValue;
    cumulativeInvertedSpacing.push(cumulative);
  }

  const currentFrame = sketch.frameCount % 60;
  const linearProgress = currentFrame / 60;
  const targetCumulativeInvertedSpacing =
    linearProgress *
    cumulativeInvertedSpacing[cumulativeInvertedSpacing.length - 1];

  let currentSliceIndex = 0;
  for (let i = 0; i < cumulativeInvertedSpacing.length - 1; i++) {
    if (cumulativeInvertedSpacing[i + 1] >= targetCumulativeInvertedSpacing) {
      currentSliceIndex = i;
      break;
    }
  }
  currentSliceIndex = Math.min(currentSliceIndex, 49);

  const startIndex = Math.max(0, lastDrawnSliceIndex + 1);
  const endIndex = Math.min(currentSliceIndex, angles.length - 1);

  for (let i = startIndex; i <= endIndex; i++) {
    const currentAngle = angles[i];
    const nextAngle =
      i < angles.length - 1 ? angles[i + 1] : angles[0] + 2 * Math.PI;
    const midAngle = (currentAngle + nextAngle) / 2;

    const normalizedCurrentBezierValue =
      bezierRange > 0 ? (bezierValues[i] - minSpacing) / bezierRange : 0;
    const hue = 200 + normalizedCurrentBezierValue * 120;

    sketch.stroke(sketch.color(hue, 39, 64));
    sketch.strokeWeight(1);
    sketch.noFill();

    const sizeFactor = 0.5 + (bezierValues[i] - minSpacing) / bezierRange;
    const baseCircleSize = ((maxRadius - 0) / 8) * sizeFactor;

    for (let j = 0; j < 5; j++) {
      const t = (j + 0.5) / 5;
      const baseRadius = 0 + (maxRadius - 0) * t;
      const circleSize = baseCircleSize * (0.8 + t * 0.4);

      let circleAngle = midAngle;
      let circleRadius = baseRadius;

      circleAngle +=
        (sketch.random() - 0.5) * 0.3 * normalizedCurrentBezierValue;
      circleRadius +=
        (sketch.random() - 0.5) *
        circleSize *
        0.5 *
        normalizedCurrentBezierValue;

      const circleX = centerX + Math.cos(circleAngle) * circleRadius;
      const circleY = centerY + Math.sin(circleAngle) * circleRadius;

      sketch.push();
      sketch.translate(circleX, circleY);

      const stretchDirection = sketch.random() > 0.5 ? 1 : -1;
      const stretchAmount = normalizedCurrentBezierValue * sketch.random();

      const ellipseStretchX =
        stretchDirection > 0
          ? 1.0 + stretchAmount * 1.5
          : 1.0 - stretchAmount * 0.2;
      const ellipseStretchY =
        stretchDirection > 0
          ? 1.0 - stretchAmount * 0.2
          : 1.0 + stretchAmount * 1.5;

      sketch.rotate(
        sketch.random() * (Math.PI / 4) * normalizedCurrentBezierValue,
      );
      sketch.ellipse(
        0,
        0,
        circleSize * ellipseStretchX,
        circleSize * ellipseStretchY,
      );
      sketch.pop();
    }
  }

  lastDrawnSliceIndex = currentSliceIndex;

  if (currentFrame === 0) {
    sketch.colorMode(sketch.RGB, 255);
    sketch.clear();
    sketch.background(20, 30, 50);
    sketch.colorMode(sketch.HSB, 360, 100, 100);
    lastDrawnSliceIndex = -1;
  }
}
