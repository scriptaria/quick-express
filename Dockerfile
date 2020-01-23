FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN apk add --no-cache --virtual .build-deps alpine-sdk python \
    && apk add tzdata \
    && npm install --only=prod \
    && npm run build \
    && apk del .build-deps

ENV TZ America/Sao_Paulo

EXPOSE 3000
CMD ["npm", "run", "serve"]

