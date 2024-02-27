import { Asteroid } from "./classes/asteroid.js";
import { Ship } from "./classes/ship.js";
import { Projectile } from "./classes/projectile.js";
import { helpers } from "./modules/helpers.js";

const asteroids = [];
const projectiles = [];
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight - 20;

// for (let i = 0; i < 5; i++) {
//   const asteroid = new Asteroid(Math.random() * 600, Math.random() * 400, 2000 + Math.random() * 8000);

//   asteroid.push(Math.PI * 2 * Math.random(), 1000, 60);
//   asteroid.twist((Math.random() - 0.5) * 2000, 60);
//   asteroids.push(asteroid);
// }

const ship = new Ship(300, 200, 1000, 200);

let previous, elapsed;

const draw = () => {
  let svgString = initSVG();

  asteroids.forEach((asteroid) => (svgString += asteroid.draw()));
  projectiles.forEach((projectile) => (svgString += projectile.draw()));
  svgString += ship.draw();

  svgString += closeSVG();

  document.getElementById("asteroids").innerHTML = svgString;
};

const update = () => {
  asteroids.forEach((asteroid) => asteroid.update(elapsed / 1000));
  projectiles.forEach((projectile, i, projectiles) => {
    projectile.update(elapsed / 1000);
    if (projectile.life < 0) projectiles.splice(i, 1);
  });
  if (ship.trigger) {
    projectiles.push(ship.projectile(elapsed / 1000));
  }
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
  return `<svg width="${screenWidth}" height="${screenHeight}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${screenWidth} ${screenHeight}" id="asteroidsSVG" >`;
};

const closeSVG = () => {
  return `</svg>`;
};

document.addEventListener("keydown", (e) => keyBoardHandler(e, true));
document.addEventListener("keyup", (e) => keyBoardHandler(e, false));

const keyBoardHandler = (e, value) => {
  switch (e.code) {
    case "ArrowLeft":
      ship.leftThruster = value;
      break;
    case "ArrowRight":
      ship.rightThruster = value;
      break;
    case "ArrowUp":
      ship.thrusterOn = value;
      break;
    case "Space":
      ship.trigger = value;
      break;
  }
};
