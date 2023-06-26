# This dockerfile builds an image for the backend package.
# It should be executed with the root of the repo as docker context.
#
# Before building this image, be sure to have run the following commands in the repo root:
#
# yarn install
# yarn tsc
# yarn build
#
# Once the commands have been run, you can build the image using `yarn build-image`

FROM node:18-bullseye-slim

RUN apt-get update && apt-get upgrade -y
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install mkdocs-techdocs-core==1.0.1

# install sqlite3 dependencies
RUN apt-get install -y libsqlite3-dev cmake g++
RUN yarn config set python /usr/bin/python3

# From here on we use the least-privileged `node` user to run the backend.
USER node

# This should create the app dir as `node`.
# If it is instead created as `root` then the `tar` command below will fail: `can't create directory 'packages/': Permission denied`.
# If this occurs, then ensure BuildKit is enabled (`DOCKER_BUILDKIT=1`) so the app dir is correctly created as `node`.
WORKDIR /app

# This switches many Node.js dependencies to production mode.
ENV NODE_ENV production


# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
COPY --chown=node:node yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN --mount=type=cache,target=/home/node/.cache/yarn,sharing=locked,uid=1000,gid=1000 \
    yarn install --frozen-lockfile --production --network-timeout 400000

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY --chown=node:node packages/backend/dist/bundle.tar.gz app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz
# RUN file="$(ls /app/plugins/application-backend/migrations/)" && echo $file
USER root
RUN rm -rf "$(yarn cache dir)"
RUN rm -rf /var/lib/apt/lists/*
USER node
CMD ["node", "packages/backend", "--config", "app-config.yaml"]
# CMD [ "bash" ]

# FROM gcr.io/distroless/nodejs18-debian11

# COPY --from=build /app /
# EXPOSE 3000
# CMD ["bash"]