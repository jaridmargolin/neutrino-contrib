'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const path = require('path')

// 3rd party (libs)
const _ = require('lodash')
const merge = require('deepmerge')
const webpack = require('webpack')

// 3rd party (middleware)
const presetReact = require('neutrino-preset-react')
const middlewareStandardReact = require('neutrino-middleware-standardreact')
const middlewareExtractStyles = require('neutrino-middleware-extractstyles')
const middlewareOptimizeCss = require('neutrino-middleware-optimizecss')
const middlewareBundleAnalyzer = require('neutrino-middleware-bundleanalyzer')

/* -----------------------------------------------------------------------------
 * neutrino-web-app
 * -------------------------------------------------------------------------- */

// https://github.com/vuejs/vue-loader/issues/666#issuecomment-281966916
process.noDeprecation = true

module.exports = (neutrino) => {
  neutrino.options.output = path.join(neutrino.options.root, 'dist')

  neutrino.use(presetReact)
  neutrino.use(middlewareStandardReact)
  neutrino.use(middlewareExtractStyles)
  neutrino.use(middlewareOptimizeCss)
  neutrino.use(middlewareBundleAnalyzer)

  neutrino.config.stats({
    hash: false,
    assets: false,
    chunks: false,
    children: false,
    version: false,
    colors: true
  })

  neutrino.config.module
    .rule('compile')
    .use('babel')
    .tap((options) => merge(options, {
      presets: [ require.resolve('babel-preset-stage-0') ],
      plugins: [ require.resolve('babel-plugin-lodash') ]
    }))

  // transform lodash -> lodash-es... required due to lodash-es not
  // supporting lodash/fp
  neutrino.config.plugin('replace-lodash-es')
    .use(webpack.NormalModuleReplacementPlugin, [/^lodash-es(\/|$)/, (res) => {
      res.request = res.request.replace(/^lodash-es(\/|$)/, 'lodash$1');
    }])

  if (process.env.NODE_ENV === 'development') {
    neutrino.config.devServer.host('0.0.0.0')
  }

  if (process.env.NODE_ENV !== 'development') {
    neutrino.config.plugin('ignore-logger')
      .use(webpack.IgnorePlugin, [/redux-logger/])

    neutrino.config.plugin('clean')
      .tap(args => [args[0], merge(args[1], { exclude: ['static'] })])
  }
}
