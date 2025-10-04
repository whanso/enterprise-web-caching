FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
COPY src/content.md ./

RUN npm install

COPY dist .

EXPOSE 3000

CMD [ "node", "index.js" ]
