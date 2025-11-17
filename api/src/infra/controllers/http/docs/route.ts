import { Scalar } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { openAPIRouteHandler } from 'hono-openapi'

interface DocsRouteDeps {
  server: Hono
}

export const make = (deps: DocsRouteDeps): Hono => {
  const { server } = deps
  const route = new Hono()

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
      url: '/api/v1/openapi', // where your OpenAPI JSON is served
      theme: 'default', // optional: 'default', 'alternate', 'moon', etc.
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
