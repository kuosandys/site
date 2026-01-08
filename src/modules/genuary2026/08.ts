import type p5 from "p5";

export const prompt = "Generative metropolis";

type Color = {
  background: p5.Color;
  road: p5.Color;
  block: p5.Color;
  outline: p5.Color;
  chimney: p5.Color;
  trees: p5.Color[];
};

type BlockConfig = {
  blockSize: number;
  cornerCut: number;
  diagonalGap: number;
  holeThickness: number;
  cellSize: number;
};

const gridSize = 12;
const padding = 10;

export function setup(sketch: p5) {
  sketch.noLoop();
}

export function draw(sketch: p5) {
  const colors = {
    background: sketch.color(168, 159, 148),
    road: sketch.color(142, 132, 121),
    block: sketch.color(230, 126, 34),
    outline: sketch.color(243, 156, 18),
    chimney: sketch.color(240, 180, 110),
    trees: [
      sketch.color(39, 174, 96, 160),
      sketch.color(46, 204, 113, 160),
      sketch.color(22, 160, 133, 160),
      sketch.color(34, 153, 84, 160),
    ],
  };

  sketch.background(colors.background);

  const cellSize = (sketch.width - padding * 2) / gridSize;
  const blockGap = cellSize * 0.2;
  const blockSize = cellSize - blockGap;
  const cornerCut = blockSize * 0.15;
  const donutThickness = blockSize * 0.15;
  const diagGap = blockSize * 0.08;

  sketch.translate(padding + blockGap / 2, padding + blockGap / 2);

  const diagonal1 = selectDiagonals(sketch, gridSize, 3);
  const diagonal2 = selectNonIntersectingDiagonals(
    sketch,
    gridSize,
    diagonal1,
    2,
  );

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      sketch.push();
      sketch.translate(i * cellSize, j * cellSize);

      sketch.stroke(colors.outline);
      sketch.strokeWeight(cellSize * 0.035);
      sketch.strokeJoin(sketch.ROUND);

      if (diagonal1.includes(i + j)) {
        drawDiagonalBlock(
          sketch,
          {
            blockSize,
            cornerCut,
            diagonalGap: diagGap,
            holeThickness: donutThickness,
            cellSize,
          },
          colors,
          false,
        );
      } else if (diagonal2.includes(i - j)) {
        drawDiagonalBlock(
          sketch,
          {
            blockSize,
            cornerCut,
            diagonalGap: diagGap,
            holeThickness: donutThickness,
            cellSize,
          },
          colors,
          true,
        );
      } else {
        drawFullBlock(
          sketch,
          {
            blockSize,
            cornerCut,
            diagonalGap: diagGap,
            holeThickness: donutThickness,
            cellSize,
          },
          colors,
        );
      }

      drawTrees(
        sketch,
        blockSize,
        blockGap,
        cellSize,
        colors.trees,
        i,
        j,
        gridSize,
      );
      sketch.pop();
    }
  }
}

function selectDiagonals(
  sketch: p5,
  gridSize: number,
  count: number,
): number[] {
  const diagonals: number[] = [];
  const validRange = gridSize - 2;

  for (let k = 0; k < count; k++) {
    let randomOffset = Math.floor(sketch.random(validRange));
    let attempts = 0;
    while (
      attempts < 10 &&
      diagonals.some((d) => Math.abs(d - (gridSize - 1 + randomOffset)) <= 1)
    ) {
      randomOffset = Math.floor(sketch.random(validRange));
      attempts++;
    }
    diagonals.push(gridSize - 1 + randomOffset);
  }
  return diagonals;
}

function selectNonIntersectingDiagonals(
  sketch: p5,
  gridSize: number,
  existing: number[],
  count: number,
): number[] {
  const diagonals: number[] = [];
  const validRange = gridSize - 2;

  for (let k = 0; k < count; k++) {
    let randomOffset = Math.floor(sketch.random(validRange));
    let attempts = 0;
    while (attempts < 50) {
      const currentDiagonal = -randomOffset;
      const intersects = existing.some((existingDiagonal) => {
        if ((existingDiagonal + currentDiagonal) % 2 === 0) {
          const intersectI = (existingDiagonal + currentDiagonal) / 2;
          const intersectJ = (existingDiagonal - currentDiagonal) / 2;
          return (
            intersectI >= 0 &&
            intersectI < gridSize &&
            intersectJ >= 0 &&
            intersectJ < gridSize
          );
        }
        return false;
      });
      if (!intersects && !diagonals.includes(currentDiagonal)) break;
      randomOffset = (randomOffset + 1) % validRange;
      attempts++;
    }
    diagonals.push(-randomOffset);
  }
  return diagonals;
}

