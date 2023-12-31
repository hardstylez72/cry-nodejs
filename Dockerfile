FROM --platform=linux/amd64 node:20.5-alpine3.18

ENV APPDIR=/opt/app
RUN mkdir -p ${APPDIR}
WORKDIR ${APPDIR}

COPY package.json .
COPY dist build
COPY node_modules node_modules

CMD [ "node", "/opt/app/build/index.js" ]