FROM node:18-alpine

WORKDIR /app/src 

COPY /myapp/package*.json .

RUN npm install

COPY ./myapp .

# RUN npm run build

EXPOSE 80

# ↓ならRUN npm run build必要（だけどちゃんと機能してない。pathが悪いかも？）
CMD ["npm", "run", "start"]

# ↓ならRUN npm run build不要（だけど遅いDoockerだと顕著だし、本番環境と遠い）
# CMD ["npm", "run", "dev"]