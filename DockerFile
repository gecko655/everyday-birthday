FROM ubuntu

RUN apt-get update
RUN apt-get install -y ruby-dev libffi-dev build-essential
RUN gem install selenium-webdriver
RUN apt-get install firefox
RUN apt-get install xvfb
RUN export DISPLAY=:1 
RUN Xvfb :1 -screen 0 1024x768x24 &

COPY everyday-birthday.rb

CMD rsyslog
