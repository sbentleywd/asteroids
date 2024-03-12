import { Ship } from "./ship.js";
import { Asteroid } from "./asteroid.js";

class Game {
  constructor(id) {
    this.node = document.getElementById(id);
    this.scoreNode = document.getElementById("scoreSpan");
    this.livesNode = document.getElementById("healthSpan");
    this.guide = false;
    this.shipMass = 1000;
    this.shipRadius = 15;
    this.asteroidMass = 7000;
    this.asteroidPush = 5000000;
    this.width = this.node.offsetWidth;
    this.height = this.node.offsetHeight;
    this.ship = new Ship(this.width / 2, this.height / 2, 1500, 200);
    this.projectiles = [];
    this.asteroids = [];
    this.score = 0;
    this.previousScore = 0
    this.massDestroyed = 500;
    this.mainColour = '#20960b'

    this.asteroids.push(this.createAsteroid());
    document.addEventListener("keydown", this.keyDown.bind(this), true);
    document.addEventListener("keyup", this.keyUp.bind(this), true);
    window.requestAnimationFrame(this.frame.bind(this));
  }

  // Asteroid methods

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
    asteroid.push(2 * Math.PI * Math.random(), this.asteroidPush, elapsed);
    asteroid.twist(Math.random() - 0.5 * Math.PI * this.asteroidPush * 0.08, elapsed);
  }

  splitAsteroid(asteroid, elapsed) {
    asteroid.mass -= this.massDestroyed;
    this.score += this.massDestroyed;

    const split = 0.25 + 0.5 * Math.random(); // split unevenly
    const child1 = asteroid.child(asteroid.mass * split);
    const child2 = asteroid.child(asteroid.mass * (1 - split));

    [child1, child2].forEach((child) => {
      if (child.mass < this.massDestroyed) {
        this.score += child.mass;
      } else {
        this.pushAsteroid(child, elapsed);
        this.asteroids.push(child);
      }
    });
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
    this.update(elapsed / 1000);
    this.previous = timeStamp;
    window.requestAnimationFrame(this.frame.bind(this));
  }

  update(elapsed) {
    this.reset()

    this.asteroids.forEach((asteroid) => {
      asteroid.update(elapsed);
      if (collision(asteroid, this.ship)) this.ship.compromised = true;
    });
    this.projectiles.forEach((projectile, i, projectiles) => {
      projectile.update(elapsed);
      if (projectile.life < 0) projectiles.splice(i, 1);
      else {
        this.asteroids.forEach((asteroid, j) => {
          if (collision(asteroid, projectile)) {
            projectiles.splice(i, 1);
            this.asteroids.splice(j, 1);
            this.splitAsteroid(asteroid, elapsed);
          }
        });
      }
    });
    if (this.ship.trigger && this.ship.loaded) {
      this.projectiles.push(this.ship.projectile(elapsed));
    }

    if (this.ship.compromised) this.destroyShip()
    this.ship.update(elapsed);

    if (this.score !== this.previousScore) this.setScore()

    // this.healthNode.innerHTML = Math.round(this.ship.health);
    // this.scoreNode.innerHTML = Math.round(this.score);
  }

  reset() {
    // reset values
    this.ship.compromised = false;
    this.previousScore = this.score;
  }

  setScore() {
    this.scoreNode.innerHTML = Math.round(this.score);
  }

  setLives() {
    this.livesNode.innerHTML = this.ship.lives
  }

  destroyShip() {
    this.ship.lives--;
    this.ship.x = this.width / 2
    this.ship.y = this.height / 2
    this.ship.xSpeed = 0;
    this.ship.ySpeed = 0;
    this.ship.rotationAngle = 0;
    this.setLives()
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
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" id="asteroidsSVG" >`;
  }

  closeSVG() {
    return `</svg>`;
  }
}

const collision = (obj1, obj2) => {
  return distanceBetween(obj1, obj2) < obj1.radius + obj2.radius;
};

const distanceBetween = (obj1, obj2) => {
  return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
};

export { Game };
