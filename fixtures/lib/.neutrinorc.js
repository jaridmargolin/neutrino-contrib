const karma = require('@neutrinojs/karma')
const standardjs = require('@neutrinojs/standardjs')
const lib = require('neutrino-preset-library')

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    standardjs(),
    lib({ name: 'Lib', externals: { whitelist: [] } }),
    karma()
  ],
};
