FROM python:3.9.2-alpine

ENV PYTHONBUFFERED 1

RUN mkdir /app
WORKDIR /app

# psycopg2 dependencies
RUN apk update && apk add --update py3-pip \
	&& apk add postgresql-dev gcc freetype-dev python3-dev musl-dev jpeg-dev zlib-dev \
	graphviz-dev \
	curl

RUN pip install --upgrade pip setuptools wheel
	
# install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh