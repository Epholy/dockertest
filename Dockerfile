FROM node:latest
WORKDIR /app
COPY . /app
RUN yarn install \
    && yarn build
EXPOSE 1337
CMD yarn start