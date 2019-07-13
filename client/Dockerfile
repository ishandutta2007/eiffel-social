FROM node:10-alpine

RUN apk add coreutils

ENV HOME=/eiffel-social-client
RUN mkdir -p $HOME
WORKDIR $HOME

COPY ./package.json $HOME
COPY ./yarn.lock $HOME

RUN yarn

CMD $HOME/start.sh
