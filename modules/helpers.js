const helpers = {
  degreesToRads(degrees) {
    return (degrees / 180) * Math.PI;
  },

  radsToDegrees(rads) {
    return (rads / (Math.PI * 2)) * 360;
  },
};

export { helpers };
