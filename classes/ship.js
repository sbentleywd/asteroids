import { Mass } from "./mass.js";
import { Projectile } from "./projectile.js";
import { helpers } from "../modules/helpers.js";

class Ship extends Mass {
  constructor(x, y, power, weaponPower) {
    super(x, y, 25, 20, helpers.degreesToRads(270));
    this.power = power;
    this.weaponPower = weaponPower ?? 200;
    this.steeringPower = power / 20;
    this.thrusterOn = false;
    this.rightThruster = false;
    this.leftThruster = false;
  }

  draw(options) {
    let shipSVGString = ``;
    options = options || {};

    let angle = Math.PI / 4;
    let curve1 = 0.35;
    let curve2 = 0.55;
    let shipX = this.x;
    let shipY = this.y;
    let rotation = this.rotationAngle;

    shipSVGString += `<g transform="translate(${shipX} ${shipY}) rotate(${helpers.radsToDegrees(
      rotation
    )})" stroke="white">`;

    if (options.guide) {
      shipSVGString += `<circle cx="0" cy="0" r="${this.radius}" fill="rgba(0, 0, 0, 0.25)" />`;
    }

    shipSVGString += `<path 
        d="M ${this.radius} ${0}
        Q ${Math.cos(angle) * this.radius * curve2} ${Math.sin(angle) * this.radius * curve2} ${
      Math.cos(Math.PI - angle) * this.radius
    } ${Math.sin(Math.PI - angle) * this.radius}
        Q ${-this.radius * curve1} 0 ${Math.cos(Math.PI + angle) * this.radius} ${
      Math.sin(Math.PI + angle) * this.radius
    }
        Q ${Math.cos(-angle) * this.radius * curve2} ${Math.sin(-angle) * this.radius * curve2} ${this.radius} 0
        " stroke="white" stroke-width="2" fill="black"/>`;

    shipSVGString += `</g>`;

    return shipSVGString;
  }

  update(elapsed) {
    if (this.thrusterOn) this.push(this.rotationAngle, this.power, elapsed);
    if (this.rightThruster) this.twist(this.steeringPower, elapsed);
    if (this.leftThruster) this.twist(this.steeringPower * -1, elapsed);
    super.update(elapsed);
  }

  projectile(elapsed) {
    const missile = new Projectile(
      0.025,
      1,
      this.x + Math.cos(this.rotationAngle) * this.radius,
      this.y + Math.sin(this.rotationAngle) * this.radius,
      this.xSpeed,
      this.ySpeed,
      this.rotationSpeed
    );

    missile.push(this.rotationAngle, this.weaponPower, elapsed);
    this.push(this.rotationAngle + Math.PI, this.weaponPower, elapsed)       

    return missile;
  }
}

export { Ship };
