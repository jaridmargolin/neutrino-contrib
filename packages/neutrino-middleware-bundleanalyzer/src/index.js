'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const merge = require('deepmerge')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
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
