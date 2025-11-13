#!/usr/bin/env python3

from config import app, db
from models import User, Breed, Dog
import requests # This is why we installed the 'requests' package

# --- CONFIG ---
DOG_API_URL = "https://api.thedogapi.com/v1/breeds"
# PASTE YOUR KEY HERE
API_KEY = "live_QN5NbgHgQ8k2AcEkeiJn3I5aRMbdqJaMxsYPmKlzg5tZH0okhE8NEvCK6VjZyne6"

print("Seeding database...")

with app.app_context():
    print("Clearing old data...")
    # Delete dogs first (they have foreign keys)
    Dog.query.delete()
    # Then delete users and breeds
    User.query.delete()
    Breed.query.delete()

    # --- 1. FETCH BREEDS FROM API ---
    print("Fetching breeds from TheDogAPI...")
    headers = {"x-api-key": API_KEY} if API_KEY != "YOUR_API_KEY_HERE" else {}
    
    try:
        response = requests.get(DOG_API_URL, headers=headers)
        response.raise_for_status() # Raises an error for bad responses (4xx or 5xx)
        api_breeds = response.json()
        
        # --- 2. SEED LOCAL BREEDS ---
        print(f"Seeding {len(api_breeds)} breeds...")
        breed_objects = []
        
        for b in api_breeds:
            # We store the name AND their external ID
            if b.get('id') and b.get('name'):
                breed = Breed(
                    name=b['name'],
                    api_id=b['id'] # Storing the external API's ID
                )
                breed_objects.append(breed)
            else:
                print(f"Skipping breed with missing data: {b}")
        
        db.session.add_all(breed_objects)
        db.session.commit()

    except requests.exceptions.RequestException as e:
        print(f"Error fetching breeds: {e}")
        print("Skipping breed seeding.")

    # --- 3. SEED ADMIN ---
    print("Seeding admin...")
    admin = User(username="admin")
    admin.password_hash = "admin123" # The setter in models.py hashes this
    db.session.add(admin)
    db.session.commit()
    
    # --- 4. SEED A SAMPLE DOG ---
    # Let's find the "Labrador Retriever" we just added to attach a dog to it
    lab = Breed.query.filter_by(name="Labrador Retriever").first()
    admin_user = User.query.filter_by(username="admin").first()
    
    if lab and admin_user:
        print("Seeding sample dog 'Buddy'...")
        sample_dog = Dog(
            name="Buddy", 
            age=3, 
            status="Available",
            breed_id=lab.id, # Link to our local ID
            user_id=admin_user.id,
            image_url="https://images.dog.ceo/breeds/labrador/n02099712_7418.jpg" # Sample image URL
        )
        db.session.add(sample_dog)
        db.session.commit()

    print("Seeding complete!")