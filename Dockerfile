FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

RUN apk add --no-cache --virtual .build-deps alpine-sdk python \
    && apk add --no-cache tzdata \
    && npm install \
    && npm run build \
    && npm prune --production \
    && apk del .build-deps

ENV TZ America/Sao_Paulo

EXPOSE 3000
CMD ["npm", "run", "serve"]
