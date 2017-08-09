FROM node
MAINTAINER Miroslav Osladil <mosladil@gmail.com>

ARG SLACK_BOT_TOKEN=abcdef
ENV SLACK_BOT_TOKEN=$SLACK_BOT_TOKEN

ARG SLACK_BOT_ID=<@123456>
ENV SLACK_BOT_ID=$SLACK_BOT_ID

COPY package.json /opt
COPY index.js /opt

RUN cd /opt && npm install

WORKDIR /opt
CMD ["node", "index.js"]