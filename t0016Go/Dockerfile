FROM golang:1.18-alpine

WORKDIR /api/src

COPY . .

# COPY go.mod go.sum ./

# RUN go mod download

# COPY cmd domain infra interfaces useCase .env ./

RUN go get -u all

EXPOSE 8080

CMD [ "go","run","cmd/main.go" ]