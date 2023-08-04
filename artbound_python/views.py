import json
from flask import request, redirect, render_template
from artbound_python import app
from artbound_python.cache import last_updated, DB

database = DB()

@app.route('/', methods=['GET', 'POST'])
def route_index():
    if request.method == 'GET':
        return render_template("index.html", last_updated=database.get_last_updated())

    if (request.headers.get('Content-Type') != 'application/json'):
        return 'Content-Type not supported. Please use "application/json".'

    month = request.json["month"]
    fanarts = database.get_fanarts(month)
    return json.dumps(fanarts)

@app.route('/update')
def route_update():
    database.update_database()
    return redirect("/")