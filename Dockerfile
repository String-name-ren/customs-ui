FROM nginx

MAINTAINER bmd <https://github.com/bmd080>

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx/test.conf /etc/nginx/conf.d/default.conf

COPY dist/ /usr/share/nginx/html/

EXPOSE 80
