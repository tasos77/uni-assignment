import { $ } from 'bun'
import type { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import * as aRoute from './infra/controllers/http/auth/route'
import * as cRoute from './infra/controllers/http/check/route'
import * as dRoute from './infra/controllers/http/docs/route'
import * as gRoute from './infra/controllers/http/gifts/route'
import server from './infra/controllers/http/server'
import { logger } from './infra/utils/logger'

/// run init DB script ///
try {
  logger.info('Initing Production DB... \u{231B}')
  await $`bun initDB`
  logger.info('Initialization succeeded! \u{2705}')
} catch (e) {
  logger.error(`Initialization failed! \u{274C} \nFor reason: ${e}`)
  process.exit()
}

// init routes
const authRoute: Hono = aRoute.make()
const checkRoute: Hono = cRoute.make()
const giftsRoute: Hono = gRoute.make()

// use routes
const basePath = '/api/v1'
server.route(basePath, checkRoute)
server.route(basePath, authRoute)
server.route(basePath, giftsRoute)

// generate docs from route instances
const docsRoute: Hono = dRoute.make({ server })
server.route(basePath, docsRoute)

// serve specific paths
server.use('/public/images/*', serveStatic({ root: './' }))
server.use('/public/logos/*', serveStatic({ root: './' }))

export default server
