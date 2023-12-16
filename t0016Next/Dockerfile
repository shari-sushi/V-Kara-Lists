FROM node:18

WORKDIR /app/src 

COPY /myapp/package*.json .

RUN npm install
# RUN npm install -g next

COPY ./myapp .

RUN npm run build

CMD ["npm", "start"]
