# Import necessary modules
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api

# 1. Initialize app
app = Flask(__name__)

# 2. Configure app
# Set a strong, random secret key
app.secret_key = b'E\x16\xf6\x0c\x83\x17\x01\x0e\x06\x9c\xd8\xeb\x1d\x9e\xd1\x18'

# Set the database URI to our local PostgreSQL database
# Format: "postgresql://username:password@localhost:5432/database_name"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://willalbeck:@localhost:5432/dog_watch_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# 3. Initialize Database (db)
db = SQLAlchemy(app)

# 4. Initialize Migrate
migrate = Migrate(app, db)

# 5. Initialize Bcrypt
bcrypt = Bcrypt(app)

# 6. Initialize Marshmallow (ma)
ma = Marshmallow(app)

# 7. Initialize API (api)
api = Api(app)