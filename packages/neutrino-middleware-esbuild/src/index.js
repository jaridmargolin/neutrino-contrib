'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const { promisify } = require('util')
const { join } = require('path')

// 3rd party
const { outputFile } = require('fs-extra')
const babel = require('babel-core')
const dir = require('node-dir')

// modified deps
const transformFile = promisify(babel.transformFile).bind(babel)

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
  const outputRoot = join(neutrino.options.output, 'es')
  const transformAndWrite = (file) => {
    const outPath = file.replace(neutrino.options.source, outputRoot)

    return transformFile(file, options)
      .then(result => outputFile(outPath, result.code, 'utf8'))
  }

  if (process.env.NODE_ENV === 'production') {
    neutrino.on('build', __ => dir.promiseFiles(neutrino.options.source)
      .then((files) => Promise.all(files.map(transformAndWrite))))
  }
}
