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
    # A 'User' (admin) can create many 'Dog' entries.
    # 'cascade="all, delete-orphan"' means if a User is deleted,
    # all dogs they created are also deleted.
    dogs = db.relationship('Dog', back_populates='user', cascade='all, delete-orphan')

    # --- Password Hashing (from Course 10, Module 3) ---
    @hybrid_property
    def password_hash(self):
        # This line prevents us from ever accidentally reading the hash
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        # This is where we set the hash
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        # This is where we check the hash
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

    # --- Relationships ---
    # A 'Breed' can be associated with many 'Dog' entries.
    dogs = db.relationship('Dog', back_populates='breed')

    def __repr__(self):
        return f'<Breed {self.name}>'


class Dog(db.Model):
    __tablename__ = 'dogs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer)
    status = db.Column(db.String, default='Available') # e.g., "Available", "Adopted"

    # --- Foreign Keys (The "Links") ---
    # This is the 'many' side of the one-to-many with User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    # This is the 'many' side of the one-to-many with Breed
    breed_id = db.Column(db.Integer, db.ForeignKey('breeds.id'))

    # --- Relationships ---
    # 'back_populates' creates the two-way connection
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

# --- Marshmallow Schemas (from Course 9, Module 6) ---

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        # We only want to show 'id' and 'username' in API responses
        fields = ('id', 'username')

class BreedSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Breed
        fields = ('id', 'name')

class DogSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Dog
        # Include all fields from the Dog model
        include_fk = True

    # We tell Marshmallow to use our *other schemas*
    # to properly serialize the nested relationships.
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