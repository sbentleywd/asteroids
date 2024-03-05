import { Ship } from "./ship.js";
import { Asteroid } from "./asteroid.js";

class Game {
  constructor(id) {
    this.node = document.getElementById(id);
    this.guide = false;
    this.shipMass = 1000;
    this.shipRadius = 15;
    this.asteroidMass = 5000;
    this.asteroidPush = 500000;
    this.width = this.node.offsetWidth - 20;
    this.height = this.node.offsetHeight - 20;
    this.ship = new Ship(this.width / 2, this.height / 2, 1000, 200);
    this.projectiles = [];
    this.asteroids = [];
    this.asteroids.push(this.createAsteroid());
    document.addEventListener("keydown", this.keyDown.bind(this), true);
    document.addEventListener("keyup", this.keyUp.bind(this), true);
    window.requestAnimationFrame(this.frame.bind(this));
  }

  createAsteroid(elapsed) {
    const asteroid = this.initAsteroid();
    this.pushAsteroid(asteroid);
    return asteroid;
  }

  initAsteroid() {
    return new Asteroid(this.width * Math.random(), this.height * Math.random(), this.asteroidMass);
  }

  pushAsteroid(asteroid, elapsed) {
    elapsed = elapsed || 0.015;
    asteroid.push(2 * Math.PI * Math.random(), this.asteroidPush * 50 * Math.random(), elapsed);
    asteroid.twist(Math.random() - 0.5 * Math.PI * this.asteroidPush * 5, elapsed);
  }

  keyDown(e) {
    this.keyboardHandler(e, true);
  }

  keyUp(e) {
    this.keyboardHandler(e, false);
  }

  keyboardHandler(e, value) {
    switch (e.code) {
      case "ArrowLeft":
        this.ship.leftThruster = value;
        break;
      case "ArrowRight":
        this.ship.rightThruster = value;
        break;
      case "ArrowUp":
        this.ship.thrusterOn = value;
        break;
      case "ArrowDown":
        this.ship.retroOn = value;
        break;
      case "Space":
        this.ship.trigger = value;
        break;
      case "KeyG":
        if (value) this.ship.guide = !this.ship.guide;
        break;
    }
  }

  frame(timeStamp) {
    if (!this.previous) this.previous = timeStamp;
    const elapsed = timeStamp - this.previous;
    this.draw();
    this.update(elapsed);
    this.previous = timeStamp;
    window.requestAnimationFrame(this.frame.bind(this));
  }

  update(elapsed) {
    this.asteroids.forEach((asteroid) => asteroid.update(elapsed / 1000));
    this.projectiles.forEach((projectile, i, projectiles) => {
      projectile.update(elapsed / 1000);
      if (projectile.life < 0) projectiles.splice(i, 1);
    });
    if (this.ship.trigger && this.ship.loaded) {
      this.projectiles.push(this.ship.projectile(elapsed / 1000));
    }
    this.ship.update(elapsed / 1000);
  }

  draw() {
    let svgString = this.initSVG();
    this.asteroids.forEach((asteroid) => (svgString += asteroid.draw()));
    this.projectiles.forEach((projectile) => (svgString += projectile.draw()));
    svgString += this.ship.draw();

    svgString += this.closeSVG();

    this.node.innerHTML = svgString;
  }

  initSVG() {
    return `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" id="asteroidsSVG" >`;
  }

  closeSVG() {
    return `</svg>`;
  }
}

export { Game };
