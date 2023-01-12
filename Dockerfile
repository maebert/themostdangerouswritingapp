FROM node:19.4-alpine3.16 as build
ENV NODE_ENV=production
WORKDIR /app
COPY [ "yarn.lock", "package.json", "." ]
RUN yarn install && yarn autoclean && yarn cache clean --all
COPY . .
RUN yarn run build && yarn autoclean && yarn cache clean --all
# RUN yarn run test

FROM httpd:2.4-alpine3.16
WORKDIR /app
COPY --from=build /app/build/ /usr/local/apache2/htdocs/themostdangerouswritingapp
