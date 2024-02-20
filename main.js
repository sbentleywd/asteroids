import { Asteroid } from "./classes/asteroid.js";

const asteroid1 = new Asteroid(300, 200, 1, 20, 0, 10, -100, 50, 12, {});
const asteroid2 = new Asteroid(300, 200, 1, 20, 0, -20, 50, 50, 16, {});

let previous, elapsed;

const draw = () => {
  let svgString = initSVG();

  svgString += asteroid1.draw();
  svgString += asteroid2.draw();

  svgString += closeSVG();

  document.getElementById("asteroids").innerHTML = svgString;
};

const update = () => {
  asteroid1.update(elapsed / 1000);
  asteroid2.update(elapsed / 1000);
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
