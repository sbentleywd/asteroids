import { Mass } from "./mass.js";

class Asteroid extends Mass {
  constructor(x, y, mass, radius, rotationAngle, xSpeed, ySpeed, rotationSpeed, segments, options = {}) {
    super(x, y, mass, radius, rotationAngle, xSpeed, ySpeed, rotationSpeed);
    this.segments = segments;
    this.options = options;
    this.radiusArray = [];
    this.randomiseRadii();
  }

  draw() {
    const segmentAngle = 360 / this.segments;

    let asteroidString = `<g transform="translate(${this.x} ${this.y}) rotate(${this.rotationAngle})" stroke="white">`;
    let pathString = `<path `;

    for (let i = 0; i < this.segments - 1; i++) {
      const segmentRadius = this.radiusArray[i];

      const angle = (i + 1) * segmentAngle;
      const angleRads = (angle / 360) * 2 * Math.PI;
      const deltaX = Math.round(Math.sin(angleRads) * segmentRadius);
      const deltaY = Math.round(segmentRadius - Math.cos(angleRads) * segmentRadius - segmentRadius);

      if (i === 0) {
        pathString += ` d="M ${0} ${-segmentRadius}`;
      } else {
        pathString += ` L ${deltaX} ${deltaY}`;
      }
    }

    pathString += ` Z" stroke-width="2" fill="black" />`;
    asteroidString += pathString;

    asteroidString += `</g>`;

    return asteroidString;
  }

  randomiseRadii(noise = 0.5) {
    for (let i = 0; i < this.segments; i++) {
      const radiusFactor = noise * (Math.random() - 0.5);
      this.radiusArray.push(this.radius + this.radius * radiusFactor);
    }
  }
}

export { Asteroid };
