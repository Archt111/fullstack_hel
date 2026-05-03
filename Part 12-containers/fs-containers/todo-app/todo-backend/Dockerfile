FROM node:24

WORKDIR /usr/src/app

COPY . .

RUN npm ci

ENV PORT=3000

CMD ["npm", "start"]