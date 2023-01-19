# build stage
FROM node:16.15.1-alpine as build-stage

ARG env_mode=testing

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build -- --mode ${env_mode}

# production stage
FROM nginxinc/nginx-unprivileged:1.23-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf