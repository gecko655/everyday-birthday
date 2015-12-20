FROM ubuntu

MAINTAINER gecko655 <aqwsedrft1234@yahoo.co.jp>

WORKDIR /root
RUN apt-get update
RUN apt-get install -y ruby-dev libffi-dev build-essential firefox xvfb
RUN gem install selenium-webdriver
ENV DISPLAY=:1 

COPY everyday-birthday.rb /root

CMD Xvfb :1 -screen 0 1024x768x24 &
