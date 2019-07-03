'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const RootResolverPlugin = require ('root-resolver-plugin')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (options = {}) => (neutrino) => {
  neutrino.config.resolve.plugin('root-resolver')
    .use(RootResolverPlugin)
}
