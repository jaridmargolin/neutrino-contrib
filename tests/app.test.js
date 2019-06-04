'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
import path from 'path'
import { execFile } from 'child_process'
import { mkdirp, writeJSON, stat } from 'fs-extra'
import { promisify } from 'util'

// 3rd party
import test from 'ava';
import puppeteer from 'puppeteer';

// lib
import withFileServer from './utils/with-file-server';

/* -----------------------------------------------------------------------------
 * test
 *
 * High level in integration test to ensure things are "roughly" working.
 *
 * Testing config output alone (unit testing) does not give us confidence that
 * the config is actually working for a given tool.
 * -------------------------------------------------------------------------- */

const execFileP = promisify(execFile)

const appDir = path.join('__dirname', '..', 'fixtures', 'app')
const appBuildDir = path.join(appDir, 'dist')
const appBuildStaticDir = path.join(appBuildDir, 'static')

test('builds app', async t => {
  // ensure static assets aren't cleared
  await mkdirp(appBuildStaticDir)
  await writeJSON(path.join(appBuildStaticDir, 'existing.json'), {
    copied: 'false'
  })

  await execFileP('yarn', ['run', 'build'], { cwd: appDir })

  // bundleanalyzer
  const report = await stat(path.join(appBuildDir, '_report.html'))
  t.true(report.isFile())

  // clean/copy
  const copied = await stat(path.join(appBuildStaticDir, 'copied.json'))
  const existing = await stat(path.join(appBuildStaticDir, 'existing.json'))
  t.true(copied.isFile())
  t.true(existing.isFile())

  // check render/svg
  await withFileServer({ public: appBuildDir })(async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const h1 = await page.$('h1');
    const p = await page.$('p');
    const span = await page.$('span');
    const svg = await page.$('svg');

    t.is(await page.evaluate(el => el.textContent, h1), 'Global Title');
    t.is(await page.evaluate(el => el.textContent, p), 'Global Description');
    t.is(await page.evaluate(el => el.textContent, span), 'RootMost');
    t.truthy(svg);

    await browser.close();
  })
});
