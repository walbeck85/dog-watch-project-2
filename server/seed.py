#!/usr/bin/env python3

# Import our app and database from config.py
from config import app, db

# Import all our models
from models import User, Breed, Dog

# This is the list of breeds we want to pre-populate
BREED_LIST = [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "Bulldog",
    "Poodle",
    "Beagle",
    "Rottweiler",
    "Dachshund",
    "Shih Tzu",
    "Boxer",
    "Siberian Husky",
    "Doberman Pinscher",
    "Great Dane",
    "Corgi",
    "Australian Shepherd",
    "Chihuahua",
    "Shiba Inu",
    "Border Collie",
    "Pug",
    "Mixed Breed / Unknown"
]

print("Seeding database...")

# We use app.app_context() to make sure our app
# is "aware" of the database operations.
with app.app_context():

    # --- Clear all existing data ---
    # This makes our seed script repeatable.
    # We delete dogs first because they have foreign keys
    # that depend on users and breeds.
    print("Clearing old data...")
    Dog.query.delete()
    User.query.delete()
    Breed.query.delete()

    # --- Seed Breeds ---
    print("Seeding breeds...")
    breed_objects = []
    for breed_name in BREED_LIST:
        breed = Breed(name=breed_name)
        breed_objects.append(breed)

    # Add all breed objects to the session at once
    db.session.add_all(breed_objects)
    db.session.commit() # Commit this batch

    # --- Seed a Test User (Admin) ---
    print("Seeding test admin user...")
    # We use our password_hash setter from the model
    admin_user = User(
        username="admin"
    )
    admin_user.password_hash = "admin123" # The setter will hash this

    db.session.add(admin_user)
    db.session.commit() # Commit this user

    print("Seeding complete!")