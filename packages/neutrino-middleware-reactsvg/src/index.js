'use strict'

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
  const reactSvgTest = /\.react\.svg$/
  const reactSvgRule = neutrino.config.module.rule('react-svg')
  const babelConfig = neutrino.config.module.rule('compile').use('babel').toConfig()

  reactSvgRule.test(reactSvgTest)

  if (babelConfig && babelConfig.loader) {
    reactSvgRule.use('babel')
      .loader(babelConfig.loader)
      .options(babelConfig.options || {})
  }

  reactSvgRule.use('react-svg')
    .loader(require.resolve('react-svg-loader'))
    .options({ ...(options.loaderOptions || {}), jsx: true })

  // ensure only specifically defined svgs are treated as components
  neutrino.config.module.rule('svg')
    .exclude.add(reactSvgTest)
}