FROM golang AS apiBuild

RUN mkdir /app

ADD . /app

WORKDIR /app/oah-api

RUN go mod download

# ldflags="-w" means no dwarf build
# -a means rebuild even if up to date
# -o specifies output location
RUN CGO_ENABLED=0 GOOD=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .
# RUN go build -o main .

# EXPOSE 8000
# CMD ["/app/oah-api/main"]
# CMD main

# build the react app
FROM node:19-alpine AS nodeBuild
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
