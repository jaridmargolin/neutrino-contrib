'use strict'

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (options = {}) => (neutrino) => {
  const styleRule = neutrino.config.module.rule('style')
  const styleTest = /\.(css|less)$/

  styleRule.test(styleTest)
  styleRule.oneOf('normal')
    .test(styleTest)
    .use('less')
    .loader(require.resolve('less-loader'))
}
