import { $ } from 'bun'
import type { Hono } from 'hono'
import type { PostgreRepository } from './core/repositories/postgre/repository'
import type { DBManagerService } from './core/services/dbManager/service'
import * as dbmService from './core/services/dbManager/service'
import type { TokenManagerService } from './core/services/tokenManager/service'
import type { UniStudentsUsecase } from './core/usecases/uniStudents/usecase'
import * as usUsecase from './core/usecases/uniStudents/usecase'
import { conf as config } from './infra/config'
import * as aRoute from './infra/controllers/http/auth/route'
import * as cRoute from './infra/controllers/http/check/route'
import * as dRoute from './infra/controllers/http/docs/route'
import * as gRoute from './infra/controllers/http/gifts/route'
import { onErrorHandler } from './infra/controllers/http/onError'
import server from './infra/controllers/http/server'
import * as uRoute from './infra/controllers/http/user/route'
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
const uniStudentsUsecase: UniStudentsUsecase = usUsecase.make({ dbManagerService, tokenManagerService })

// init routes
const authRoute: Hono = aRoute.make({ uniStudentsUsecase })
const giftsRoute: Hono = gRoute.make({ uniStudentsUsecase })
const userRoute: Hono = uRoute.make({ uniStudentsUsecase })
const checkRoute: Hono = cRoute.make()

// use routes
const basePath = '/api/v1'
server.route(basePath, checkRoute)
server.route(basePath, authRoute)
server.route(basePath, giftsRoute)
server.route(basePath, userRoute)

// generate docs from route instances
const docsRoute: Hono = dRoute.make({ server })
server.route(basePath, docsRoute)

// use custom onError handler
server.onError(onErrorHandler)

export default server
