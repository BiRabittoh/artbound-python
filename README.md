# artbound-python

A client-server reimplementation of the administration panel for ArtBound.

## Configuration
1. Copy `.env.example` into `.env` and fill it out;
2. Generate a `credentials.json` with Drive and Sheets APIs and the following redirect URL: `http://localhost:1111`;

## Usage (poetry)
* Debug:
```
poetry install
poetry run flask --app artbound_python run --port 1111 --debug
```
* Production:
```
poetry install --with prod
poetry run python artbound_python
```

## Usage (docker)
1. Generate a `token.json` file: `poetry install; poetry run python get_token.py`;
2. Build the image and start the container: `docker-compose up -d`.
