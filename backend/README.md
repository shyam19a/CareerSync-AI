## Backend – FastAPI

This backend powers CareerSync AI using FastAPI.

### Run locally

Create and activate a virtual environment:

```bash
python -m venv venv
venv\Scripts\activate   # Windows
```

Install dependencies and start the server:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

### API Documentation

Once the server is running, open:
http://127.0.0.1:8000/docs
