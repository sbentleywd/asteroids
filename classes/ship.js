import { Mass } from './mass.js'

class Ship extends Mass {
  constructor(x, y) {
    super(x, y, 10, 20, 270)
  }

  draw(options) {
    let shipSVGString = ``
    options = options || {}
    let angle = (this.angle || 0.5 * Math.PI) / 2
    let curve1 = 0.25
    let curve2 = 0.75
    let shipX = this.x
    let shipY = this.y
    let rotation = this.rotationAngle

    shipSVGString += `<g transform="translate(${shipX} ${shipY}) rotate(${rotation})" stroke="white">`

    if (options.guide) {
      shipSVGString += `<circle cx="0" cy="0" r="${this.radius}" fill="rgba(0, 0, 0, 0.25)" />`
    }

    shipSVGString += `<path 
        d="M ${this.radius} ${0}
        Q ${Math.cos(angle) * this.radius * curve2} ${
      Math.sin(angle) * this.radius * curve2
    } ${Math.cos(Math.PI - angle) * this.radius} ${
      Math.sin(Math.PI - angle) * this.radius
    }
        Q ${-this.radius * curve1} 0 ${
      Math.cos(Math.PI + angle) * this.radius
    } ${Math.sin(Math.PI + angle) * this.radius}
        Q ${Math.cos(-angle) * this.radius * curve2} ${
      Math.sin(-angle) * this.radius * curve2
    } ${this.radius} 0
        " stroke="white" stroke-width="2" fill="black"/>`

    shipSVGString += `</g>`

    return shipSVGString
  }

  turn(angle) {
    this.rotationAngle += angle
  }
}

export { Ship }
