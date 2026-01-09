import type p5 from "p5";

export const prompt = "Crazy automata";

const gridSize = 50;
const combustionChance = 0.03;

interface Cell {
  alive: boolean;
  color: p5.Color;
  rotation: number;
  nextAlive: boolean;
  nextColor: p5.Color;
}

let grid: Cell[][] = [];
let cellSize: number;
let cols: number;
let rows: number;

export function setup(sketch: p5) {
  sketch.createCanvas(sketch.width, sketch.height);
  sketch.frameRate(10);

  cols = gridSize;
  rows = gridSize;

  cellSize = sketch.width / cols;
  rows = Math.ceil(sketch.height / cellSize);

  initializeGrid(sketch);
}

function initializeGrid(sketch: p5) {
  grid = [];
  const defaultColor = sketch.color(0, 0, 255);

  for (let x = 0; x < cols; x++) {
    grid[x] = [];
    for (let y = 0; y < rows; y++) {
      grid[x][y] = {
        alive: false,
        color: defaultColor,
        rotation: Math.floor(sketch.random(4)),
        nextAlive: false,
        nextColor: defaultColor,
      };
    }
  }

  const midX = Math.floor(cols / 2);
  const midY = Math.floor(rows / 2);

  if (midX < cols && midY < rows) {
    grid[midX][midY].alive = true;
    grid[midX][midY].nextAlive = true;
  }
  if (midX + 1 < cols && midY + 1 < rows) {
    grid[midX + 1][midY + 1].alive = true;
    grid[midX + 1][midY + 1].nextAlive = true;
  }
}

export function draw(sketch: p5) {
  sketch.background(0);
  sketch.noFill();
  sketch.strokeWeight(2);

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const cell = grid[x][y];
      if (cell.alive) {
        sketch.stroke(cell.color);
        drawCell(sketch, x, y, cellSize);
      }
    }
  }

  updateGrid(sketch);
}

function drawCell(sketch: p5, x: number, y: number, size: number) {
  const px = x * size + size / 2;
  const py = y * size + size / 2;
  const d = size;
  sketch.arc(px, py, d, d, 0, 2 * sketch.PI);
}

function updateGrid(sketch: p5) {
  const defaultColor = sketch.color(0, 100, 255);

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const cell = grid[x][y];
      const neighbours = countNeighbours(x, y);

      if (cell.alive) {
        cell.nextColor = cell.color;
      } else {
        cell.nextColor = defaultColor;
      }
      cell.nextAlive = neighbours === 2;

      if (!cell.alive && cell.nextAlive) {
        const parents: p5.Color[] = [];
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const col = (x + i + cols) % cols;
            const row = (y + j + rows) % rows;
            if (grid[col][row].alive) {
              parents.push(grid[col][row].color);
            }
          }
        }
        if (parents.length > 0) {
          cell.nextColor = sketch.random(parents);
        }
      }
    }
  }

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const cell = grid[x][y];

      if (cell.alive && !cell.nextAlive) {
        if (sketch.random() < combustionChance) {
          const combustionColor = sketch.color(
            sketch.random(100, 255),
            sketch.random(50, 255),
            sketch.random(100, 255),
          );

          const neighbours: { x: number; y: number }[] = [];
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue;
              neighbours.push({
                x: (x + i + cols) % cols,
                y: (y + j + rows) % rows,
              });
            }
          }

          const selectedNeighbours = sketch.shuffle(neighbours).slice(0, 3) as {
            x: number;
            y: number;
          }[];

          for (const position of selectedNeighbours) {
            const neighbour = grid[position.x][position.y];
            neighbour.nextAlive = true;
            neighbour.nextColor = combustionColor;
          }
        }
      }
    }
  }

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      grid[x][y].alive = grid[x][y].nextAlive;
      grid[x][y].color = grid[x][y].nextColor;
    }
  }
}

function countNeighbours(x: number, y: number): number {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const col = (x + i + cols) % cols;
      const row = (y + j + rows) % rows;
      if (grid[col][row].alive) {
        sum++;
      }
    }
  }
  return sum;
}
