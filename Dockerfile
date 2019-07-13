FROM node:10
WORKDIR /app
COPY . /app/
RUN npm install
CMD npm run start
EXPOSE 4000
