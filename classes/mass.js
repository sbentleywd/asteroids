const gameWidth = 600
const gameHeight = 400

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
}

export { Mass };