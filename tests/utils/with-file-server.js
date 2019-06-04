'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// lib
const http = require('http');

// 3rd party
const handler = require('serve-handler');

/* -----------------------------------------------------------------------------
 * withFileServer
 * -------------------------------------------------------------------------- */

const withFileServer = ({ port = 3000, ...opts } = {}) => fn => new Promise((res) => {
  const server = http.createServer((req, res) => handler(req, res, opts));

  server.listen(port, async () => {
    await fn(`http://localhost:${port}`);
    server.close(() => res())
  });
})

module.exports = withFileServer;
