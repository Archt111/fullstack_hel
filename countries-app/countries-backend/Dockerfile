FROM node:24

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

ENV PORT=3000

CMD ["npm", "start"]
