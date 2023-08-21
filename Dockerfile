FROM node:alpine AS development

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./

CMD [ "npm", "start" ]

FROM development AS builder

RUN npm run build

FROM nginx:1.13-alpine

COPY --from=builder /code/build /usr/share/nginx/htm