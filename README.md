# Capstone Project 2: Dog-Watch (Full-Stack Inventory App)

This repository contains my submission for the second Capstone project, a full-stack "Productivity" application.

The application, "Dog-Watch," is a "hybrid" app built on top of the Project 1 Dog Breed Finder. It solves a real-world productivity problem for animal shelters: managing their inventory of available dogs.

It provides a secure, private Admin Dashboard (built with Flask and React) where staff can perform full CRUD operations on their dog inventory. This local database is then cross-referenced with the external Dog API to create a unified public-facing site. The public site now shows which breeds are actually available at the shelter, solving the "stale inventory" problem.

## Showcase & Deliverables

* **Project 2 Pitch:** https://docs.google.com/document/d/1FGHcAA7qvHuRZW0yIiFSkd3bCOgUH7LgLpDnEACS08c/edit?usp=sharing
* **Video Presentation:** https://www.loom.com/share/5cd1bb0bbd3747d09dbec853349b8962
* **Written Reflection:** https://docs.google.com/document/d/1W7Y0eZfa2kl7O1FHWJG8Tdx_buxiQQ3dERzatKA-mIQ/edit?usp=sharing

## Screenshots

Here is a gallery of the app's core features, showing the final Material-UI refactor.

| Feature Highlight | Screenshot (Imgur Link) |
| :--- | :---: |
| **Hybrid Homepage**<br>The public homepage now fetches from both the external API and the local DB. It cross-references the lists and displays a "View Available" button only on breeds that have local dogs in inventory. | ![Hybrid Homepage](https://imgur.com/a/3B11MOF) |
| **"Available Dogs" Page**<br>Clicking "View Available" navigates to a new page that displays only the specific dogs from the local PostgreSQL database, complete with their name, status, and image. | ![Available Dogs](https://imgur.com/a/fc1GSZE) |
| **Admin Login**<br>A new, public-facing route (/login) for shelter staff to authenticate. This page sends credentials to the secure Flask-Bcrypt backend. | ![Admin Login](https://imgur.com/a/zCzlKoB) |
| **Protected Admin Dashboard**<br>After logging in, the admin is redirected to the private (/admin) dashboard. This page is protected by a ProtectedRoute component and a @before_request hook on the server. | ![Admin Dashboard](https://imgur.com/a/5MKJHbl) |
| **Admin CRUD: Add & Manage**<br>The dashboard combines the "Add Dog" form (with a searchable Autocomplete for breeds) and the "Manage Inventory" list. This list is populated by the /dogs API. | ![Admin Add & Manage](https://imgur.com/a/hYpzIBl) |
| **Admin CRUD: Edit & Delete**<br>Admins can click the "Edit" icon to open a modal (pre-filled with the dog's data) and PATCH the record. The "Delete" icon sends a DELETE request. Both actions instantly update the UI. | ![Admin Edit & Delete](https://imgur.com/a/FUs6YA7) |
| **New Theme & Dark Mode**<br>The new "Dog Watch" theme uses a friendlier "Nunito" font and a warm green color palette. The Dark Mode toggle is fully functional across the entire application. | ![New Theme & Dark Mode](https://imgur.com/a/vT6fJXq) |

## Features

### Backend (Python, Flask, PostgreSQL)
* **Full-Stack API**: A complete RESTful API built with Flask-RESTful.
* **Database**: All data is stored in a relational PostgreSQL database.
* **Data Modeling**: Uses Flask-SQLAlchemy to define a 3-table model (User, Breed, Dog) with one-to-many relationships.
* **Database Migrations**: Uses Flask-Migrate to manage all schema changes.
* **Full Admin Authentication**:
- Secure password hashing using Flask-Bcrypt on the User model.
- Full auth flow with /signup, /login, /logout, and /check_session endpoints.
- Session Management: Uses server-side sessions to persist login state.
* **Protected Routes**: Implemented a @before_request hook to protect all inventory endpoints, returning a 401 Unauthorized error if no session is found.
* **Ownership Logic**: The PATCH and DELETE endpoints are protected, ensuring only the admin who created a dog record can modify or delete it.
* **"Hybrid" Seeding**: The seed.py script uses the requests library to fetch all breeds from the external Dog API, populating the local Breed table with a matching api_id. This syncs the local DB with the external API.

### Frontend (React)
* **Admin Dashboard**: A new, secure admin section with full CRUD (Create, Read, Update, Delete) functionality.
* **Protected Routes**: A ProtectedRoute component guards the /admin route, redirecting unauthenticated users to /login.
* **Hybrid Data Fetching**: The homepage (BreedList.js) now uses Promise.all to fetch from both the external API and the local /dogs API simultaneously.
* **Augmented UI**: The homepage "augments" the external API data, showing a "View Available" button only on breeds that have a available_dogs.length > 0 (from the local DB).
* **Dynamic Filtering**: Added a "Show Available Only" toggle to the homepage to filter breeds based on local inventory.
* **State Bug Fix**: The "Add Dog" and "Delete Dog" functions in the admin dashboard now instantly update the component state, providing a seamless UX.
* **MUI Autocomplete**: Implemented instructor feedback by changing the "Breed" dropdown to a searchable Autocomplete component.
* **MUI Modal**: The "Edit" feature uses an MUI <Modal> to provide a clean, in-page editing experience.

## Environment & Setup

This project uses a "monorepo" structure with a backend server and a frontend client.

### Backend (/server):
- Python 3.8+
- pipenv
- Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Migrate
- Flask-Bcrypt, Flask-Marshmallow, marshmallow-sqlalchemy
- psycopg2-binary (for PostgreSQL)
- requests

### Frontend (/capstone-project-1):
- React 18+
- npm
- react-router-dom
- Material-UI (MUI)
- React Context API

## Setup and Installation

You must set up and run both the backend and frontend.

**1. Backend Server Setup**
- git clone git@github.com:walbeck85/dog-watch-project-2.git
- cd dog-watch-project-2

**2. Backend Server Setup**
- 1. Navigate to the server directory
cd server

- 2. Install Python dependencies
pipenv install

- 3. Enter the virtual environment
pipenv shell

- 4. Set up the PostgreSQL database
### (You must have PostgreSQL installed, e.g., via Homebrew)
psql -d postgres
CREATE DATABASE dog_watch_db;
\q

- 5. Run the database migrations
flask db upgrade

- 6. Seed the database (This will take a moment)
### This fetches from TheDogAPI and creates the admin user
python seed.py  - cd server

**3. Frontend Client Setup**
- 1. Navigate to the client directory
cd dog-watch-project-2

- 2. Install Node modules
npm install

- 3. Set Up Environment Variable
###(This is still required for the external API)
### Create a new file named .env in this folder
touch .env

- 4. Add your API key to the .env file:
### REACT_APP_DOG_API_KEY=your-api-key-goes-here

**4. How to Run**

You must have both servers running at the same time in two separate terminals.

- Terminal 1 (Flask Backend):
  - cd server
  - pipenv shell
  - python app.py
(Your server will be running at http://127.0.0.1:5555)

- Terminal 2 (React Frontend):
  - cd capstone-project-1
  - npm start
(Your app will open at http://localhost:3000)

- Admin Credentials:
  - Username: admin
  - Password: admin123

## File Structure

```
/dog-watch-project-2
|
|-- /capstone-project-1  (The React Frontend)
|   |-- /public
|   |-- /src
|   |   |-- /components
|   |   |   |-- AdminDashboard.js  (NEW: "Smart" parent for all admin functions)
|   |   |   |-- AvailableDogsPage.js (NEW: Page for /available/:id)
|   |   |   |-- BreedList.js         (MODIFIED: Fetches hybrid data)
|   |   |   |-- ComparePage.js
|   |   |   |-- DogCard.js           (MODIFIED: Universal card for breeds & dogs)
|   |   |   |-- EditDogModal.js      (NEW: Modal form for editing)
|   |   |   |-- Login.js             (NEW: Admin login form)
|   |   |   |-- ManageDogList.js     (NEW: "Dumb" list for admin inventory)
|   |   |   |-- NavBar.js            (MODIFIED: Shows login/logout state)
|   |   |   `-- ProtectedRoute.js    (NEW: Guards the /admin route)
|   |   |
|   |   |-- /context
|   |   |   |-- AppThemeProvider.js (MODIFIED: New theme)
|   |   |   `-- CompareContext.js
|   |   |
|   |   |-- App.js              (MODIFIED: New admin and available routes)
|   |   `-- index.js            (MODIFIED: Wraps AppThemeProvider)
|   |
|   |-- .env
|   |-- package.json
|   `-- README.md (This file)
|
`-- /server  (The Flask Backend)
    |-- /migrations
    |-- /instance
    |-- app.py              (Main app, all API routes)
    |-- config.py           (Flask/DB/Bcrypt initialization)
    |-- models.py           (SQLAlchemy models and Marshmallow schemas)
    |-- seed.py             (NEW: "Smart" seeder, fetches from external API)
    |-- Pipfile
    `-- Pipfile.lock

```

## Troubleshooting
  * **Error: ECONNREFUSED in browser console**: Your React app (port 3000) can't connect to your backend.
. Your Flask server (Terminal 2) is not running. Run python app.py in your (server) shell.
  * **401 (UNAUTHORIZED) when clicking "View Available":** You (correctly) protected the /dogs and /dogsbybreedapiid endpoints. I have fixed this. The open_access_routes list in app.py now includes 'dogs' and 'dogsbybreedapiid', allowing the public to see the inventory.
  * **401 ModuleNotFoundError: No module named 'flask':** You are not inside the virtual environment. Navigate to the /server directory and run pipenv shell before running python app.py.

<!-- end list -->
