import os, pathlib, io

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload

def get_google_credentials():
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive.readonly']
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=1111)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def get_rows():
    try:
        sheet = build('sheets', 'v4', credentials=creds).spreadsheets()
        result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range=RANGE).execute()
        return result.get('values', [])
    except HttpError as err:
        print(err)
        return []

def get_file(file_id, cache_path):
    drive = build('drive', 'v3', credentials=creds).files()
    try:
        filename = drive.get(fileId=file_id).execute()['name']
    except HttpError as err:
        print(err)
        return ""
    extension = pathlib.Path(filename).suffix

    file_name = file_id + extension
    file_path = os.path.join(cache_path, file_name)

    fh = io.BytesIO()
    request = drive.get_media(fileId=file_id)
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
    fh.seek(0)
    fh_content = fh.read()
    with open(file_path, "wb") as fp:
        fp.write(fh_content)
    return file_name

load_dotenv()
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID") #'1OHI2PA62LNrEbViq87AyUlX1ni3Gr9gttxPLvkOzZ6g'
RANGE = os.getenv("RANGE")#'Risposte del modulo 1!A2:E'

creds = get_google_credentials()
