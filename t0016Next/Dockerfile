FROM node:18-alpine

WORKDIR /app/src 

COPY /myapp/package*.json .

RUN npm install

COPY ./myapp .

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "start"]