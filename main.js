import { Asteroid } from './classes/asteroid.js'
import { Ship } from './classes/ship.js'

const asteroids = []

for (let i = 0; i < 5; i++) {
  const asteroid = new Asteroid(
    Math.random() * 600,
    Math.random() * 400,
    2000 + Math.random() * 8000
  )

  asteroid.push(Math.PI * 2 * Math.random(), 1000, 60)
  asteroid.twist((Math.random() - 0.5) * 1000, 60)
  asteroids.push(asteroid)
}

const ship = new Ship(300, 200)

let previous, elapsed

const draw = () => {
  let svgString = initSVG()

  asteroids.forEach((asteroid) => (svgString += asteroid.draw()))
  svgString += ship.draw()

  svgString += closeSVG()

  document.getElementById('asteroids').innerHTML = svgString
}

const update = () => {
  asteroids.forEach((asteroid) => asteroid.update(elapsed / 1000))
  ship.update(elapsed / 1000)
}

const frame = (timeStamp) => {
  if (!previous) previous = timeStamp
  elapsed = timeStamp - previous
  draw()
  update()
  previous = timeStamp
  requestAnimationFrame(frame)
}

requestAnimationFrame(frame)

const initSVG = () => {
  return `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" id="asteroidsSVG" >`
}

const closeSVG = () => {
  return `</svg>`
}

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      ship.turn(-10)
      break
    case 'ArrowRight':
      ship.turn(10)
      break
    case 'ArrowUp':
      ship.push((ship.rotationAngle / 360) * 2 * Math.PI, 10, elapsed)
      break
    case 'ArrowDown':
      ship.push((ship.rotationAngle / 360) * 2 * Math.PI - Math.PI, 10, elapsed)
      break
  }
})
