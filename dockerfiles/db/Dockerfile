FROM postgres:latest

RUN apt update
RUN apt install -y libmecab-dev libmecab2 mecab-ipadic-utf8 mecab-utils libmecab-perl libtext-mecab-perl mecab mecab-jumandic-utf8 wget make gcc postgresql-server-dev-all

RUN wget https://ftp.postgresql.org/pub/projects/pgFoundry/textsearch-ja/textsearch_ja/9.0.0/textsearch_ja-9.0.0.tar.gz
RUN tar zxf textsearch_ja-9.0.0.tar.gz
RUN cd textsearch_ja-9.0.0 && make USE_PGXS=1 && make USE_PGXS=1 install

RUN echo shared_preload_libraries='textsearch_ja' >> /var/lib/postgresql/data/postgresql.conf

ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 5432
CMD ["postgres"]