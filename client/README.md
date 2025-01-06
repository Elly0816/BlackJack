# BlackJack Multiplayer Game

A real-time multiplayer BlackJack game built with React, TypeScript, and Socket.IO.

## Features

- Real-time multiplayer gameplay
- Lobby system for matchmaking
- Audio ambience for casino atmosphere
- Responsive design
- Visual card animations and effects

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Socket.IO Client
  - TailwindCSS
  - CSS3

## Project Structure

```
client/
├── public/          # Static files
├── src/
│   ├── components/  # React components
│   ├── contexts/    # React contexts
│   ├── hooks/       # Custom hooks
│   ├── pages/       # Page components
│   ├── socket/      # Socket.IO configuration
│   ├── types/       # TypeScript types
│   └── utilities/   # Helper functions
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
```

3. Build for production:

```bash
npm run build
```

## Game Rules

- Standard BlackJack rules apply
- Players can Hit or Stand
- Dealer must hit on soft 16
- BlackJack pays 3:2

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License
