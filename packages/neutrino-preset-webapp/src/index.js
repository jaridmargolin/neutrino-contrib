'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const path = require('path')

// 3rd party (libs)
const merge = require('deepmerge')

// 3rd party (middleware)
const presetReact = require('@neutrinojs/react')
const middlewareCopy = require('@neutrinojs/copy')
const middlewareStyleMinify = require('@neutrinojs/style-minify');

// neutrino-contrib
const middlewareReactSVG = require('neutrino-middleware-reactsvg')
const middlewareRootResolve = require('neutrino-middleware-rootresolve')
const middlewareBundleAnalyzer = require('neutrino-middleware-bundleanalyzer')

/* -----------------------------------------------------------------------------
 * neutrino-web-app
 * -------------------------------------------------------------------------- */

// https://github.com/vuejs/vue-loader/issues/666#issuecomment-281966916
process.noDeprecation = true

module.exports = (options = {}) => (neutrino) => {
  // TODO: Remove and use the default neutrino output, `build`.
  neutrino.options.output = path.join(neutrino.options.root, 'dist')

  neutrino.use(presetReact(options))
  neutrino.use(middlewareReactSVG())
  neutrino.use(middlewareRootResolve())
  neutrino.use(middlewareBundleAnalyzer())
  neutrino.use(middlewareCopy({
    patterns: [{
      from: path.join(neutrino.options.source, 'static'),
      to: path.join(neutrino.options.output, 'static')
    }]
  }))

  // Disable display of generated assets. Helpful to reduce noise when utilizing
  // plugins which generate a large number of files (ex: favicon).
  // TODO: replace this with `excludeAssets` regexp
  neutrino.config.stats({
    hash: false,
    assets: false,
    chunks: false,
    children: false,
    version: false,
    colors: true
  })

  // Change neutrino's default behavior (compiling only source and test) to
  // instead compile everything except modules found in node_modules. This
  // forces symlinked packages to be compiled because webpack will use the
  // realpath rather than the symlink path.
  //
  // Note: By default, @neutrino/react supports react-native-web with the
  // exception of correctly compiling react-native-* dependencies. We will also
  // fix this shortcomming.
  neutrino.config.module
    .rule('compile')
    .include
      .clear()
      .end()
    .exclude
      .clear()
      .add(/node_modules(?!\/react-native-)/)
      .end()

  if (process.env.NODE_ENV === 'production') {
    neutrino.config.plugin('clean')
      .tap(args => [merge(args[0], {
        cleanOnceBeforeBuildPatterns: ['**/*', '!static', '!static/**/*']
      })])

    neutrino.use(middlewareStyleMinify());
  }
}
