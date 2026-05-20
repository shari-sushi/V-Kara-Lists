.PHONY: env
env:
	set -a && . ./.env && set +a && echo $${AWS_REGION}

.PHONY : aws-login
aws-login :
	aws ecr get-login-password --region $${AWS_REGION} | docker login --username $${AWS_USERNAME} --password-stdin $${AWS_PASSWORD}

.PHONY : aws-be-build-and-push
aws-be-build&push : 
	cd t0016Go && docker build -t $${AWS_API_SERVICE_NAME} . --no-cache \
	&& docker tag $${AWS_API_SERVICE_NAME}:latest $${AWS_API_SERVICE_URI}:latest \
	&& docker push $${AWS_API_SERVICE_URI}:latest

.PHONY : aws-fe-build-and-push
aws-fe-build&push : 
	cd t0016Next && docker build -t $${AWS_FE_SERVICE_NAME} . --no-cache \
	&& docker tag $${AWS_APP_SERVICE_NAME}:latest $${AWS_FE_SERVICE_URI}:latest \
	&& docker push $${AWS_APP_SERVICE_URI}:latest

####### ドキュメント
.PHONY: fmt-md
fmt-md:
	cd t0016Next/myapp && npx prettier --write "../../**/*.md"

####### 普段の開発向け
.PHONY: run
run:
	cd t0016Go/cmd && go run main.go

.PHONY: db-be
db-be:
	docker compose up -d db
	make run

.PHONY: fe
fe:
	cd t0016Next/myapp && npm run dev

.PHONY: fe-build
fe-build:
	cd t0016Next/myapp && npm run build

.PHONY: fe-start
fe-start:
	cd t0016Next/myapp && npm run start

.PHONY: storybook
storybook:
	cd t0016Next/myapp && npm run storybook

.PHONY: mysql
mysql:
	mysql -uroot -ppassword --host 127.0.0.1

# セットアップ向け
.PHONY: setup
setup:\
	make-env-db\
	make-env-app\
	make-env-api
	cd t0016Next/myapp && npm install
# 　　↓不要？
	cd t0016Go && go mod tidy

.PHONY: make-env-db
make-env-db:
	cd db && cp sample.env .env

.PHONY: make-env-app
make-env-app:
	cd t0016Next && cp sample.env .env

.PHONY: make-env-api
make-env-api:
	cd t0016Go && cp sample.env .env



# TODO: localでエラーチェックしたい
# .PHONY: build
# run:
# 	go build -v ./t0016Go/cmd/... 

# .PHONY: test
# run:
# 	go test -v ./... 
