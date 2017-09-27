'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const { RootMostResolvePlugin } = require ('webpack-dependency-suite')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
  neutrino.config.resolve.plugin('root-resolver')
    .use(RootMostResolvePlugin, [process.cwd(), true, true])
}
