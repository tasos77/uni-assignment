# Base
FROM oven/bun AS base
WORKDIR /src

# Build
FROM base AS build
COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build

# Run
FROM base
ENV PORT=3001
ENV HOST=0.0.0.0
COPY --from=build /src/.output /src/.output
CMD [ "node", ".output/server/index.mjs" ]
