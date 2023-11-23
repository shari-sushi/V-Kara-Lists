# syntax=docker/dockerfile:1

FROM golang:1.19

WORKDIR /api/src

COPY go.mod go.sum ./

RUN go mod download

COPY cmd internal pkg .env ./

CMD [ "go","run","cmd/main.go" ]