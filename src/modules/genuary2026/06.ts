import type p5 from "p5";

export const prompt = `Lights on/off.`;

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  animateAxis: "width" | "height";
  animateFromStart: boolean;
  animationOffset: number;
  animationSpeed: number;
  animationAmount: number;
  color: p5.Color;
}

let rectangles: Rectangle[] = [];
let isDarkMode = false;

export function setup(sketch: p5) {
  sketch.colorMode(sketch.HSL);
  isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        isDarkMode = event.matches;
      });
  }

  const padding = 0.03;

  for (let i = 0; i < 40; i++) {
    const width = sketch.random(0.02, 0.3);
    const height = sketch.random(0.02, 0.3);

    rectangles.push({
      x: sketch.random(padding, 1 - width - padding),
      y: sketch.random(padding, 1 - height - padding),
      width,
      height,
      animateAxis: sketch.random() > 0.5 ? "width" : "height",
      animateFromStart: sketch.random() > 0.5,
      animationOffset: sketch.random(0, sketch.TWO_PI),
      animationSpeed: sketch.random(0.1, 0.2),
      animationAmount: sketch.random(0.2, 0.8),
      color: sketch.color(
        sketch.random(0, 360),
        sketch.random(40, 70),
        sketch.random(50, 80),
        0.5,
      ),
    });
  }
}

export function draw(sketch: p5) {
  sketch.background(isDarkMode ? 10 : 90);

  rectangles.forEach((rect) => {
    const baseWidth = rect.width * sketch.width;
    const baseHeight = rect.height * sketch.height;
    const baseX = rect.x * sketch.width;
    const baseY = rect.y * sketch.height;

    let displayWidth = baseWidth;
    let displayHeight = baseHeight;
    let displayX = baseX;
    let displayY = baseY;

    if (isDarkMode) {
      const pulse = Math.abs(
        sketch.sin(
          sketch.frameCount * rect.animationSpeed + rect.animationOffset,
        ),
      );
      const bouncyOscillation = pulse * rect.animationAmount;

      if (rect.animateAxis === "width") {
        displayWidth = baseWidth * (1 + bouncyOscillation);
        if (!rect.animateFromStart) {
          displayX = baseX - (displayWidth - baseWidth);
        }
      } else {
        displayHeight = baseHeight * (1 + bouncyOscillation);
        if (!rect.animateFromStart) {
          displayY = baseY - (displayHeight - baseHeight);
        }
      }
    }

    let fillColor = rect.color;
    let strokeColor = rect.color;

    if (isDarkMode) {
      const h = sketch.hue(rect.color);
      const s = Math.min(100, sketch.saturation(rect.color) + 30);
      const l = 80;
      fillColor = sketch.color(h, s, l, 0.5);
      strokeColor = sketch.color(h, s, l);
    }

    sketch.fill(fillColor);
    sketch.stroke(strokeColor);
    sketch.strokeWeight(2);

    sketch.rect(displayX, displayY, displayWidth, displayHeight);
  });
}
