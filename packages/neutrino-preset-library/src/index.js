'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const { join, dirname } = require('path')
const { exec } = require('child_process')

// 3rd party
const merge = require('deepmerge')
const Future = require('fluture')
const opn = require('opn')
const presetKarma = require('neutrino-preset-karma')
const middlewareCompileLoader = require('neutrino-middleware-compile-loader')
const middlewareEnv = require('neutrino-middleware-env')
const middlewareEsBuild = require('neutrino-middleware-esbuild')
const middlewareClean = require('neutrino-middleware-clean')
const middlewareMinify = require('neutrino-middleware-minify')
const middlewareDevServer = require('neutrino-middleware-dev-server')
const middlewareStandardjs = require('neutrino-middleware-standardjs')
const middlewareJSDoc = require('neutrino-middleware-jsdoc')
const middlewareBundleAnalyzer = require('neutrino-middleware-bundleanalyzer')

/* -----------------------------------------------------------------------------
 * neutrino-preset-library
 * -------------------------------------------------------------------------- */

// https://github.com/vuejs/vue-loader/issues/666#issuecomment-281966916
process.noDeprecation = true

module.exports = (neutrino, _options = {}) => {
  if (!_options.library) {
    throw new Error('Missing required option, `library`, in neutrino-preset-library')
  }

  neutrino.use(middlewareStandardjs)

  /* ---------------------------------------------------------------------------
   * compile
   * ------------------------------------------------------------------------ */

  const MODULES = join(__dirname, 'node_modules')
  const options = merge({
    libraryTarget: 'umd',
    supportedBrowsers: [
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'last 2 Edge versions',
      'last 2 Opera versions',
      'last 2 Safari versions',
      'last 2 iOS versions'
    ]
  }, _options)

  // shared between bundle + es distro
  const babelOptions = middlewareCompileLoader.merge({
    presets: [[require.resolve('babel-preset-env'), {
      debug: neutrino.options.debug,
      modules: false,
      useBuiltIns: true,
      targets: { browsers: [] }
    }]]
  }, options.babel)

  // if no browsers are set, add our default supported browsers
  const presetEnvOptions = babelOptions.presets[0][1]
  if (!presetEnvOptions.targets.browsers.length) {
    presetEnvOptions.targets.browsers.push(...options.supportedBrowsers)
  }

  const babelCompileOptions = middlewareCompileLoader.merge({
    plugins: [require.resolve('babel-plugin-transform-runtime')]
  }, babelOptions)

  neutrino.config
    .context(neutrino.options.root)

  neutrino.config
    .entry('index')
      .add(neutrino.options.entry)

  neutrino.config
    .output
      .path(neutrino.options.output)
      .publicPath('./')
      .filename(options.filename || '[name].js')
      .library(options.library)
      .libraryTarget(options.libraryTarget)

  // ensure modules are resolved from this repo and from to consuming repo
  neutrino.config
    .resolve
      .modules
        .add('node_modules')
        .add(neutrino.options.node_modules)
        .add(MODULES)
        .end()
      .end()
    .resolveLoader
      .modules
        .add(neutrino.options.node_modules)
        .add(MODULES)

  // node global pollyfill behavior
  neutrino.config
    .node
      .set('Buffer', false)
      .set('fs', 'empty')
      .set('tls', 'empty')

  neutrino.use(middlewareEnv)
  neutrino.use(middlewareCompileLoader, {
    include: [
      neutrino.options.source,
      neutrino.options.tests
    ],
    babel: babelCompileOptions
  })

  neutrino.use(middlewareEsBuild, babelOptions)
  neutrino.use(middlewareBundleAnalyzer)

  if (process.env.NODE_ENV === 'development') {
    neutrino.use(middlewareDevServer, options.devServer)
    neutrino.config.devtool('source-map')
  }

  if (process.env.NODE_ENV === 'production') {
    neutrino.use(middlewareClean, { paths: [neutrino.options.output] })
  }

  /* ---------------------------------------------------------------------------
   * karma (testing)
   * ------------------------------------------------------------------------ */

  neutrino.use(presetKarma)

  neutrino.register('view-cov', () => Future((reject, resolve) => {
    const reportDir = join(process.cwd(), '.coverage', 'report-html')

    opn(`file://${reportDir}/index.html`, { wait: false })
      .then(__ => resolve(''), reject)
  }))
  neutrino.register('publish-cov', () => Future((reject, resolve) => {
    const coverallsPath = require.resolve('coveralls/bin/coveralls')
    const coveragePath = join(process.cwd(), '.coverage', 'report-lcov',
      'lcov.info')

    exec(`cat ${coveragePath} | ${coverallsPath}`, (err, stdout, stderr) => (
      err ? reject(stderr) : resolve('')
    ))
  }))

  /* ---------------------------------------------------------------------------
   * docs
   * ------------------------------------------------------------------------ */

  neutrino.use(middlewareJSDoc)
}
