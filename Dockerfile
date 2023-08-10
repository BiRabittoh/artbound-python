FROM tecktron/python-waitress:slim

RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./artbound_python /app/artbound_python
WORKDIR /app
ENV APP_MODULE=artbound_python:app
