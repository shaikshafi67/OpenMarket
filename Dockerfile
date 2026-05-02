FROM node:18-alpine AS build-client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm ci --production

COPY server/ ./server/
COPY --from=build-client /app/client/build ./client/build

RUN mkdir -p /app/server/uploads

EXPOSE 7860

ENV NODE_ENV=production
ENV PORT=7860

WORKDIR /app/server
CMD ["node", "index.js"]
