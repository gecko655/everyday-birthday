FROM ruby

MAINTAINER gecko655 <aqwsedrft1234@yahoo.co.jp>

WORKDIR /root
RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get -y dist-upgrade \
    && apt-get -y autoremove 
RUN apt-get install -y vim
RUN apt-get install -y rsyslog

RUN touch /tmp/cronlog.log

COPY Gemfile Gemfile
Run bundle install

COPY crontab.config crontab.config
RUN (crontab -l; cat crontab.config ) | crontab

COPY everyday-birthday.rb /root

CMD env > /root/env.txt && cron && tail -f /tmp/cronlog.log
