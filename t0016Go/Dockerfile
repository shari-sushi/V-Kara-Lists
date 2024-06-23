FROM golang:1.18-alpine

WORKDIR /api/src

COPY . .

RUN go mod tidy

EXPOSE 8080

CMD [ "go","run","cmd/main.go" ]