'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const merge = require('deepmerge')
const regexCombiner = require('regex-combiner')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (options = {}) => (neutrino) => {
  const reactSvgTest = /\.react\.svg$/
  const reactSvgRule = neutrino.config.module.rule('react-svg')
  const compileRule = neutrino.config.module.rule('compile')
  const imageRule = neutrino.config.module.rule('image')

  const defaultLoaderOptions = {
    svgo: { plugins: [{ removeViewBox: false }, { cleanupIDs: false }] },
    jsx: true
  }

  if (compileRule) {
    const { test } = compileRule.toConfig()

    compileRule
      .test(regexCombiner([test, reactSvgTest]))
  }

  reactSvgRule
    .test(reactSvgTest)
    .use('react-svg')
    .loader(require.resolve('react-svg-loader'))
    .options(merge(defaultLoaderOptions, options.loaderOptions || {}))

  // ensure only specifically defined svgs are treated as components
  imageRule
    .exclude
    .add(reactSvgTest)
}
