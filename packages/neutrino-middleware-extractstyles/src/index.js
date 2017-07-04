'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const ExtractTextPlugin = require('extract-text-webpack-plugin')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
  // We want to start from a clean slate. This removes any existing "style"
  // rule that may exist (present if using the default neutrino-preset-web).
  neutrino.config.module.rules.delete('style')

  const { loaderOptions = {}, pluginOptions = {} } = options
  const styleRule = neutrino.config.module
    .rule('style')
    .test(loaderOptions.test || /\.css$/)

  const loaders = ExtractTextPlugin.extract(Object.assign({
    fallback: 'style-loader',
    use: 'css-loader'
  }, loaderOptions))

  loaders.forEach(({ loader, options }) => styleRule.use(loader)
    .loader(loader)
    .options(options)
  )

  neutrino.config.plugin('extract')
    .use(ExtractTextPlugin, [Object.assign({ filename: '[name].css' }, pluginOptions)])
}
