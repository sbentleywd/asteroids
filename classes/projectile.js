import { Mass } from "./mass.js";

class Projectile extends Mass {
  constructor(mass, lifetime, x, y, xSpeed, ySpeed, rotationSpeed, gameNode) {
    const density = 0.001;
    const radius = Math.sqrt(mass / density / Math.PI);

    super(x, y, mass, radius, 0, xSpeed, ySpeed, rotationSpeed);
    this.gameNode = gameNode;
    this.lifetime = lifetime;
    this.life = 1.0;
    this.draw();
  }

  update(elapsed) {
    this.life -= elapsed / this.lifetime;
    super.update(elapsed);

    this.updateSVG();
  }

  draw() {
    let projectileElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    projectileElement.setAttribute("r", this.radius);
    projectileElement.setAttribute("fill", "yellow");

    this.svgNode = this.gameNode.appendChild(projectileElement);
    this.updateSVG();
  }

  updateSVG() {
    this.svgNode.setAttribute("cx", this.x);
    this.svgNode.setAttribute("cy", this.y);
  }

  destroy() {
    this.svgNode.remove()
  }

}

export { Projectile };
