FROM node:18

WORKDIR /app/src 

COPY /myapp/package*.json .

RUN npm install

COPY ./myapp .

RUN npm run build

CMD ["npm", "run", "start"]