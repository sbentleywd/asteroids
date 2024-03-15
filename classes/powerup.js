import { Mass } from "./mass.js";
import { helpers } from "../modules/helpers.js";

class Powerup extends Mass {
  constructor(type, x, y) {
    super(x, y, 100, 20);
    this.type = type;
    this.lifetime = 10.0;
    this.life = 10.0;
  }

  update(elapsed) {
    this.life -= elapsed / this.lifetime;
    super.update(elapsed);
  }

  draw() {
    let powerupString = ``;
    powerupString += `<g transform="translate(${this.x} ${this.y}) rotate(180)" stroke="white">`;

    powerupString += `<circle cx="0" cy="0" r="${this.radius}" fill="white" stroke-width="1" />`;
    if (this.type === "life") {
      powerupString += `<path transform="translate(${0} ${-this.radius + 2}) rotate(45)" d="M0 20 v-20 h20 
        a10,10 90 0,1 0,20
        a10,10 90 0,1 -20,0
        z" stroke="red" fill="red" />`;
    }

    powerupString += `</g>`;
    return powerupString;
  }
}

export { Powerup };
