FROM node:22.18.0-alpine

RUN mkdir -p /usr/ocr
WORKDIR /usr/ocr

RUN apk update && apk upgrade
RUN apk add git
RUN apk add yarn

COPY . /usr/ocr

RUN yarn install --frozen-lockfile
RUN yarn build

CMD ["yarn", "start"]
