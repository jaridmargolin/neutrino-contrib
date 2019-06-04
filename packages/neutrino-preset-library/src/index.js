'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */


// 3rd party
const { defaultsDeep } = require('lodash');
const library = require('@neutrinojs/library');

// neutrino-contib
const middlewareBundleAnalyzer = require('neutrino-middleware-bundleanalyzer')

/* -----------------------------------------------------------------------------
 * neutrino-preset-library
 * -------------------------------------------------------------------------- */

module.exports = (options = {}) => (neutrino) => {
  defaultsDeep(options, {
    externals: { modulesFromFile: true }
  })

  neutrino.use(middlewareBundleAnalyzer())
  neutrino.use(library(options))

  // Change neutrino's default behavior (compiling only source and test) to
  // instead compile everything except modules found in node_modules. This
  // forces symlinked packages to be compiled because webpack will use the
  // realpath rather than the symlink path.
  neutrino.config.module
    .rule('compile')
      .include
      .clear()
      .end()
    .exclude
      .clear()
      .add(/\/node_modules\//)
      .end()
}
