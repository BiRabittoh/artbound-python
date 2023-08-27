FROM tecktron/python-waitress:slim

WORKDIR /app

RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./artbound_python ./artbound_python
ENV APP_MODULE=artbound_python:app
