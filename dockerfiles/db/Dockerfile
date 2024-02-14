FROM postgres:16

RUN apt-get update && apt-get install -y wget ca-certificates lsb-release

RUN wget https://apache.jfrog.io/artifactory/arrow/$(lsb_release --id --short | tr 'A-Z' 'a-z')/apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb
RUN dpkg -i apache-arrow-apt-source-latest-$(lsb_release --codename --short).deb

RUN wget https://packages.groonga.org/debian/groonga-apt-source-latest-$(lsb_release --codename --short).deb
RUN dpkg -i groonga-apt-source-latest-$(lsb_release --codename --short).deb

RUN apt-get update

RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release --codename --short)-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

RUN apt-get update
RUN apt-get install -y postgresql-16-pgdg-pgroonga groonga-tokenizer-mecab

ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 5432
CMD ["postgres"]