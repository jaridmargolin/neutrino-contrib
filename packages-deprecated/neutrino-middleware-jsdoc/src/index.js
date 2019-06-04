'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const { dirname, join } = require('path')
const { execFile } = require('child_process')

// 3rd party
const Future = require('fluture')
const opn = require('opn')

/* -----------------------------------------------------------------------------
 * middleware
 * -------------------------------------------------------------------------- */

module.exports = (neutrino, options = {}) => {
  const baseDir = process.cwd()
  const srcDir = join(baseDir, 'src')
  const destDir = join(baseDir, 'docs')
  const pkg = require(join(baseDir, 'package.json'))

  const buildDocs = Future((reject, resolve) => {
    execFile(`${require.resolve('jsdoc/jsdoc')}`, [
      srcDir,
      '--readme',
      join(baseDir, 'README.md'),
      '--destination',
      destDir,
      '--template',
      dirname(require.resolve('docdash/package.json'))
    ], (error, stdout, stderr) => {
      return error
        ? reject(error)
        : resolve('')
    })
  })

  const openDocs = Future.encaseP(() => (
    opn(`file://${destDir}/index.html`, { wait: false }).then(__ => '')
  ))

  neutrino.register('view-docs', () => buildDocs.chain(openDocs))
  neutrino.register('build-docs', () => buildDocs)
}
