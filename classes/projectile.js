import { Mass } from "./mass.js";

class Projectile extends Mass {
  constructor(mass, lifetime, x, y, xSpeed, ySpeed, rotationSpeed) {
    const density = 0.001;
    const radius = Math.sqrt((mass / density) / Math.PI);

    super(x, y, mass, radius, 0, xSpeed, ySpeed, rotationSpeed);
    this.lifetime = lifetime;
    this.life = 1.0;
  }

  update(elapsed) {
    this.life -= (elapsed / this.lifetime);
    super.update(elapsed);
  }

  draw() {
    let projectileString = `<circle cx="${this.x}" cy="${this.y}" r="${this.radius}" fill="yellow" />`;

    return projectileString;
  }
}

export { Projectile };
