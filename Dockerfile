FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production && npm install --save-dev typescript

COPY . .

RUN npx tsc

ARG TZ=GMT
ENV TZ=${TZ}
RUN apk --no-cache add tzdata \
  && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
  && echo "${TZ}" > /etc/timezone

EXPOSE 8080

CMD ["npm", "start"]
