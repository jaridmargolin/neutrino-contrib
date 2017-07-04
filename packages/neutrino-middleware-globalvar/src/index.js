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

module.exports = (neutrino, options = {}) => {
  requireOptions(options, 'name', 'value')

  let value = options.value
  if (_.isObject(value)) {
    value = JSON.stringify(value)
  }

  const { config } = neutrino
  const moduleName = `${options.name}-${md5(value)}`
  const contents = `/* eslint-disable */\n${options.name} = ${value}`

  config.plugin(`globalvar-${moduleName}`)
    .use(VirtualModulePlugin, [{ moduleName, contents }])

  if (options.addToEntry) {
    _.castArray(options.addToEntry).forEach(entry => config.entry(entry)
      .prepend(path.join(neutrino.options.root, moduleName)))
  }
}
