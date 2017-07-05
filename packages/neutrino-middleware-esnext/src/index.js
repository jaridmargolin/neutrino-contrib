'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const { readFileSync } = require('fs')
const { resolve } = require('path')

// 3rd party
const findRoot = require('find-root')
const isPathInside = require('is-path-inside')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
  const nodeModulesDir = resolve(__dirname, 'node_modules')

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
