FROM python:3-alpine

WORKDIR /app
COPY . .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["waitress-serve", "--host", "0.0.0.0", "--port", "1111", "artbound_python:app"]