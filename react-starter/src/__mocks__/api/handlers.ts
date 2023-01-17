import { rest } from 'msw'

const url = (path: string) => new URL(path, import.meta.env.VITE_API_SERVER_URL).toString()

export const handlers = [
  rest.get(url('/user'), (req, res, ctx) =>
    res(
      ctx.status(402),
      ctx.json({
        errorMessage: 'auth error',
      })
    )
  ),
  rest.get(url('/login'), (req, res, ctx) =>
    res(
      ctx.status(500),
      ctx.json({
        errorMessage: 'server error',
      })
    )
  ),
]
