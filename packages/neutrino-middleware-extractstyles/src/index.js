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
  const isStart = neutrino.options.command === 'start'
  const styleRule = neutrino.config.module.rule('style')
  const styleTest = styleRule.get('test')
  const styleFallback = {
    loader: styleRule.use('style').get('loader'),
    options: styleRule.use('style').get('options'),
  }

  options = Object.assign({
    hot: true,
    cssHotLoader: {},
    extract: {},
    plugin: {},
    fallback: null,
    use: null,
  }, options);

  const styleLoaders = Array.from(styleRule.uses.store.keys())
    .filter((key) => key !== 'style')
    .map((key) => styleRule.use(key))
    .map((use) => ({loader: use.get('loader'), options: use.get('options')}))

  const extractOptions = Object.assign({
    fallback: options.fallback || styleFallback || 'style-loader',
    use: options.use || styleLoaders || 'css-loader',
  }, options.extract)

  const pluginOptions = Object.assign({
    filename: isStart ? '[name].css' : '[name].[contenthash].css',
  }, options.plugin)

  const loaders = ExtractTextPlugin.extract(extractOptions)

  // css-hot-loader must be first
  if (options.hot) {
    loaders.unshift({
      loader: 'css-hot-loader',
      options: options.cssHotLoader,
    })
  }

  styleRule.uses.clear()

  loaders.forEach(({loader, options}) => {
    styleRule.use(loader).loader(loader).options(options)
  })

  neutrino.config.plugin('extract')
    .use(ExtractTextPlugin, [pluginOptions])
}
