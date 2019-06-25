'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const path = require('path')

// 3rd party
const _ = require('lodash')
const md5 = require('md5')
const VirtualModulePlugin = require('virtual-module-webpack-plugin')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

const requireOptions = function (options, ...args) {
  args.forEach((arg) => {
    if (!options[arg]) { throw new Error(`"options.${arg}" is required.`) }
  })
}

module.exports = (options = {}) => (neutrino) => {
  requireOptions(options, 'values')

  const { config } = neutrino
  const moduleName = `globals-${md5(options.values)}`
  let contents = `/* eslint-disable */`

  _.forEach(options.values, (val, key) => {
    contents += `\n${key} = ${JSON.stringify(val)}`
  })

  config.plugin(options.id || moduleName)
    .use(VirtualModulePlugin, [{ moduleName, contents }])

  if (options.entry) {
    _.castArray(options.entry).forEach(entry => config.entry(entry)
      .prepend(path.join(neutrino.options.root, moduleName)))
  }
}
