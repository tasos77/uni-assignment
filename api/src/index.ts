import { $ } from 'bun'
import { serveStatic } from 'hono/bun'
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

// serve specific paths
server.use('/public/images/*', serveStatic({ root: './' }))
server.use('/public/logos/*', serveStatic({ root: './' }))
export default server
