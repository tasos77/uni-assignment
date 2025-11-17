FROM oven/bun:alpine AS base
WORKDIR /usr/src/app

ARG DATABASE_URL
ARG SERVER_PORT
ARG JWT_SECRET
ARG ALG

ENV DATABASE_URL=$DATABASE_URL
ENV SERVER_PORT=$SERVER_PORT
ENV JWT_SECRET=$JWT_SECRET
ENV ALG=$ALG

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
# install with --production
RUN mkdir -p /temp/prod
COPY . /temp/prod/
RUN cd /temp/prod && bun install

# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY . .

# copy production dependencies and source code into final image
FROM base AS release
# Install missing openssl
RUN apk add --no-cache openssl
WORKDIR /usr/src/app
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/ .

# run the app: run one-time setup (generate + migrate) then start the long-running server
ENTRYPOINT [ "sh", "-c" ]
CMD ["bun generate-gifts && bun migrate && bun run start"]
