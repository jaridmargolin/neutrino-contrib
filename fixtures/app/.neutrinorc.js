const jest = require('@neutrinojs/jest')
const standardjs = require('@neutrinojs/standardjs')
const globalvar = require('neutrino-middleware-globalvar')
const less = require('neutrino-middleware-less')
const webapp = require('neutrino-preset-webapp')

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    standardjs(),
    globalvar({ name: 'title', value: 'Global Title', addToEntry: 'index' }),
    globalvar({ name: 'description', value: 'Global Description', addToEntry: 'index' }),
    webapp(),
    less(),
    jest()
  ],
};
