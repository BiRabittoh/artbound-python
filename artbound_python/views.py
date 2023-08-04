import json
from flask import request, redirect, render_template
from artbound_python import app
from artbound_python.cache import get_fanarts


debug_fanarts = [{"id":"1dE8L7w2DuOfQSJwf5oRjAeJ-VZfy5o-6","date":["03","08","2022"],"name":"Saro","content":"/static/res/wm.png","enabled":1,"index":1,"div":{}},{"id":"1ZO2poqaylmh7_FkEjRthozVXFpcP1Edx","date":["18","08","2022"],"name":"suchetto","content":"https://drive.google.com/uc?id=1ZO2poqaylmh7_FkEjRthozVXFpcP1Edx","enabled":1,"index":2,"div":{}},{"id":"1jkpZzqnQUdXv7QiW1khuwnSsdnjudBt-","date":["18","08","2022"],"name":"suca","content":"https://drive.google.com/uc?id=1clZbi1QzJQo_c7PGWx-nmLgfPhXqHdZR","enabled":1,"index":3,"div":{}}]

@app.route('/', methods=['GET', 'POST'])
def route_index():
    if request.method == 'GET':
        return render_template("index.html")

    if (request.headers.get('Content-Type') != 'application/json'):
        return 'Content-Type not supported. Please use "application/json".'

    month = request.json["month"]
    fanarts = get_fanarts(month)
    return json.dumps(fanarts)
