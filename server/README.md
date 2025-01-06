# BlackJack Server

A TypeScript server implementation for a multiplayer BlackJack game using Socket.IO and Express.

## Features

- Real-time multiplayer gameplay
- Socket.IO for game state synchronization
- Player matchmaking system
- Dealer AI logic
- Card deck management
- Game state tracking

## Technologies Used

- TypeScript
- Node.js
- Express
- Socket.IO
- HTTP Server

## Project Structure

```
server/
├── classes/           # Game logic classes
├── controllers/       # Request handlers
├── routes/           # Express routes
├── utilities/        # Helper functions
├── server.ts         # Main server file
└── README.md         # This file
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

Server will run on port 5000 by default.

## API

The server uses Socket.IO events for game communication:

- `search` - Find other players
- `ready` - Player ready to start
- `hit` - Request another card
- `stand` - End turn
- `show` - Reveal cards

## Game Flow

1. Players connect and search for opponents
2. Game created when enough players join
3. Cards dealt to players and dealer
4. Players take turns hitting/standing
5. Dealer plays according to rules
6. Winner determined and results broadcast
