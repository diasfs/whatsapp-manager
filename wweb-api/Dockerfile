FROM node:16 as builder

ENV APP_DATA=/data
ENV PORT=3000
ENV HOST=0.0.0.0
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium
ENV HEADLESS=true

RUN apt update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 chromium
RUN apt install -y ffmpeg

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin 

RUN mkdir -p /data && chown -R node /data && mkdir -p /home/node/app

COPY ./src /home/node/app/src
COPY ./nodemon.json /home/node/app/
COPY ./package.json /home/node/app/


WORKDIR /home/node/app

RUN yarn

########
FROM builder
USER node

COPY --from=builder /home/node/app .

EXPOSE 3000
ENTRYPOINT [ "yarn", "start" ]