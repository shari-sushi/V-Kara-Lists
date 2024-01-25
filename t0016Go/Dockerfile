# syntax=docker/dockerfile:1

FROM golang:1.18

WORKDIR /api/src

COPY go.mod go.sum ./

RUN go mod download

COPY cmd domain infra interfaces useCase .env ./

CMD [ "go","run","cmd/main.go" ]