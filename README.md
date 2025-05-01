# Ping Pong Game

A simple ping pong game built with React and HTML5 Canvas.

## Features

- Two-player paddle control using mouse
- Ball physics with speed increase on paddle hits
- Score tracking
- Start/restart game functionality
- Responsive design

## How to Play

1. Click the "Start Game" button to begin
2. Move your mouse to the left side of the canvas to control Player 1's paddle
3. Move your mouse to the right side of the canvas to control Player 2's paddle
4. Score points by getting the ball past your opponent's paddle
5. The ball speed increases each time it hits a paddle
6. Click "Restart Game" to start a new game

## Installation

1. Clone the repository:
```
git clone https://github.com/rohanandelkar/ping-pong-game.git
```

2. Navigate to the project directory:
```
cd ping-pong-game
```

3. Install dependencies:
```
npm install
```

4. Start the development server:
```
npm start
```

5. Open your browser and navigate to the local server address shown in the terminal

## Game Implementation Details

- The game uses HTML5 Canvas for rendering
- React for UI components and state management
- Frame rate independent movement for consistent gameplay across devices
- Paddle control based on mouse position relative to canvas
- Dynamic ball physics with angle effects based on paddle hit location

## Technologies Used

- React
- HTML5 Canvas
- CSS3
- Vite

## License

This project is open source and available under the MIT License.
