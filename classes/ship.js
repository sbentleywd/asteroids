import { Mass } from "./mass.js";
import { Projectile } from "./projectile.js";
import { helpers } from "../modules/helpers.js";

class Ship extends Mass {
  constructor(x, y, power, weaponPower) {
    super(x, y, 25, 20, helpers.degreesToRads(270));
    this.power = power;
    this.weaponPower = weaponPower ?? 200;
    this.steeringPower = power / 25;
    this.thrusterOn = false;
    this.retroOn
    this.rightThruster = false;
    this.leftThruster = false;
    this.trigger = false;
    this.loaded = false;
    this.reloadTime = 0.25;
    this.timeUntilReload = this.reloadTime;
    this.compromised = false;
    this.maxHealth = 2.0;
    this.health = this.maxHealth;
    this.lives = 3
  }

  draw(options) {
    let shipSVGString = ``;
    options = options || {};

    let angle = Math.PI / 4 * 0.9;
    let curve1 = 0.55;
    let curve2 = 0.55;
    let shipX = this.x;
    let shipY = this.y;
    let rotation = this.rotationAngle;

    shipSVGString += `<g transform="translate(${shipX} ${shipY}) rotate(${helpers.radsToDegrees(
      rotation
    )})" stroke="white">`;

    if (this.guide) {
      shipSVGString += `<circle cx="0" cy="0" r="${this.radius}" fill="black"  />`;
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
        " stroke="white" stroke-width="2" fill="${this.compromised ? "red" : "black"}"/>`;

    shipSVGString += `</g>`;

    return shipSVGString;
  }

  update(elapsed) {
    if (this.thrusterOn && this.speed() < 500) this.push(this.rotationAngle, this.power, elapsed);
    if (this.retroOn) this.push(this.rotationAngle + Math.PI, this.power / 2, elapsed);
    if (this.rightThruster) this.turn(elapsed)
    if (this.leftThruster) this.turn(-elapsed)

    this.loaded = this.timeUntilReload === 0;

    if (!this.loaded) {
      this.timeUntilReload -= Math.min(elapsed, this.timeUntilReload);
    }

    super.update(elapsed);
  }

  projectile(elapsed) {
    const missile = new Projectile(
       0.025,
      5,
      this.x + Math.cos(this.rotationAngle) * this.radius,
      this.y + Math.sin(this.rotationAngle) * this.radius,
      this.xSpeed,
      this.ySpeed,
      this.rotationSpeed
    );

    missile.push(this.rotationAngle, this.weaponPower, elapsed);
    this.push(this.rotationAngle + Math.PI, this.weaponPower, elapsed);
    
    this.timeUntilReload = this.reloadTime;

    return missile;
  }

  turn(elapsed) {
    this.rotationAngle += elapsed * 1.6
  }

}

export { Ship };
