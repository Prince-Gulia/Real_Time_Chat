# RealChat — Real-time Chat API

A real-time chat backend built with Node.js, Express, and Socket.io. 
Users authenticate via JWT, join named chat rooms, and exchange 
messages instantly with full message persistence.

## Live URL
https://real-time-chat-kzei.onrender.com

## Features
- JWT authenticated WebSocket connections
- Multiple chat rooms with real-time messaging
- Message history loads on room join
- Real-time join/leave notifications
- All messages persisted in PostgreSQL
- REST endpoints for room management

## Tech Stack
- Node.js
- Express.js
- Socket.io
- PostgreSQL (Supabase)
- JSON Web Tokens (JWT)
- bcrypt

## Database Schema
users
  - id, email, password, created_at

rooms
  - id, name, created_at

messages
  - id, content, user_id (FK), room_id (FK), created_at

refresh_tokens
  - id, user_id (FK), token, created_at

## REST Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/signup | Register a new user | No |
| POST | /auth/login | Login and get tokens | No |
| POST | /auth/refresh | Get new access token | No |
| GET | /auth/profile | Get current user | Yes |

### Rooms
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /rooms | Get all rooms | No |
| POST | /rooms | Create a new room | Yes |

## Socket Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| join_room | roomName | Join a chat room |
| send_message | content | Send a message |
| leave_room | none | Leave current room |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| room_history | { room, messages } | Message history on join |
| receive_message | { id, content, sender_email, created_at } | New message |
| user_joined | { message } | Someone joined the room |
| user_left | { message } | Someone left the room |
| error | { message } | Error notification |

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL database (Supabase)

### Installation
1. Clone the repo
   git clone https://github.com/Prince-Gulia/real-time-chat-app

2. Install dependencies
   npm install

3. Create .env file
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d

4. Run the server
   npm run dev

## Socket Connection Example
const socket = io('http://localhost:4000', {
  auth: {
    token: 'Bearer your_access_token'
  }
});

socket.emit('join_room', 'general');
socket.on('receive_message', (data) => {
  console.log(`[${data.sender_email}]: ${data.content}`);
});

## Authorization
All Socket.io connections require a valid JWT token passed 
in the auth handshake. Invalid or missing tokens are rejected 
before connection is established.
