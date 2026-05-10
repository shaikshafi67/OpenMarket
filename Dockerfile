FROM node:18-alpine AS build-client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ ./
RUN NODE_OPTIONS="--max-old-space-size=512" npm run build

FROM node:18-alpine
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

COPY server/ ./server/
COPY --from=build-client /app/client/build ./client/build

RUN mkdir -p /app/server/uploads

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app/server
CMD ["node", "index.js"]
