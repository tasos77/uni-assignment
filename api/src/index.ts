import { serveStatic } from 'hono/bun'
import server from './infra/controllers/http/server'
server.use('/public/images/*', serveStatic({ root: './' }))
server.use('/public/logos/*', serveStatic({ root: './' }))
export default server
