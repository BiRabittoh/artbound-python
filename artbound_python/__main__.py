from waitress import serve
from artbound_python import app

serve(app, listen='*:1111')
