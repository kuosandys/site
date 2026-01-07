import type p5 from "p5";

export const prompt = `Boolean algebra`;

const gridSize = 20;
let walkerX: number;
let walkerY: number;
let walkerColor: p5.Color;
const grid = new Map();
let lastDirection = -1;

export function setup(sketch: p5) {
  walkerX = Math.floor(gridSize / 2);
  walkerY = Math.floor(gridSize / 2);
  walkerColor = sketch.color(
    sketch.random(100, 255),
    sketch.random(100, 255),
    sketch.random(100, 255),
  );

  const numSquares = sketch.floor(sketch.random(60, 81));
  for (let i = 0; i < numSquares; i++) {
    const x = sketch.floor(sketch.random(gridSize));
    const y = sketch.floor(sketch.random(gridSize));
    if (x === walkerX && y === walkerY) continue;

    grid.set(
      `${x},${y}`,
      sketch.color(
        sketch.random(100, 255),
        sketch.random(100, 255),
        sketch.random(100, 255),
      ),
    );
  }

  sketch.frameRate(20);
}

export function draw(sketch: p5) {
  const cellSize = sketch.width / gridSize;
  sketch.background(240);
  sketch.noStroke();

  for (const [key, col] of grid.entries()) {
    const [x, y] = key.split(",").map(Number);
    sketch.fill(col);
    sketch.rect(x * cellSize, y * cellSize, cellSize, cellSize);
  }

  const key = `${walkerX},${walkerY}`;
  const currentColor = grid.get(key);

  if (currentColor) {
    walkerColor = currentColor;
    grid.delete(key);
  } else {
    grid.set(key, walkerColor);
  }

  sketch.fill(walkerColor);
  sketch.rect(walkerX * cellSize, walkerY * cellSize, cellSize, cellSize);

  const oppositeDirection = lastDirection >= 0 ? (lastDirection + 2) % 4 : -1;
  let direction = sketch.floor(sketch.random(4));

  while (direction === oppositeDirection) {
    direction = sketch.floor(sketch.random(4));
  }

  lastDirection = direction;

  switch (direction) {
    case 0:
      walkerY = (walkerY - 1 + gridSize) % gridSize;
      break;
    case 1:
      walkerX = (walkerX + 1) % gridSize;
      break;
    case 2:
      walkerY = (walkerY + 1) % gridSize;
      break;
    case 3:
      walkerX = (walkerX - 1 + gridSize) % gridSize;
      break;
  }
}
