# artbound-python

A client-server reimplementation of the administration panel for ArtBound.

## Instructions
1. Copy `.env.example` into `.env` and fill it out;
2. Generate a `credentials.json` with Drive and Sheets APIs and the following redirect URL: `http://localhost:1111`;
3. Install dependencies: `poetry install`.

## Usage (poetry)
* Debug: `poetry run flask --app artbound_python run --port 1111 --debug`.
* Production: `poetry run waitress-serve --host 0.0.0.0 --port 1111 artbound_python:app`

## Usage (docker)
1. Generate a `token.json` file: `python get_token.py`;
2. Build the image and start the container: `docker-compose up -d`.
