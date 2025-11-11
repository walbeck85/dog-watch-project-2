#!/usr/bin/env python3

from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Import the app, db, and api from config.py
from config import app, db, api

# --- MODELS & SCHEMAS ---
# Import our models...
from models import User, Breed, Dog
# ...and our schemas
from models import user_schema, breed_schema, dog_schema, dogs_schema

# --- AUTHENTICATION ROUTES (Course 10 Blueprint) ---

class Signup(Resource):
    def post(self):
        json_data = request.get_json()
        try:
            new_user = User(
                username=json_data.get('username')
            )
            new_user.password_hash = json_data.get('password')
            db.session.add(new_user)
            db.session.commit()
            
            session['user_id'] = new_user.id
            return user_schema.dump(new_user), 201
            
        except IntegrityError:
            return {'error': 'Username already exists'}, 422
        except ValueError as e:
            return {'error': str(e)}, 422

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = db.session.get(User, user_id)
            if user:
                return user_schema.dump(user), 200
        return {'error': 'Unauthorized'}, 401

class Login(Resource):
    def post(self):
        json_data = request.get_json()
        username = json_data.get('username')
        password = json_data.get('password')
        
        user = User.query.filter(User.username == username).first()
        
        if user and user.authenticate(password):
            session['user_id'] = user.id
            return user_schema.dump(user), 200
        
        return {'error': 'Invalid username or password'}, 401

class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session['user_id'] = None
            return {}, 204
        return {'error': 'Unauthorized'}, 401

# --- AUTHORIZATION HOOK (Course 10, Module 2) ---
# NEW CODE BLOCK 

@app.before_request
def check_if_logged_in():
    # These are the routes that DON'T require a login
    open_access_routes = [
        'signup',
        'check_session',
        'login',
        'logout',
    ]
    # If the user is trying to access a route NOT in this list
    # and they don't have a user_id in their session...
    if (request.endpoint not in open_access_routes) and (not session.get('user_id')):
        # ...block them.
        return {'error': '401 Unauthorized'}, 401

# --- "DOG" INVENTORY ROUTES (Our CRUD API) ---
# NEW CODE BLOCK 

class Dogs(Resource):
    def get(self):
        # 1. Get all dogs from DB
        all_dogs = Dog.query.all()
        # 2. Serialize them (many=True)
        return dogs_schema.dump(all_dogs), 200

    def post(self):
        # 1. Get data from request
        json_data = request.get_json()
        
        try:
            # 2. Create new dog
            new_dog = Dog(
                name=json_data.get('name'),
                age=json_data.get('age'),
                status=json_data.get('status', 'Available'), # Default to 'Available'
                user_id=session['user_id'], # Assign ownership to logged-in user
                breed_id=json_data.get('breed_id')
            )
            
            # 3. Save to DB
            db.session.add(new_dog)
            db.session.commit()
            
            # 4. Return the new dog (201 Created)
            return dog_schema.dump(new_dog), 201
            
        except (IntegrityError, ValueError) as e:
            # Handle bad data (e.g., non-existent breed_id or validation error)
            return {'error': str(e)}, 422

class DogById(Resource):
    def get(self, id):
        dog = db.session.get(Dog, id)
        if not dog:
            return {'error': 'Dog not found'}, 404
        return dog_schema.dump(dog), 200

    def patch(self, id):
        dog = db.session.get(Dog, id)
        if not dog:
            return {'error': 'Dog not found'}, 404
        
        # --- Ownership Check (Course 10, Module 3) ---
        if dog.user_id != session['user_id']:
            return {'error': '403 Forbidden - You do not own this resource'}, 403
            
        # 1. Get data from request
        json_data = request.get_json()
        
        # 2. Update fields
        for key, value in json_data.items():
            setattr(dog, key, value)
            
        # 3. Save to DB
        db.session.add(dog)
        db.session.commit()
        
        # 4. Return updated dog
        return dog_schema.dump(dog), 200

    def delete(self, id):
        dog = db.session.get(Dog, id)
        if not dog:
            return {'error': 'Dog not found'}, 404
            
        # --- Ownership Check (Course 10, Module 3) ---
        if dog.user_id != session['user_id']:
            return {'error': '403 Forbidden - You do not own this resource'}, 403
            
        # 1. Delete from DB
        db.session.delete(dog)
        db.session.commit()
        
        # 2. Return No Content (204)
        return {}, 204

# --- Add Resources to API ---
api.add_resource(Signup, '/signup')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')

# NEW ROUTES
api.add_resource(Dogs, '/dogs') # Maps to /dogs
api.add_resource(DogById, '/dogs/<int:id>') # Maps to /dogs/1, /dogs/2, etc.


if __name__ == '__main__':
    app.run(port=5555, debug=True)