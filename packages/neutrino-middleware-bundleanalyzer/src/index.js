'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const merge = require('deepmerge')
const Future = require('fluture')
const opn = require('opn')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

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

  neutrino.register('view-build', () => Future((reject, resolve) => {
    opn(`file://${neutrino.options.output}/_report.html`, { wait: false })
      .then(__ => resolve(''), reject)
  }))
}
