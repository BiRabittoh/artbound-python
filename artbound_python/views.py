import json
from datetime import datetime
from flask import request, redirect, render_template
from artbound_python import app
from artbound_python.cache import DB, clear_cache

database = DB()

@app.route('/', methods=['GET', 'POST'])
def route_index():
    if request.method == 'GET':
        return render_template("index.html", last_updated=database.get_last_updated(), current_month=datetime.today().strftime("%Y-%m"))

    if (request.headers.get('Content-Type') != 'application/json'):
        return 'Content-Type not supported. Please use "application/json".'

    month = request.json["month"]
    fanarts = database.get_fanarts(month)
    return json.dumps(fanarts)

@app.route('/update', methods=['POST'])
def route_update():
    new_entries = database.update_database()
    return json.dumps({
        "timestamp": database.get_last_updated(),
        "new": new_entries
    })

@app.route('/clear')
def route_clear():
    clear_cache()
    return redirect("/")

