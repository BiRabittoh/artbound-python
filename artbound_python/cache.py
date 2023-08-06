import os, shutil
from datetime import datetime
from contextlib import suppress

import requests
from artbound_python.api import get_file, get_rows

CACHE_DIRECTORY = "cache"
CACHE_PATH = os.path.join("artbound_python", "static", "res", CACHE_DIRECTORY)

db = []
last_updated = ""

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
    fanart["content"] = download_fanart(fanart["id"])
    return fanart

def handle_row(row):
    fanart_date = datetime.strptime(row[0], "%d/%m/%Y %H.%M.%S")
    fanart_id = row[3][33:]
    return {
        'id': fanart_id,
        'date': fanart_date.strftime("%Y-%m"),
        'name': row[1],
        'enabled': 1,
        'watermark': { 'invert': '' }
	}
    
class DB():
    def update_database(self):
        prev_length = len(self.db)
        self.db = [ handle_row(x) for x in get_rows() ]
        new_length = len(self.db)
        if new_length == 0:
            print("No fanarts!")
            exit(1)
        self.last_updated = datetime.now()
        return new_length - prev_length
    
    def __init__(self):
        self.db = []
        self.update_database()
        
    def get_fanarts(self, month):
        return [ handle_fanart(x) for x in self.db if x["date"] == month ]
    
    def get_last_updated(self):
        return self.last_updated.strftime("%d/%m/%Y %H:%M")
