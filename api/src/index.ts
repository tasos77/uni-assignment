import { $ } from 'bun'
import type { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import type { PostgreRepository } from './core/repositories/postgre/repository'
import type { DBManagerService } from './core/services/dbManager/service'
import * as dbmService from './core/services/dbManager/service'
import type { TokenManagerService } from './core/services/tokenManager/service'
import type { AuthUsecase } from './core/usecases/auth/usecase'
import * as auUsecase from './core/usecases/auth/usecase'
import { conf as config } from './infra/config'
import * as aRoute from './infra/controllers/http/auth/route'
import * as cRoute from './infra/controllers/http/check/route'
import * as dRoute from './infra/controllers/http/docs/route'
import * as gRoute from './infra/controllers/http/gifts/route'
import { onErrorHandler } from './infra/controllers/http/onError'
import server from './infra/controllers/http/server'
import * as pgRepo from './infra/repositories/postgre/repository'
import * as tmService from './infra/services/tokenManager/service'
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

// init repos
const postgreRepo: PostgreRepository = await pgRepo.make({ logger })

// init services
const dbManagerService: DBManagerService = dbmService.make({ postgreRepo })
const tokenManagerService: TokenManagerService = tmService.make({ config })

// init usecases
const authUsecase: AuthUsecase = auUsecase.make({ dbManagerService, tokenManagerService })

// init routes
const authRoute: Hono = aRoute.make({ authUsecase })
const giftsRoute: Hono = gRoute.make({ authUsecase })
const checkRoute: Hono = cRoute.make()

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

// use custom onError handler
server.onError(onErrorHandler)

export default server
