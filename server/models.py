# Import the instances we created in config.py
from config import db, bcrypt, ma

# Import SQLAlchemy features
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates

# --- Models -------------------------------------------

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    # --- Relationships ---
    dogs = db.relationship('Dog', back_populates='user', cascade='all, delete-orphan')

    # --- Password Hashing ---
    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    # --- Validations ---
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError('Username must be provided.')
        if len(username) < 4:
            raise ValueError('Username must be at least 4 characters long.')
        return username

    def __repr__(self):
        return f'<User {self.username}>'


class Breed(db.Model):
    __tablename__ = 'breeds'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    
    # --- NEW COLUMN ---
    # This links our local breed to TheDogAPI's ID system
    api_id = db.Column(db.Integer, unique=True) 

    dogs = db.relationship('Dog', back_populates='breed')

    def __repr__(self):
        return f'<Breed {self.name}>'


class Dog(db.Model):
    __tablename__ = 'dogs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer)
    status = db.Column(db.String, default='Available')
    
    # --- NEW COLUMN ---
    # Admin can paste a URL here
    image_url = db.Column(db.String) 

    # --- Foreign Keys (The "Links") ---
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    breed_id = db.Column(db.Integer, db.ForeignKey('breeds.id'))

    # --- Relationships ---
    user = db.relationship('User', back_populates='dogs')
    breed = db.relationship('Breed', back_populates='dogs')

    # --- Validations ---
    @validates('age')
    def validate_age(self, key, age):
        if age is not None and age < 0:
            raise ValueError('Age must be a positive number.')
        return age

    def __repr__(self):
        return f'<Dog {self.name}>'

# --- Marshmallow Schemas (Correct Order) ---

# 1. Define UserSchema FIRST
class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        fields = ('id', 'username')

# 2. Define BreedSchema SECOND
class BreedSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Breed
        fields = ('id', 'name', 'api_id') # <-- Added api_id

# 3. Define DogSchema LAST (so it can refer to the others)
class DogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Dog
        include_fk = True # This will include user_id and breed_id
    
    # These lines will now work because UserSchema and BreedSchema exist
    user = ma.Nested(UserSchema)
    breed = ma.Nested(BreedSchema)


# --- Initialize Schemas for Export ---

# Single record schemas
user_schema = UserSchema()
breed_schema = BreedSchema()
dog_schema = DogSchema()

# Multiple record schemas (for returning lists)
users_schema = UserSchema(many=True)
breeds_schema = BreedSchema(many=True)
dogs_schema = DogSchema(many=True)