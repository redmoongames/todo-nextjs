
FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --no-lint

RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "npm", "--", "start"]

