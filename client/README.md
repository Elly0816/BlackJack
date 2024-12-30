# Blackjack Game Client

A React-based multiplayer Blackjack game client that connects to a backend server via websockets.

## Features

- Real-time multiplayer gameplay
- User authentication with player names
- Responsive design
- Casino ambiance audio
- Interactive card gameplay

## Tech Stack

- React 19.0.0
- TypeScript
- Socket.IO for real-time communication
- CSS for styling

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm start
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
/src
    /components      # Reusable UI components
    /contexts        # React context definitions
    /hooks          # Custom React hooks
    /pages          # Main page components
    /socket         # Socket.IO configuration
    /types          # TypeScript type definitions
    /utilities      # Helper functions
```

## Environment

The app uses different endpoints for development and production:
- Development: http://localhost:5000/
- Production: https://polar-harbor-23442.herokuapp.com/

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)