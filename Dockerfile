FROM node:16-alpine

RUN apk update
RUN apk add git

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY examples ./examples
COPY ["*.js", "./"]
ENTRYPOINT ["npx", "unlode"]