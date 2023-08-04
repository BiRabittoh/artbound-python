import os, shutil
from datetime import datetime
from contextlib import suppress

import requests
from artbound_python.api import get_file, get_rows

CACHE_DIRECTORY = "cache"
CACHE_PATH = os.path.join("artbound_python", "static", "res", CACHE_DIRECTORY)

db = []
last_updated = None

with suppress(FileExistsError):
    os.makedirs(CACHE_PATH)

def download_fanart(fanart_id: str):
    cached_files = os.listdir(CACHE_PATH)
    cached_ids = [ x.split(".")[0] for x in cached_files ]
    try:
        position = cached_ids.index(fanart_id)
        print("Using cached file.")
        fanart = cached_files[position]
    except ValueError:
        print("File is not cached. Downloading.")
        fanart = get_file(fanart_id, CACHE_PATH)
        
    return f"/static/res/{CACHE_DIRECTORY}/{fanart}"

def clear_cache():
    shutil.rmtree(CACHE_PATH)

def handle_fanart(fanart):
    fanart_id = fanart["id"]
    fanart["content"] = download_fanart(fanart_id)
    return fanart

def handle_row(row):
    fanart_date = datetime.strptime(row[0], "%d/%m/%Y %H.%M.%S")
    fanart_id = row[3].strip("https://drive.google.com/open?id=")
    return {
        'id': fanart_id,
        'date': fanart_date.strftime("%Y-%m"),
        'name': row[1],
        'enabled': 1
	}

def update_database():
    global db
    global last_updated
    db = [ handle_row(x) for x in get_rows() ]
    if len(db) == 0:
        print("No fanarts!")
        exit(1)
    last_updated = datetime.now()

def get_fanarts(month):
    return [ handle_fanart(x) for x in db if x["date"] == month ]

update_database()

if __name__ == "__main__":
    print(handle_fanart({ 'id': '1_DUo-dW40So3T24a91SyGrEcAGKfP0l_'}))
    #clear_cache()
