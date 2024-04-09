import { Mass } from "./mass.js";

class Particle extends Mass {
  constructor(mass, lifetime, x, y, xSpeed, ySpeed, gameNode) {
    const density = 0.001;
    const radius = Math.sqrt((mass / density) / Math.PI);

    super(x, y, mass, radius, 0, xSpeed, ySpeed);
    this.gameNode = gameNode;
    this.lifetime = lifetime;
    this.life = 1.0;
    this.draw();
  }

  update(elapsed) {
    this.life -= (elapsed / this.lifetime);
    super.update(elapsed);
    this.updateSVG();
  }

  draw() {
    let particleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    particleElement.setAttribute("r", this.radius);
    particleElement.setAttribute("fill", Math.random() > 0.5 ? 'red' : 'yellow');

    this.svgNode = this.gameNode.appendChild(particleElement);
    this.updateSVG();
  }

  updateSVG() {
    this.svgNode.setAttribute("cx", this.x);
    this.svgNode.setAttribute("cy", this.y);
  }
}

export { Particle };