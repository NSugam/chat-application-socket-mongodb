# Chat Application using Socket.io

This is a real-time chat application built using **MERN Stack (MongoDB, Express, React, Node.js)** and **Socket.io** for live messaging.

## Features
- Real-time messaging using **Socket.io**
- User authentication with **JWT-based auth**
- Online/offline status tracking
- Chat history storage with **MongoDB**
- Bootstrap for a responsive UI

## Tech Stack
- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **WebSockets:** Socket.io

## Installation & Setup

### 1. Clone the repository
```sh
 git clone https://github.com/NSugam/chat-application-socket.git
 cd chat-application-socket
```

### 2. Install dependencies
#### Install backend dependencies
```sh
 cd backend
 npm install
```

#### Install frontend dependencies
```sh
 cd ../frontend
 npm install
```

### 3. Set up environment variables
Create a `.env` file in the **backend** folder with:
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Create a `.env` file in the **frontend** folder with:
```sh
REACT_APP_LOCALHOST=http://localhost:5000
```

### 4. Run the application
#### Start the backend server
```sh
 cd backend
 npm run dev
```
#### Start the frontend
```sh
 cd ../frontend
 npm start
```

## Usage
- Register or log in to start chatting.
- Select a user and start sending real-time messages.
- Your chat history is stored in the database.

## Folder Structure
```
chat-application-socket/
├── backend/     # Express.js backend
├── frontend/    # React.js frontend
├── README.md    # Project documentation
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is **MIT licensed**.

