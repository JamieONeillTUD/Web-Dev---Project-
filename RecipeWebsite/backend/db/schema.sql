-- Create the database
CREATE DATABASE recipe_website;

-- Use the database
USE recipe_website;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    date_of_birth DATE, 
    eircode VARCHAR(7), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (first_name, last_name, username, email, password)
VALUES 
('John', 'Doe', 'johndoe', 'john@example.com', '$2b$10$samplehashedpassword'),
('Jane', 'Smith', 'janesmith', 'jane@example.com', '$2b$10$samplehashedpassword');

CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample recipes
INSERT INTO recipes (user_id, title, description, ingredients, instructions)
VALUES
(1, 'Spaghetti Bolognese', 'A classic Italian pasta dish.', 
 'Spaghetti, ground beef, tomato sauce, onion, garlic, olive oil', 
 '1. Cook the spaghetti. 2. Prepare the sauce by cooking ground beef with onion and garlic. 3. Add tomato sauce and simmer. 4. Serve sauce over spaghetti.'),
(2, 'Pancakes', 'Fluffy homemade pancakes.', 
 'Flour, milk, eggs, sugar, baking powder, salt', 
 '1. Mix dry ingredients. 2. Add wet ingredients and whisk. 3. Cook on a hot griddle. 4. Serve with syrup.');

-- New table for adding external recipes to favourites
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    UNIQUE KEY unique_favorite (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample favorites
INSERT INTO favorites (user_id, recipe_id)
VALUES 
(1, 2),  -- John Doe favorites Pancakes
(2, 1);  -- Jane Smith favorites Spaghetti Bolognese
