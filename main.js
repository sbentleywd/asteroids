import { Asteroid } from './classes/asteroid.js'

const asteroid1 = new Asteroid(9, 200, 200, 100, 1)

let previous, elapsed

const draw = () => {
  let svgString = initSVG()

  svgString += asteroid1.draw()

  svgString += closeSVG()

  document.getElementById('asteroids').innerHTML = svgString
}

const upDate = () => {
  asteroid1.upDate()
}

const frame = (timeStamp) => {
  if (!previous) previous = timeStamp
  elapsed = previous - timeStamp
  draw()
  upDate()
  previous = timeStamp
  requestAnimationFrame(frame)
}

requestAnimationFrame(frame)

const initSVG = () => {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" id="asteroidsSVG" >`
}

const closeSVG = () => {
  return `</svg>`
}
