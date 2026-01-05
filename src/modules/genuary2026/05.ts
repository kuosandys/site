import type p5 from "p5";

export const prompt = `Write "Genuary". Avoid using a font.`;

const letters: number[][][] = [
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
];

interface MovingZone {
  x: number;
  width: number;
  speed: number;
  direction: number;
}

const movingZones: Map<number, MovingZone[]> = new Map();
const columnColors: Map<number, [number, number, number]> = new Map();

export function setup(sketch: p5) {
  sketch.background(0, 100, 255);
}

export function draw(sketch: p5) {
  const letterWidth = 5;
  const letterHeight = 7;
  const numLetters = letters.length;
  const letterSpacing = sketch.width * 0.02;
  const cellSize = Math.min(
    (sketch.width - (numLetters - 1) * letterSpacing) /
      (numLetters * letterWidth),
    sketch.height / letterHeight,
  );
  const startX =
    (sketch.width -
      (numLetters * letterWidth * cellSize +
        (numLetters - 1) * letterSpacing)) /
    2;
  const startY = (sketch.height - letterHeight * cellSize) / 2;

  for (let letterIndex = 0; letterIndex < letters.length; letterIndex++) {
    const letter = letters[letterIndex];
    for (let rowIndex = 0; rowIndex < letter.length; rowIndex++) {
      const row = letter[rowIndex];
      let hasCell = false;
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        if (row[colIndex] === 1) {
          hasCell = true;
          if (!columnColors.has(colIndex)) {
            const r = Math.random();
            columnColors.set(colIndex, r < 0.5 ? [255, 0, 146] : [0, 153, 255]);
          }
        }
      }
      if (hasCell && !movingZones.has(rowIndex)) {
        const zones: MovingZone[] = [];
        const numZones = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numZones; i++) {
          const width = sketch.width * (0.2 + Math.random() * 0.2);
          const speed = 10 + Math.random() * 10;
          const direction = Math.random() < 0.5 ? 1 : -1;
          const x =
            direction === 1
              ? -width + (sketch.width / numZones) * i
              : sketch.width + width - (sketch.width / numZones) * i;
          zones.push({ x, width, speed, direction });
        }
        movingZones.set(rowIndex, zones);
      }
    }
  }

  for (const zones of movingZones.values()) {
    for (let i = 0; i < zones.length; i++) {
      const zone = zones[i];
      zone.x += zone.speed * 2.5 * zone.direction;
      if (zone.direction === 1 && zone.x > sketch.width) zone.x = -zone.width;
      else if (zone.direction === -1 && zone.x + zone.width < 0)
        zone.x = sketch.width;
    }
  }

  sketch.fill(0);
  sketch.noStroke();
  sketch.rect(0, 0, sketch.width, sketch.height);

  for (let letterIndex = 0; letterIndex < letters.length; letterIndex++) {
    const letter = letters[letterIndex];
    for (let rowIndex = 0; rowIndex < letter.length; rowIndex++) {
      const row = letter[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        if (row[colIndex] === 1) {
          const x =
            startX +
            letterIndex * (letterWidth * cellSize + letterSpacing) +
            colIndex * cellSize +
            cellSize / 2;
          const y = startY + rowIndex * cellSize + cellSize / 2;
          const zones = movingZones.get(rowIndex);
          let isInZone = false;
          if (zones) {
            for (let i = 0; i < zones.length; i++) {
              const zone = zones[i];
              if (x >= zone.x && x <= zone.x + zone.width) {
                isInZone = true;
                break;
              }
            }
          }
          const color = columnColors.get(colIndex);
          if (isInZone && color) sketch.fill(color[0], color[1], color[2]);
          else sketch.fill(0);
          sketch.circle(x, y, cellSize * 0.8);
        }
      }
    }
  }
}
