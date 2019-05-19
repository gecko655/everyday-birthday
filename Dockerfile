FROM node:12-slim

LABEL maintainer "gecko655 <aqwsedrft1234@yahoo.co.jp>"

WORKDIR /root

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic\
      --no-install-recommends \
    && apt-get install -y busybox-static \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN touch /tmp/cronlog.log

ADD package.json package-lock.json tsconfig.json ./
RUN npm i

COPY crontab.config /var/spool/cron/crontabs/root

ADD index.ts ./
CMD busybox crond -L /tmp/cronlog.log && tail -f /tmp/cronlog.log
