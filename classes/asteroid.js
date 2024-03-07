import { Mass } from './mass.js'

class Asteroid extends Mass {
  constructor(x, y, mass, xSpeed, ySpeed, rotationSpeed) {
    const density = 1
    const radius = Math.sqrt(mass / density / Math.PI)

    super(x, y, mass, radius, 0, xSpeed, ySpeed, rotationSpeed)
    this.circumference = 2 * Math.PI * this.radius
    this.segments = Math.ceil(this.circumference / 15)
    this.segments = Math.min(25, Math.max(5, this.segments))
    this.noise = 0.2
    this.radiusArray = []
    this.randomiseRadii(this.noise)
  }

  draw() {
    const segmentAngle = 360 / this.segments

    let asteroidString = `<g transform="translate(${this.x} ${this.y}) rotate(${this.rotationAngle})" stroke="white">`
    let pathString = `<path `

    for (let i = 0; i < this.segments - 1; i++) {
      const segmentRadius = this.radiusArray[i]

      const angle = (i + 1) * segmentAngle
      const angleRads = (angle / 360) * 2 * Math.PI
      const deltaX = Math.round(Math.sin(angleRads) * segmentRadius)
      const deltaY = Math.round(
        segmentRadius - Math.cos(angleRads) * segmentRadius - segmentRadius
      )

      if (i === 0) {
        pathString += ` d="M ${0} ${-segmentRadius}`
      } else {
        pathString += ` L ${deltaX} ${deltaY}`
      }
    }

    pathString += ` Z" stroke-width="2" fill="black" />`
    asteroidString += pathString

    asteroidString += `</g>`

    return asteroidString
  }

  randomiseRadii(noise = 0.2) {
    for (let i = 0; i < this.segments; i++) {
      const radiusFactor = noise * (Math.random() - 0.5)
      this.radiusArray.push(this.radius + this.radius * radiusFactor)
    }
  }

  child(mass) {
    return new Asteroid(
      this.x, this.y, mass, this.xSpeed, this.ySpeed, this.rotationSpeed
    )
  }
}

export { Asteroid }
