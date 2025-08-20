# ---------- base ----------
    FROM node:22-alpine AS base
    WORKDIR /usr/src/app
    # install tools; use existing 'node' user from the image
    RUN apk add --no-cache tini curl && chown -R node:node /usr/src/app
    USER node
    ENTRYPOINT ["/sbin/tini","--"]
    
    # ---------- dependencies ----------
    FROM node:22-alpine AS dependencies
    WORKDIR /usr/src/app
    COPY package*.json ./
    RUN npm ci --include=dev
    
    # ---------- dev image ----------
    FROM base AS dev
    ENV NODE_ENV=development
    # bring in node_modules so the named volume is pre-populated on first run
    COPY --from=dependencies /usr/src/app/node_modules ./node_modules
    # configs (source mounted via volume at runtime)
    COPY package*.json tsconfig.json nodemon.json ./
    # source (overridden by volume in development)
    COPY src ./src
    EXPOSE 2704
    CMD ["./node_modules/.bin/nodemon"]
    