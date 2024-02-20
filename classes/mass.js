class Mass {
  constructor(x, y, mass, radius, angle, x_speed, y_speed, rotation_speed) {
    this.x = x
    this.y = y
    this.mass = mass || 1
    this.radius = radius || 50
    this.angle = angle || 0
    this.x_speed = x_speed || 0
    this.y_speed = y_speed || 0
    this.rotation_speed = rotation_speed || 0
  }

  update() {
    this.x += this.x_speed
    this.y += this.y_speed
  }
}