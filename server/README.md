# BlackJack Game Server

A Node.js/TypeScript server implementation for a multiplayer BlackJack card game.

## Description

This server handles the backend logic for a BlackJack card game, including:
- Player management and matchmaking
- Game state management
- Card deck handling
- Real-time game updates using Socket.IO

## Features

- Multiplayer support
- Real-time gameplay using WebSockets
- TypeScript implementation
- Modular class-based architecture
- Automated card shuffling and dealing

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server runs on port 5000 by default.

## Project Structure

- `/classes` - Core game classes
- `/controllers` - Request handlers and game logic
- `/routes` - Express routes
- `/utilities` - Helper functions

## Technologies Used

- Node.js
- TypeScript  
- Socket.IO
- Express.js
- CORS

## Game Flow

1. Players connect via WebSocket
2. Server matches players for a game
3. Dealer shuffles and deals cards
4. Players take turns hitting/standing
5. Winner is calculated based on BlackJack rules

## Authors

- Eleazar Udo