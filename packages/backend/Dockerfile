# This dockerfile builds an image for the backend package.
# It should be executed with the root of the repo as docker context.
#
# Before building this image, be sure to have run the following commands in the repo root:
#
# yarn install
# yarn tsc
# yarn build:backend
#
# Once the commands have been run, you can build the image using `yarn build-image`

FROM node:20-bullseye-slim

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
# Additionally, we install dependencies for `techdocs.generator.runIn: local`.
# https://backstage.io/docs/features/techdocs/getting-started#disabling-docker-in-docker-situation-optional   
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 python3-pip build-essential curl vim sudo && \
    yarn config set python /usr/bin/python3 && \
    pip3 install --upgrade pymdown-extensions wheel setuptools && \
    pip3 install mkdocs-techdocs-core==1.1.7 && \
    mkdir -p /home/node/.yarn/berry/cache && chown -R node:node /home/node/.yarn

WORKDIR /app
# RUN chown node:node /app


# This switches many Node.js dependencies to production mode.
ENV NODE_ENV="production"
ENV NODE_OPTIONS="--no-node-snapshot"

# Copy over Yarn 3 configuration, release, and plugins
COPY --chown=node:node .yarn ./.yarn
COPY --chown=node:node .yarnrc.yml ./

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
COPY --chown=node:node yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

# Note that this install is not immutable, which is one of the reasons we don't recommend Yarn 3 yet
RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,sharing=locked,uid=1000,gid=1000 \
    yarn workspaces focus --all --production && \
    yarn cache clean

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY --chown=node:node packages/backend/dist/bundle.tar.gz app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

COPY --chown=node:node devportal.json backstage.json ./

# RUN npm prune --production

# Create the entrypoint script
USER root
COPY packages/backend/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
USER node

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["node", "packages/backend", "--config", "app-config.yaml"]