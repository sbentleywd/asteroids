import { Mass } from "./mass.js";
import { helpers } from "../modules/helpers.js";

class Powerup extends Mass {
  constructor(type, x, y, gameNode) {
    super(x, y, 100, 20);
    this.gameNode = gameNode;
    this.type = type;
    this.lifetime = 10.0;
    this.life = 10.0;
    this.draw();
  }

  update(elapsed) {
    this.life -= elapsed / this.lifetime;
    super.update(elapsed);
    this.updateSVG();
  }

  draw() {
    const powerupGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    powerupGroup.setAttribute("transform", `translate(${this.x} ${this.y}) rotate(180)`);
    powerupGroup.setAttribute("stroke", `white`);

    const outline = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    outline.setAttribute("r", this.radius);
    outline.setAttribute("fill", "white");

    powerupGroup.appendChild(outline);

    const powerupPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

    if (this.type === "life") {
      powerupPath.setAttribute("transform", `translate(0 ${-this.radius}) rotate(45)`);
      powerupPath.setAttribute(
        "d",
        `M0 20 v-20 h20 
          a10,10 90 0,1 0,20
          a10,10 90 0,1 -20,0
          z`
      );
      powerupPath.setAttribute("fill", "red");
      powerupPath.setAttribute("stroke", "red");
    } else if (this.type === "shield") {
      powerupPath.setAttribute("d", `M0 -18 L12 -5 L12 10 L-12 10 L-12 -5 L0 -18`);
      powerupPath.setAttribute("fill", "silver");
      powerupPath.setAttribute("stroke", "black");
      powerupPath.setAttribute("stroke-width", "2");
    }

    powerupGroup.appendChild(powerupPath)

    this.svgNode = this.gameNode.appendChild(powerupGroup);

    // let powerupString = ``;
    // powerupString += `<g transform="translate(${this.x} ${this.y}) rotate(180)" stroke="white">`;

    // powerupString += `<circle cx="0" cy="0" r="${this.radius}" fill="white" stroke-width="1" />`;
    // if (this.type === "life") {
    //   powerupString += `<path transform="translate(${0} ${-this.radius + 2}) rotate(45)" d="M0 20 v-20 h20
    //     a10,10 90 0,1 0,20
    //     a10,10 90 0,1 -20,0
    //     z" stroke="red" fill="red" />`;
    // } else if (this.type === "shield") {
    //   powerupString += `<path d="M0 -18 L12 -5 L12 10 L-12 10 L-12 -5 L0 -18" fill="silver" stroke="black" stroke-width="2" />`
    // }

    // powerupString += `</g>`;
    // return powerupString;
  }

  updateSVG() {
    this.svgNode.setAttribute("transform", `translate(${this.x} ${this.y})`);
  }

  destroy() {
    this.svgNode.remove();
  }
}

export { Powerup };
