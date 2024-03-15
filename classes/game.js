import { Ship } from "./ship.js";
import { Asteroid } from "./asteroid.js";
import { Particle } from "./particle.js";
import { Powerup } from "./powerup.js";

class Game {
  constructor(id) {
    this.node = document.getElementById(id);
    this.scoreNode = document.getElementById("scoreSpan");
    this.livesNode = document.getElementById("healthSpan");
    this.levelNode = document.getElementById("levelSpan");
    this.gameOverNode = document.getElementById("gameOver");
    this.guide = false;
    this.shipMass = 1000;
    this.shipRadius = 15;
    this.shipBuffer = 200;
    this.asteroidMass = 7000;
    this.asteroidPush = 5000000;
    this.width = this.node.offsetWidth;
    this.height = this.node.offsetHeight;
    this.score = 0;
    this.previousScore = 0;
    this.massDestroyed = 500;
    this.mainColour = "#20960b";

    this.newGame();
    document.addEventListener("keydown", this.keyDown.bind(this), true);
    document.addEventListener("keyup", this.keyUp.bind(this), true);
    window.requestAnimationFrame(this.frame.bind(this));
  }

  newGame() {
    this.gameOver = false;
    this.level = 1;
    this.score = 0;
    this.ship = new Ship(this.width / 2, this.height / 2, 3000, 200);
    this.setLives();
    this.setLevel();
    this.setScore();
    this.projectiles = [];
    this.asteroids = [];
    this.particles = [];
    this.powerups = [];
    this.asteroids.push(this.createAsteroid());
    this.asteroids.push(this.createAsteroid());
    // TODO: create powerups at random intervals
    // this.powerups.push(this.createPowerup());
    this.gameOverNode.style.display = "none";
  }

  createPowerup() {
    const powerupType = !this.ship.shieldEnabled ? "shield" : "life";

    const powerup = new Powerup("life", this.width * Math.random(), this.height * Math.random());
    powerup.push(Math.random() * 2 * Math.PI, 1000000);
    return powerup;
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
    this.resetValues();

    // Asteroids
    this.asteroids.forEach((asteroid) => {
      asteroid.update(elapsed);
      if (collision(asteroid, this.ship)) {
        if (!this.ship.guide) this.ship.compromised = true;
        else {
          elasticCollision(this.ship, asteroid);
        }
      }
    });

    // Projectiles
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

        this.powerups.forEach((powerup, k) => {
          if (collision(powerup, projectile)) {
            projectiles.splice(i, 1);
            this.powerups.splice(k, 1);

            if (powerup.type === "life") {
              this.ship.lives++;
              this.setLives();
            }
          }
        });
      }
    });

    // Particles
    this.particles.forEach((particle, i, particles) => {
      particle.update(elapsed);
      if (particle.life < 0) particles.splice(i, 1);
    });

    // Ship
    if (this.ship.trigger && this.ship.loaded && !this.ship.guide) {
      this.projectiles.push(this.ship.projectile(elapsed));
    }

    // Powerups
    this.powerups.forEach((powerup, i, powerups) => {
      powerup.update(elapsed);
      if (powerup.life < 0) powerups.splice(i, 1);
    });

    if (this.ship.compromised) this.destroyShip();
    this.ship.update(elapsed);

    if (this.score !== this.previousScore) this.setScore();

    if (this.asteroids.length === 0) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    for (let i = 0; i < this.level + 1; i++) {
      this.asteroids.push(this.createAsteroid());
    }
    this.setLevel();
  }

  resetValues() {
    // reset values
    this.ship.compromised = false;
    this.previousScore = this.score;
  }

  setScore() {
    this.scoreNode.innerHTML = Math.round(this.score);
  }

  setLives() {
    this.livesNode.innerHTML = this.ship.lives;
  }

  setLevel() {
    this.levelNode.innerHTML = this.level;
  }

  destroyShip() {
    if (this.ship.lives > 0) this.ship.lives--;

    if (this.ship.lives === 0) {
      this.endGame();
    }
    this.ship.x = this.width / 2;
    this.ship.y = this.height / 2;
    this.ship.xSpeed = 0;
    this.ship.ySpeed = 0;
    this.ship.rotationAngle = 0;
    this.setLives();
  }

  endGame() {
    // this.gameOverNode.innerHTML = 'Game Over'
    this.gameOverNode.style.display = "flex";
    this.gameOver = true;
  }

  // Drawing

  draw() {
    let svgString = this.initSVG();
    this.asteroids.forEach((asteroid) => (svgString += asteroid.draw()));
    this.projectiles.forEach((projectile) => (svgString += projectile.draw()));
    this.particles.forEach((particle) => (svgString += particle.draw()));
    this.powerups.forEach((powerup) => (svgString += powerup.draw()));
    if (!this.gameOver) svgString += this.ship.draw();

    svgString += this.closeSVG();

    this.node.innerHTML = svgString;
  }

  initSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" id="asteroidsSVG" >`;
  }

  closeSVG() {
    return `</svg>`;
  }

  // Asteroid methods

  createAsteroid() {
    const asteroid = this.initAsteroid();
    this.pushAsteroid(asteroid);
    return asteroid;
  }

  initAsteroid() {
    let asteroid;
    while (distanceBetween(asteroid, this.ship) < 300) {
      asteroid = new Asteroid(this.width * Math.random(), this.height * Math.random(), this.asteroidMass);
    }

    return asteroid;
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

    for (let i = 0; i < 9; i++) {
      this.explosion(asteroid);
    }
  }

  explosion(obj) {
    const explosionParticle = new Particle(
      0.01,
      0.5,
      obj.x + Math.random() * 20,
      obj.y + Math.random() * 20,
      Math.random() * 20,
      Math.random() * 20
    );
    this.particles.push(explosionParticle);
  }

  // Keyboard handling

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
      case "KeyS":
        this.ship.guide = value;
        break;
      case "KeyN":
        if (this.gameOver) this.newGame();
        break;
    }
  }
}

const collision = (obj1, obj2) => {
  return distanceBetween(obj1, obj2) < obj1.radius + obj2.radius;
};

const distanceBetween = (obj1, obj2) => {
  if (obj1 == undefined || obj2 == undefined) return 0;
  return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
};

const elasticCollision = (obj1, obj2) => {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;

  const collisionAngle = Math.atan2(dy, dx);

  // Relative velocity
  const relVelX = obj1.xSpeed - obj2.xSpeed;
  const relVelY = obj1.ySpeed - obj2.ySpeed;

  // Dot product of relative velocity with collision normal
  const dotProduct = relVelX * Math.cos(collisionAngle) + relVelY * Math.sin(collisionAngle);

  // Impulse along the collision normal
  const impulse = (2 * dotProduct) / (obj2.mass + obj1.mass);

  // New velocities after collision
  obj1.xSpeed -= impulse * obj2.mass * Math.cos(collisionAngle);
  obj1.ySpeed -= impulse * obj2.mass * Math.sin(collisionAngle);
  obj2.xSpeed += impulse * obj1.mass * Math.cos(collisionAngle);
  obj2.ySpeed += impulse * obj1.mass * Math.sin(collisionAngle);
};

export { Game };