function drawDetailLines(
  sketch: p5,
  edgeX1: number,
  edgeY1: number,
  edgeX2: number,
  edgeY2: number,
  holeX1: number,
  holeY1: number,
  holeX2: number,
  holeY2: number,
  blockSize: number,
) {
  const edgeLength = sketch.dist(edgeX1, edgeY1, edgeX2, edgeY2);
  let distance = sketch.random(0, blockSize * 0.12);

  while (distance < edgeLength) {
    const interpolation = distance / edgeLength;
    sketch.line(
      sketch.lerp(edgeX1, edgeX2, interpolation),
      sketch.lerp(edgeY1, edgeY2, interpolation),
      sketch.lerp(holeX1, holeX2, interpolation),
      sketch.lerp(holeY1, holeY2, interpolation),
    );
    distance += sketch.random(blockSize * 0.12, blockSize * 0.28);
  }
}

function drawDiagonalBlock(
  sketch: p5,
  config: BlockConfig,
  colors: Color,
  mirrored: boolean,
) {
  const { blockSize, cornerCut, diagonalGap, holeThickness } = config;

  const coords = mirrored
    ? {
        h1: [
          diagonalGap,
          0,
          blockSize - cornerCut,
          0,
          blockSize,
          cornerCut,
          blockSize,
          blockSize - diagonalGap,
        ],
        h2: [
          0,
          diagonalGap,
          blockSize - diagonalGap,
          blockSize,
          cornerCut,
          blockSize,
          0,
          blockSize - cornerCut,
        ],
      }
    : {
        h1: [
          cornerCut,
          0,
          blockSize - diagonalGap,
          0,
          0,
          blockSize - diagonalGap,
          0,
          cornerCut,
        ],
        h2: [
          blockSize,
          diagonalGap,
          blockSize,
          blockSize - cornerCut,
          blockSize - cornerCut,
          blockSize,
          diagonalGap,
          blockSize,
        ],
      };

  const holeInset = holeThickness * 2.2;
  const holeCoords = mirrored
    ? {
        h1: [
          diagonalGap + holeInset,
          holeThickness,
          blockSize - holeThickness,
          holeThickness,
          blockSize - holeThickness,
          blockSize - diagonalGap - holeInset,
        ],
        h2: [
          holeThickness,
          diagonalGap + holeInset,
          blockSize - diagonalGap - holeInset,
          blockSize - holeThickness,
          holeThickness,
          blockSize - holeThickness,
        ],
      }
    : {
        h1: [
          holeThickness,
          holeThickness,
          blockSize - diagonalGap - holeInset,
          holeThickness,
          holeThickness,
          blockSize - diagonalGap - holeInset,
        ],
        h2: [
          blockSize - holeThickness,
          blockSize - holeThickness,
          diagonalGap + holeInset,
          blockSize - holeThickness,
          blockSize - holeThickness,
          diagonalGap + holeInset,
        ],
      };

  for (const half of ["h1", "h2"] as const) {
    const [x1, y1, x2, y2, x3, y3, x4, y4] = coords[half];
    const [holeX1, holeY1, holeX2, holeY2, holeX3, holeY3] = holeCoords[half];

    sketch.fill(colors.block);
    sketch.beginShape();
    sketch.vertex(x1, y1);
    sketch.vertex(x2, y2);
    sketch.vertex(x3, y3);
    sketch.vertex(x4, y4);
    sketch.endShape(sketch.CLOSE);

    sketch.fill(colors.road);
    sketch.triangle(holeX1, holeY1, holeX2, holeY2, holeX3, holeY3);
  }

  sketch.noStroke();
  sketch.fill(colors.chimney);
  for (let i = 0; i < 2; i++) {
    const chimneyWidth = blockSize * sketch.random(0.04, 0.08);
    const chimneyHeight = blockSize * sketch.random(0.04, 0.08);
    const [x1, y1, x2, y2] = coords.h1;
    sketch.rect(
      sketch.random(Math.min(x1, x2), Math.max(x1, x2) - chimneyWidth),
      sketch.random(
        Math.min(y1, y2),
        Math.max(y1, y2) + holeThickness - chimneyHeight,
      ),
      chimneyWidth,
      chimneyHeight,
    );
  }
}

