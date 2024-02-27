const gameWidth = window.innerWidth
const gameHeight = window.innerHeight - 20

class Mass {
  constructor(x, y, mass, radius, rotationAngle, xSpeed, ySpeed, rotationSpeed) {
    this.x = x;
    this.y = y;
    this.mass = mass || 1;
    this.radius = radius || 50;
    this.rotationAngle = rotationAngle || 0;
    this.xSpeed = xSpeed || 0;
    this.ySpeed = ySpeed || 0;
    this.rotationSpeed = rotationSpeed || 0;
  }

  update(elapsed) {
    this.x += this.xSpeed * elapsed;
    this.y += this.ySpeed * elapsed;
    this.rotationAngle += this.rotationSpeed * elapsed;

    if (this.x - this.radius > gameWidth) this.x = -this.radius
    if (this.x + this.radius < 0) this.x = gameWidth + this.radius
    if (this.y - this.radius > gameHeight) this.y = -this.radius
    if (this.y + this.radius < 0) this.y = gameHeight + this.radius
  }

  push(angle, force, elapsed) {
    this.xSpeed += elapsed * (Math.cos(angle) * force) / this.mass
    this.ySpeed += elapsed * (Math.sin(angle) * force) / this.mass
  }

  twist(force, elapsed) {
    this.rotationSpeed += elapsed * force / this.mass
  }

  speed() {
    return Math.sqrt(Math.pow(this.xSpeed, 2) = Math.pow(this.ySpeed, 2))
  }

  movementAngle() {
    return Math.atan2(this.ySpeed, this.xSpeed)
  }
}

export { Mass };