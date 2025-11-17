import { Scalar } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { openAPIRouteHandler } from 'hono-openapi'

// docs route dependencies schema
interface DocsRouteDeps {
  server: Hono
}

// docs route implementation
export const make = (deps: DocsRouteDeps): Hono => {
  const { server } = deps
  const route = new Hono()

  // expose openapi
  route.get(
    '/openapi',
    openAPIRouteHandler(server, {
      documentation: {
        info: {
          title: 'Hono API',
          version: '1.0.0',
          description: 'Greeting API'
        },
        servers: [{ url: 'http://localhost:3000', description: 'Local Server' }]
      }
    })
  )

  // Serve the Scalar UI at /api/v1/docs
  route.get(
    '/docs',
    Scalar({
      url: '/api/v1/openapi',
      theme: 'default',
      pageTitle: 'UniAssignment API Docs',
      servers: [
        {
          url: '',
          description: 'Dev server'
        }
      ]
    })
  )

  return route
}
