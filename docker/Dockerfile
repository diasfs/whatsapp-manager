FROM node:16

ENV DB_DIALECT=sqlite
ENV DB_STORAGE=/data/database.sqlite
ENV JWT_SECRET=mysecret
ENV PORT=3000
ENV UPLOAD_DIR=/uploads
ENV PUPPETER_DATA_PATAH=/data/WWebJS

RUN mkdir /app
RUN mkdir /data
RUN mkdir /uploads
WORKDIR /app

VOLUME /data /uploads


RUN git clone https://github.com/diasfs/whatsapp-manager.git ./
RUN yarn && yarn build



EXPOSE 3000
