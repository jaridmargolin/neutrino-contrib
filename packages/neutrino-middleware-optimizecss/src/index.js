'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
  if (process.env.NODE_ENV !== 'devlopment') {
    neutrino.config.plugin('optimizecss')
      .use(OptimizeCssAssetsPlugin, [Object.assign({
        cssProcessorOptions: { discardComments: {removeAll: true } },
        canPrint: false
      }, options)])
  }
}
