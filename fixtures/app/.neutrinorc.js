const jest = require('@neutrinojs/jest')
const standardjs = require('@neutrinojs/standardjs')
const globals = require('neutrino-middleware-globals')
const less = require('neutrino-middleware-less')
const webapp = require('neutrino-preset-webapp')

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    standardjs(),
    globals({
      entry: 'index',
      values: { title: 'Global Title', description: 'Global Description' }
    }),
    webapp(),
    less(),
    jest()
  ],
};
