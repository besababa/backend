FROM node:9.5

COPY . /eventz

RUN useradd --no-create-home  \
    --home-dir /eventz \
    --uid 2000 \
    eventz &&\
    chown eventz: /eventz -R

WORKDIR /eventz
USER eventz
ENV BESABABA_JWT=justadefaultvaluetostartwith

RUN npm install

CMD npm start
