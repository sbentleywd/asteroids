import { Asteroid } from "./classes/asteroid.js";
import { Ship } from "./classes/ship.js";

const asteroid1 = new Asteroid(
  Math.random() * 600,
  Math.random() * 400,
  Math.random() * 5000,
  (Math.random() - 0.5) * 100,
  (Math.random() - 0.5) * 100,
  (Math.random() - 0.5) * 100
);
// const asteroid2 = new Asteroid(300, 200, 1000, -20, 50, 50);

const ship = new Ship(300, 200);

let previous, elapsed;

const draw = () => {
  let svgString = initSVG();

  svgString += asteroid1.draw();
  // svgString += asteroid2.draw();
  svgString += ship.draw();

  svgString += closeSVG();

  document.getElementById("asteroids").innerHTML = svgString;
};

const update = () => {
  asteroid1.update(elapsed / 1000);
  // asteroid2.update(elapsed / 1000);
  ship.update(elapsed / 1000);
};

const frame = (timeStamp) => {
  if (!previous) previous = timeStamp;
  elapsed = timeStamp - previous;
  draw();
  update();
  previous = timeStamp;
  requestAnimationFrame(frame);
};

requestAnimationFrame(frame);

const initSVG = () => {
  return `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" id="asteroidsSVG" >`;
};

const closeSVG = () => {
  return `</svg>`;
};

document.addEventListener("keydown", (e) => {
  console.log(e);

  if (e.code === "ArrowLeft") {
    ship.twist(-10, elapsed);
  } else if (e.code === "ArrowRight") {
    ship.twist(10, elapsed);
  }
});
