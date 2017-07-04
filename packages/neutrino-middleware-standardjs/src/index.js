'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
const eslint = require('neutrino-middleware-eslint');
const merge = require('deepmerge')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
  neutrino.use(eslint, merge({
    eslint: {
      baseConfig: { extends: ['standard'] }
    }
  }, options))

  if (!options.include && !options.exclude) {
    neutrino.config.module.rule('lint')
      .include.add(neutrino.options.source);
  }
}
