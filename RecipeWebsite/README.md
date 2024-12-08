Project Name: Recipe Website

Team Members: Andrea Luca & Jamie O'Neill

GitHub Repo: https://github.com/JamieONeillTUD/Web-Dev---Project-

Overview
---------
The Recipe Website allows users to create, manage, and share recipes. It provides a platform where users can register, log in, create recipes, view their own recipes, save their favorites, and update their profile.

This project uses Node.js as the backend with Express for routing, MySQL for database management, and Bootstrap for styling the frontend. The frontend is static with HTML, CSS, and JavaScript files, while the backend handles the application logic, database communication, and user authentication.

Configuration Instructions:

-------------------------
### 1. Install Dependencies:
Ensure you have **Node.js** and **npm** installed. You can download **Node.js** from [here](https://nodejs.org/).

- Clone the repository to your local machine:
  ```bash
  git clone https://github.com/JamieONeillTUD/Web-Dev---Project-.git
  cd Web-Dev---Project-

- npm install

-------------------------
### 2. Set Up Database Schema and Data:

- Navigate to the backend/db/schema.sql file in the project directory.

- Run the SQL commands inside schema.sql to create the necessary tables for users, recipes, and favorites.

- Navigate to the backend/db/connection.js file to view connection to MYSQL Database

-------------------------
### 3. Project Structure:

- backend/: Contains all the backend code including controllers, routes, and database connection.

    controllers/: Logic for user authentication, recipe management, and user profile management.
    db/: Contains connection.js for the database connection and schema.sql for the database structure.
    routes/: All the API routes are defined here.
    server.js: Main server file for starting the app and handling routes.

- frontend/: Contains the static files for the website (HTML, CSS, JS).

    public/: The public folder that houses all HTML files, CSS styles, JavaScript, and images.

    .
    ├── README.md
    ├── backend
    │   ├── controllers
    │   │   ├── authController.js
    │   │   ├── recipeController.js
    │   │   └── userController.js
    │   ├── db
    │   │   ├── connection.js
    │   │   └── schema.sql
    │   ├── routes
    │   │   ├── auth.js
    │   │   ├── externalRecipes.js
    │   │   ├── recipes.js
    │   │   └── user.js
    │   └── server.js
    └── frontend
        └── public
            ├── create-recipe.html
            ├── css
            │   ├── dashboard.css
            │   ├── main.css
            │   └── recipeDetails.css
            ├── dashboard.html
            ├── images
            │   ├── aboutus.jpg
            │   ├── andyjay.png
            │   ├── chic.jpeg
            │   ├── pan.jpeg
            │   └── spag.jpeg
            ├── index.html
            ├── js
            │   ├── create-recipe.js
            │   ├── dashboard.js
            │   ├── edit-profile.js
            │   ├── favorites.js
            │   ├── login.js
            │   ├── main.js
            │   └── recipeDetails.js
            ├── login.html
            ├── recipeDetails.html
            └── register.html


-------------------------
### 4. Running the Application:

- To run the application, first start the backend server using the following command

    node backend/server.js or nodemon backend/server.js

    This will start the server at http://localhost:5050

    Once the backend server is running, the frontend will be accessible in your browser at http://localhost:5050. You can view the home page, sign up, log in, create recipes, and more.

-------------------------
### 5. Features Overview:

- User Registration: Users can sign up and create an account. Passwords are securely hashed using bcrypt.

- Login & Authentication: Users can log in and their session is maintained using Express-session. After logging in, users can create and manage their recipes.

- Recipe Creation & Management: Users can create, update, or delete recipes, which are stored in the MySQL database.

- Favorites: Users can mark recipes as favorites and view them in their dashboard.

- Search: The application provides a search feature for recipes based on name, ingredients, category, and cuisine.