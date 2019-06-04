'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const merge = require('deepmerge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (options = {}) => (neutrino) => {
  if (process.env.NODE_ENV === 'production') {
    neutrino.config.plugin('analyzer')
      .use(BundleAnalyzerPlugin, [merge({
        reportFilename: '_report.html',
        analyzerMode: 'static',
        openAnalyzer: false,
        logLevel: 'silent'
      }, options)])
  }
}
