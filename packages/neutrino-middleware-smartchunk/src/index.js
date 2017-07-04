'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const path = require('path')

// 3rd party
const _ = require('lodash')
const resolveCwd = require('resolve-cwd');
const CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
  const chunks = Object.keys(neutrino.config.entryPoints.entries())
  const stemsFrom = (module) => {
    const issuers = []
    while(module.context) {
      issuers.push(module.context)
      module = module.issuer || {}
    }

    return (resourcePath) => issuers.some(issuer => {
      return (issuer + '/').includes(resourcePath + '/')
    })
  }

  _.castArray(options).forEach((options) => {
    const pkgPaths = _.map(options.packages, (pkgName) => {
      return path.dirname(resolveCwd(`${pkgName}/package.json`))
    })

    const filePaths = _.map(options.files, (file) => {
      return path.join(neutrino.options.root, file)
    })

    const resourcePaths = pkgPaths.concat(filePaths)

    neutrino.config.plugin(`${options.name}-chunk`)
      .use(CommonsChunkPlugin, [{
        name: options.name,
        chunks: chunks,
        minChunks: (module) => resourcePaths.some(stemsFrom(module))
      }])
  })

  neutrino.config.plugin('manifest-chunk')
    .use(CommonsChunkPlugin, [{
      name: 'manifest',
      minChunks: Infinity
    }])
}
