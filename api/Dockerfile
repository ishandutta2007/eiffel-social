FROM node:10-alpine

ENV HOME=/eiffel-social-api
RUN mkdir -p $HOME
WORKDIR $HOME

RUN npm install --quiet --global pm2

COPY ./package.json $HOME
RUN npm install --quiet

COPY . $HOME
RUN /usr/bin/crontab /eiffel-social-api/crontab.txt

CMD $HOME/start.sh
