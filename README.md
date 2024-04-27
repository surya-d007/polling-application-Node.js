# Polling Application

## Description
The Polling Application is a web-based platform that allows users to create and manage polls. Users can register, log in, create new polls, view existing polls, and vote on polls. The application securely stores user credentials and poll data in MongoDB.

## Features
- User Authentication: Register and log in securely.
- Poll Creation: Create new polls with customizable options.
- Poll Management: View, edit, and delete created polls.
- Voting: Users can vote on existing polls.
- Real-time Updates: Poll results are updated in real-time after voting.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript (EJS for templating)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** bcrypt.js, Express Session
- **ORM/ODM:** Mongoose

## API Endpoints
- **POST /login**: Authenticate and log in user.
- **POST /register**: Register a new user account.
- **GET /create-new-poll**: Render the page for creating a new poll.
- **POST /create-new-poll**: Create a new poll.
- **GET /delete-poll**: Delete a poll.
- **GET /poll/:_id/:title**: View details of a poll.
- **POST /voted**: Vote on a poll.

## Setup Instructions
1. **Clone the repository:**
    ```bash
    git clone https://github.com/surya-d007/polling-application-Node.js.git
    ```

2. **Install dependencies:**
    ```bash
    cd polling-application
    cd server
    npm install
    ```

3. **Configure environment variables:**
    - Create a `.env` file in the root directory.
    - Add the following variables:
        ```plaintext
        PORT=3000
        MONGO_KEY=<your-mongodb-uri>
        ```

4. **Start the server:**
    ```bash
    npm start
    ```

5. **Access the application:**
    - Open your web browser and navigate to `http://localhost:3000`.

## Usage
1. **Registration:**
    - Navigate to the registration page.
    - Enter your details and submit the form.
  
2. **Login:**
    - Once registered, navigate to the login page.
    - Enter your credentials to log in.
  
3. **Create Polls:**
    - After logging in, navigate to the create poll page.
    - Enter the poll title, description, and options.
    - Submit the form to create a new poll.

4. **View Polls:**
    - You can view all existing polls on the home page.
    - Click on a poll to view its details and vote.

5. **Vote on Polls:**
    - On the poll details page, select an option and submit your vote.
    - Poll results are updated in real-time.

6. **Manage Polls:**
    - If you're the creator of a poll, you can edit or delete it.

## Contributing
Contributions are welcome! Please feel free to submit issues and pull requests.

## License
[MIT License](LICENSE)