function drawFullBlock(sketch: p5, config: BlockConfig, colors: Color) {
  const { blockSize, cornerCut, cellSize } = config;

  sketch.fill(colors.block);
  sketch.beginShape();
  sketch.vertex(cornerCut, 0);
  sketch.vertex(blockSize - cornerCut, 0);
  sketch.vertex(blockSize, cornerCut);
  sketch.vertex(blockSize, blockSize - cornerCut);
  sketch.vertex(blockSize - cornerCut, blockSize);
  sketch.vertex(cornerCut, blockSize);
  sketch.vertex(0, blockSize - cornerCut);
  sketch.vertex(0, cornerCut);
  sketch.endShape(sketch.CLOSE);

  const holeInset = blockSize * 0.25;
  sketch.fill(colors.road);
  sketch.rect(
    holeInset,
    holeInset,
    blockSize - holeInset * 2,
    blockSize - holeInset * 2,
  );

  sketch.stroke(colors.outline);
  sketch.strokeWeight(cellSize * 0.015);

  const edges: [number, number, number, number][] = [
    [cornerCut, 0, blockSize - cornerCut, 0],
    [blockSize, cornerCut, blockSize, blockSize - cornerCut],
    [cornerCut, blockSize, blockSize - cornerCut, blockSize],
    [0, cornerCut, 0, blockSize - cornerCut],
  ];
  const holes: [number, number, number, number][] = [
    [cornerCut, holeInset, blockSize - cornerCut, holeInset],
    [
      blockSize - holeInset,
      cornerCut,
      blockSize - holeInset,
      blockSize - cornerCut,
    ],
    [
      cornerCut,
      blockSize - holeInset,
      blockSize - cornerCut,
      blockSize - holeInset,
    ],
    [holeInset, cornerCut, holeInset, blockSize - cornerCut],
  ];

  for (let i = 0; i < 4; i++) {
    drawDetailLines(sketch, ...edges[i], ...holes[i], blockSize);
  }

  sketch.noStroke();
  sketch.fill(colors.chimney);
  const numChimneys = sketch.floor(sketch.random(4, 9));
  for (let i = 0; i < numChimneys; i++) {
    const side = sketch.floor(sketch.random(4));
    const chimneyWidth = blockSize * sketch.random(0.05, 0.12);
    const chimneyHeight = blockSize * sketch.random(0.05, 0.12);
    const positions = [
      [
        cornerCut,
        0,
        blockSize - cornerCut - chimneyWidth,
        holeInset - chimneyHeight,
      ],
      [
        cornerCut,
        blockSize - holeInset,
        blockSize - cornerCut - chimneyWidth,
        holeInset - chimneyHeight,
      ],
      [
        0,
        cornerCut,
        holeInset - chimneyWidth,
        blockSize - cornerCut - chimneyHeight,
      ],
      [
        blockSize - holeInset,
        cornerCut,
        holeInset - chimneyWidth,
        blockSize - cornerCut - chimneyHeight,
      ],
    ];
    const [xMin, yMin, xRange, yRange] = positions[side];
    sketch.rect(
      sketch.random(xMin, xMin + xRange),
      sketch.random(yMin, yMin + yRange),
      chimneyWidth,
      chimneyHeight,
    );
  }
}

function drawTrees(
  sketch: p5,
  blockSize: number,
  blockGap: number,
  cellSize: number,
  treeColors: p5.Color[],
  gridI: number,
  gridJ: number,
  gridSize: number,
) {
  if (sketch.random() < 0.95) {
    sketch.noStroke();

    const drawGarden = (gx: number, gy: number, gw: number, gh: number) => {
      const numTrees = sketch.floor(sketch.random(12, 28));
      for (let t = 0; t < numTrees; t++) {
        sketch.fill(sketch.random(treeColors));
        const diameter = cellSize * sketch.random(0.04, 0.12);
        const margin = blockGap * 0.12;
        sketch.circle(
          sketch.random(
            gx + margin + diameter / 2,
            gx + gw - margin - diameter / 2,
          ),
          sketch.random(
            gy + margin + diameter / 2,
            gy + gh - margin - diameter / 2,
          ),
          diameter,
        );
      }
    };

    if (sketch.random() < 0.9 && gridI < gridSize - 1)
      drawGarden(blockSize, 0, blockGap, blockSize);
    if (sketch.random() < 0.9 && gridJ < gridSize - 1)
      drawGarden(0, blockSize, blockSize, blockGap);
  }
}
