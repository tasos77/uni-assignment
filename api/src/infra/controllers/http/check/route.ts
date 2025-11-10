import { Hono } from 'hono'
export const make = () => {
  const route = new Hono()
  route.get('/alive', async (c) => {
    return c.text('Alive')
  })

  route.get('/ready', async (c) => {
    return c.text('Ready')
  })

  return route
}
