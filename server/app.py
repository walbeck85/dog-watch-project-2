#!/usr/bin/env python3

from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Import the app, db, and api from config.py
from config import app, db, api

# --- MODELS & SCHEMAS ---
from models import User, Breed, Dog
from models import user_schema, breed_schema, breeds_schema, dog_schema, dogs_schema

# --- AUTHENTICATION ROUTES ---

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

# --- AUTHORIZATION HOOK ---

@app.before_request
def check_if_logged_in():
    # These are the routes that DON'T require a login
    open_access_routes = [
        'signup',
        'check_session',
        'login',
        'logout',
        'breeds', # For the admin form dropdown
        'dogs',   # For the public homepage
        'dogsbybreedapiid' # For the "View Available" button
    ]
    
    # Check if the requested endpoint is *not* in our safe list
    # and if the user is *not* logged in.
    if (request.endpoint not in open_access_routes) and (not session.get('user_id')):
        return {'error': '401 Unauthorized'}, 401

# --- INVENTORY ROUTES ---

# Route to get all breeds (for the admin dropdown)
class Breeds(Resource):
    def get(self):
        all_breeds = Breed.query.all()
        return breeds_schema.dump(all_breeds), 200

# Route to get all *our* dogs (for the public homepage)
class Dogs(Resource):
    def get(self):
        all_dogs = Dog.query.all()
        return dogs_schema.dump(all_dogs), 200

    def post(self):
        # This route is protected by our @before_request hook
        json_data = request.get_json()
        
        try:
            new_dog = Dog(
                name=json_data.get('name'),
                age=json_data.get('age'),
                status=json_data.get('status', 'Available'), 
                user_id=session['user_id'], # Assign ownership
                breed_id=json_data.get('breed_id'),
                image_url=json_data.get('image_url') # Add image_url
            )
            
            db.session.add(new_dog)
            db.session.commit()
            
            # Return the full, serialized dog object
            return dog_schema.dump(new_dog), 201
            
        except (IntegrityError, ValueError) as e:
            return {'error': str(e)}, 422

# Route to get/update/delete a *specific* dog by its LOCAL ID
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
        
        # Ownership check
        if dog.user_id != session['user_id']:
            return {'error': '403 Forbidden - You do not own this resource'}, 403
            
        json_data = request.get_json()
        for key, value in json_data.items():
            setattr(dog, key, value)
            
        db.session.add(dog)
        db.session.commit()
        return dog_schema.dump(dog), 200

    def delete(self, id):
        dog = db.session.get(Dog, id)
        if not dog:
            return {'error': 'Dog not found'}, 404
            
        # Ownership check
        if dog.user_id != session['user_id']:
            return {'error': '403 Forbidden - You do not own this resource'}, 403
            
        db.session.delete(dog)
        db.session.commit()
        return {}, 204

# --- NEW ROUTE ---
# Route to get *our* dogs by the BREED'S EXTERNAL API ID
class DogsByBreedApiId(Resource):
    def get(self, api_id):
        # 1. Find the local breed using the external api_id
        breed = Breed.query.filter(Breed.api_id == api_id).first()
        
        if not breed:
            return {'error': 'Breed not found'}, 404
        
        # 2. Return all dogs associated with that breed's *local* id
        # This uses the 'dogs' relationship we built in our model!
        return dogs_schema.dump(breed.dogs), 200

# --- Add Resources to API ---
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Breeds, '/breeds', endpoint='breeds')
api.add_resource(Dogs, '/dogs', endpoint='dogs')
api.add_resource(DogById, '/dogs/<int:id>', endpoint='dogbyid')
api.add_resource(DogsByBreedApiId, '/breeds/api/<int:api_id>/dogs', endpoint='dogsbybreedapiid')


if __name__ == '__main__':
    app.run(port=5555, debug=True)