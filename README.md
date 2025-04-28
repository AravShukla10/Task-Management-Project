# Task-Management-Project

* Technical Choices and Architecture---

The MERN stack was selected to maintain a consistent JavaScript environment across both the backend and frontend, simplifying development. Express.js is used for creating a lightweight and efficient backend API. MongoDB provides a flexible NoSQL database solution. React handles the frontend, using hooks and Context API for state management.

Authentication is handled securely using JSON Web Tokens (JWT). Mongoose is used to structure and enforce schemas in MongoDB. The backend is organized into separate folders for models, controllers, routes, and middleware. The frontend is divided into components, pages, contexts, and services for scalability and maintainability.

* Database Schema Description---
The application has two main collections: users and tasks.

-> The User schema includes name, email, and password fields. The email field is unique and stored in lowercase. Automatic timestamps track user creation and updates.

-> The Task schema includes title, description, status, priority, and userId. Each task references a user. There is a compound unique index to prevent duplicate task titles per user.

* How to Run the Application Locally
 Make sure MongoDB is running locally or that you have set up a cloud database.

-> Start the backend:

Navigate to the backend directory.

Run npm install and then npm start.

-> Start the frontend:

Open a new terminal.

Navigate to the frontend directory.

Run npm install and then npm start.

-> Open your browser and visit http://localhost:3000 to access the application.

