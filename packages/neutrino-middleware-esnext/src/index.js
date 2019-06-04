'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const { readFileSync } = require('fs')
const { resolve } = require('path')

// 3rd party
const findRoot = require('find-root')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (__ = {}) => (neutrino) => {
  neutrino.config.resolve.mainFields
      .add('esnext')
      .add('browser')
      .add('module')
      .add('main')

  neutrino.config.module.rule('compile').include.add((filepath) => {
    const pkgPath = resolve(findRoot(filepath), 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, { encoding: 'utf-8' }))

    return pkg.hasOwnProperty('esnext')
  })
}
