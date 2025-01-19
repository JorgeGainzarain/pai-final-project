# Express Server

This is an Express server application that handles user authentication and story management.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── auth.controller.js
│   ├── story/
│   │   ├── story.controller.js
│   │   ├── story.service.js
│   │   ├── story.repository.js
├── models/
│   ├── repository.js
│   ├── service.js
├── routes.js
├── database.js
```

## Installation

1. Clone the repository:
    ```sh
    git clone "https://github.com/JorgeGainzarain/pai-final-project.git"
    cd "pai-final-project"
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the database:
    - Ensure you have a running database instance.
    - Update the `.env` file with your database connection details and session_secret.

## Usage

1. Start the server:
    ```sh
    npm start
    ```

2. The server will be running on `http://localhost:3000`. (Unless you have changed the port in the `.env` file)

## API Endpoints

### Authentication

- `GET /login` - Render login page
- `POST /login` - Handle login
- `GET /register` - Render registration page
- `POST /register` - Handle registration
- `GET /logout` - Handle logout

### Stories

- `GET /createStory` - Render create story page
- `POST /createStory` - Handle story creation
- `GET /story/:id` - Get story by ID
- `DELETE /story/:id` - Delete story by ID
- `GET /showStories` - Show all stories
- `GET /myStories` - Show stories by the logged-in user
- `POST /rateStory/:id` - Rate a story
- `GET /editStory/:id` - Render edit story page
- `POST /editStory/:id` - Handle story editing

## License

This project is licensed under the MIT License.