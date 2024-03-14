import { Mass } from "./mass.js";

class Particle extends Mass {
  constructor(mass, lifetime, x, y, xSpeed, ySpeed) {
    const density = 0.001;
    const radius = Math.sqrt((mass / density) / Math.PI);

    super(x, y, mass, radius, 0, xSpeed, ySpeed);
    this.lifetime = lifetime;
    this.life = 1.0;
  }

  update(elapsed) {
    this.life -= (elapsed / this.lifetime);
    super.update(elapsed);
  }

  draw() {
    let particleString = `<circle cx="${this.x}" cy="${this.y}" r="${this.radius}" fill="${Math.random() > 0.5 ? 'red' : 'yellow'}" />`;

    return particleString;
  }
}

export { Particle };