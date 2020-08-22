FROM mhart/alpine-node:10

RUN apk update
WORKDIR /app

RUN mkdir /etc/periodic/1min
RUN crontab -l | { cat; echo "*    *       *       *       *       run-parts /etc/periodic/1min"; } | crontab -

CMD ["crond", "-f"]