'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const path = require('path')

// 3rd party
const { each } = require('lodash')
const resolveCwd = require('resolve-cwd');
const CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, chunks = {}) => {
  const entries = Object.keys(neutrino.config.entryPoints.entries())
  const stemsFrom = (module) => {
    const issuers = []
    while(module.context) {
      issuers.push(module.context)
      module = module.issuer || {}
    }

    return name => issuers.some((issuer) => (
      `${issuer}/`.includes(`/${name}/`)
    ))
  }

  each(chunks, (pkgs, name) => (
    neutrino.config.plugin(`${name}-chunk`).use(CommonsChunkPlugin, [{
      name: name,
      chunks: entries,
      minChunks: module => pkgs.some(stemsFrom(module))
    }])
  ))

  neutrino.config.plugin('manifest-chunk').use(CommonsChunkPlugin, [{
    name: 'manifest',
    minChunks: Infinity
  }])
}
