#!/usr/bin/env python3

# Import the app, api, and db from config.py
from config import app, db, api

# Import our models
from models import User, Breed, Dog

# We will add all our API routes here later



if __name__ == '__main__':
    app.run(port=5555, debug=True)