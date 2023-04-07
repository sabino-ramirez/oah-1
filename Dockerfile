FROM golang AS apiBuild
ADD . /app
WORKDIR /app/oah-api
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .

# build the react app
FROM node:19 AS nodeBuild
COPY --from=apiBuild /app/oah-frontend ./
RUN npm install --legacy-peer-deps
RUN npm run build

# # final build stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
COPY --from=apiBuild /main ./
COPY --from=nodeBuild /build ./web
RUN chmod +x ./main
EXPOSE 8000
CMD ./main
