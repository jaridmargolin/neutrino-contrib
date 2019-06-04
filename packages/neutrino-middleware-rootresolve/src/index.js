'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const { RootMostResolvePlugin } = require ('webpack-dependency-suite')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (options = {}) => (neutrino) => {
  neutrino.config.resolve.plugin('root-resolver')
    .use(RootMostResolvePlugin, [process.cwd(), true, true])
}
