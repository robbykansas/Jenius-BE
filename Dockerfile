FROM node:latest

WORKDIR /usr/www/jenius-be

COPY . .

ENV PORT=3000

RUN npm install && npm cache clean --force

EXPOSE 3000

CMD ["node", "./server.js"]