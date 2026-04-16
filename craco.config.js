const Critters = require('critters-webpack-plugin');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new Critters({
          preload: 'swap',
          pruneSource: false,
        }),
      ],
    },
  },
};