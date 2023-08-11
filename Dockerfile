FROM --platform=linux/amd64 node:20.5-alpine3.18

ENV APPDIR=/opt/app
RUN mkdir -p ${APPDIR}
WORKDIR ${APPDIR}

COPY package.json .
COPY dist build
COPY .babelrc .
COPY .yarnrc .
COPY tsconfig.json .
COPY yarn.lock .

RUN yarn install --production=true

CMD [ "node", "/opt/app/build/src/index.js" ]