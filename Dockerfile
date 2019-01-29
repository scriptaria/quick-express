FROM node:10
ADD . /home/node/app
WORKDIR /home/node/app
RUN apt-get update  \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN npm install
CMD [ "npm", "start" ]
