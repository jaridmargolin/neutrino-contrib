'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const path = require('path')

// 3rd party (libs)
const merge = require('deepmerge')
const webpack = require('webpack')
const ip = require('ip')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// 3rd party (middleware)
const presetReact = require('neutrino-preset-react')
const middlewareReactSVG = require('neutrino-middleware-reactsvg')
const middlewareRootResolve = require('neutrino-middleware-rootresolve')
const middlewareExtractStyles = require('neutrino-middleware-extractstyles')
const middlewareLess = require('neutrino-middleware-less')
const middlewareOptimizeCss = require('neutrino-middleware-optimizecss')
const middlewareBundleAnalyzer = require('neutrino-middleware-bundleanalyzer')

/* -----------------------------------------------------------------------------
 * neutrino-web-app
 * -------------------------------------------------------------------------- */

// https://github.com/vuejs/vue-loader/issues/666#issuecomment-281966916
process.noDeprecation = true

module.exports = (neutrino, opts = {}) => {
  neutrino.options.output = path.join(neutrino.options.root, 'dist')

  neutrino.use(presetReact, opts)
  neutrino.use(middlewareReactSVG)
  neutrino.use(middlewareRootResolve)
  neutrino.use(middlewareExtractStyles)
  neutrino.use(middlewareLess)
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

  // Change neutrino's default behavior to compile everything except modules
  // found in node_modules. This forces symlinked packages to be compiled
  // because webpack will use the realpath rather than the symlink path.
  neutrino.config.module
    .rule('compile')
    .include
      .clear()
      .end()
    .exclude
      .clear()
      .add(/\/node_modules\//)
      .end()

  // Overwite web/react presets' babel config in favor of using .babelrc
  neutrino.config.module
    .rule('compile')
    .use('babel')
    .tap(__ => ({ cacheDirectory: false }))

  // transform lodash -> lodash-es... required due to lodash-es not
  // supporting lodash/fp
  neutrino.config.plugin('replace-lodash-es')
    .use(webpack.NormalModuleReplacementPlugin, [/^lodash-es(\/|$)/, (res) => {
      res.request = res.request.replace(/^lodash-es(\/|$)/, 'lodash$1')
    }])

  if (process.env.NODE_ENV === 'development') {
    neutrino.config.devServer
      .host('0.0.0.0')
      .public(ip.address())
  }

  if (process.env.NODE_ENV !== 'development') {
    neutrino.config.plugin('ignore-logger')
      .use(webpack.IgnorePlugin, [/redux-logger/])

    neutrino.config.plugin('clean')
      .tap(args => [args[0], merge(args[1], { exclude: ['static'] })])
  }

  if (process.env.NODE_ENV === 'production') {
    // default neutrino babili plugin was > 10x slower
    neutrino.config.plugin('minify')
      .use(UglifyJSPlugin, [{
        parallel: true,
        uglifyOptions: {
          compress: { reduce_funcs: false }
        }
      }])
  }
}
