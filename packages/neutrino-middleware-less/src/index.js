'use strict'

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
  neutrino.config.module.rule('style')
    .test(/(\.less|\.css)$/)
    .use('less')
    .loader(require.resolve('less-loader'))
}
