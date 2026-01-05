import type p5 from "p5";

export const prompt = "One color, one shape";

interface Point {
  x: number;
  y: number;
}

function generateTessellationShapeTemplate(sketch: p5, size: number): Point[] {
  const baseVertices: Point[] = [
    { x: 0, y: -size * 1.5 },
    { x: size, y: 0 },
    { x: 0, y: size },
    { x: -size, y: 0 },
  ];

  const shapePoints: Point[] = [];
  const numEdgePoints = 6;
  const maxOffsetRange = 0.2;

  const edgeOffsets: number[][] = [];

  for (let i = 0; i < 2; i++) {
    edgeOffsets[i] = [];
    for (let j = 1; j <= numEdgePoints; j++) {
      const t = j / (numEdgePoints + 1);
      const tScaled = 4 * t * (1 - t);
      const safeOffsetRange = maxOffsetRange * tScaled;
      const offset = sketch.random(-safeOffsetRange, safeOffsetRange);
      edgeOffsets[i].push(offset);
    }
  }

  edgeOffsets[2] = [];
  for (let j = 0; j < numEdgePoints; j++) {
    edgeOffsets[2].push(-edgeOffsets[0][numEdgePoints - 1 - j]);
  }

  edgeOffsets[3] = [];
  for (let j = 0; j < numEdgePoints; j++) {
    edgeOffsets[3].push(-edgeOffsets[1][numEdgePoints - 1 - j]);
  }

  for (let i = 0; i < baseVertices.length; i++) {
    const start = baseVertices[i];
    const end = baseVertices[(i + 1) % baseVertices.length];

    shapePoints.push(start);

    for (let j = 1; j <= numEdgePoints; j++) {
      const t = j / (numEdgePoints + 1);
      const randomOffset = edgeOffsets[i][j - 1];

      const edgeX = sketch.lerp(start.x, end.x, t);
      const edgeY = sketch.lerp(start.y, end.y, t);

      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const edgeLength = sketch.sqrt(dx * dx + dy * dy);

      const perpX = -dy / edgeLength;
      const perpY = dx / edgeLength;

      const offsetDistance = edgeLength * randomOffset;
      const offsetX = edgeX + perpX * offsetDistance;
      const offsetY = edgeY + perpY * offsetDistance;

      shapePoints.push({ x: offsetX, y: offsetY });
    }
  }

  return shapePoints;
}

function drawShape(
  sketch: p5,
  points: Point[],
  centerX: number,
  centerY: number,
  fillColor: p5.Color,
) {
  sketch.fill(fillColor);
  sketch.strokeWeight(0);

  sketch.push();
  sketch.translate(centerX, centerY);
  sketch.beginShape();
  for (const point of points) {
    sketch.vertex(point.x, point.y);
  }
  sketch.endShape(sketch.CLOSE);
  sketch.pop();
}

export function setup(sketch: p5) {
  sketch.frameRate(1);
}

export function draw(sketch: p5) {
  sketch.clear();
  sketch.background(0, 0);

  const canvasSize = sketch.min(sketch.width, sketch.height);
  const shapeSize = canvasSize / 20;

  const tileSizeX = 2 * shapeSize;
  const tileSizeY = 2.5 * shapeSize;

  const minRow = Math.floor(tileSizeY / tileSizeY);
  const maxRow = Math.floor(sketch.height / tileSizeY);

  const minCol = Math.floor(tileSizeX / tileSizeX);
  const maxCol = Math.floor(sketch.width / tileSizeX);

  const shapeTemplate = generateTessellationShapeTemplate(sketch, shapeSize);
  const fillColor = sketch.color(100, 145, 164);

  for (let row = minRow; row < maxRow; row++) {
    for (let col = minCol; col < maxCol; col++) {
      const centerX = col * tileSizeX;
      const centerY = row * tileSizeY;

      drawShape(sketch, shapeTemplate, centerX, centerY, fillColor);
    }
  }
}
