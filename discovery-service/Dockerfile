FROM mhart/alpine-node:10

RUN apk update && apk add curl
WORKDIR /app

RUN cd /app 
COPY . .
RUN npm ci && npm run compile

EXPOSE 3000

CMD ["npm", "start"]