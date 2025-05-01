import React, { useRef, useEffect, useState } from 'react';
import './PingPong.css';

const PingPong = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  
  // Game constants
  const PADDLE_HEIGHT = 100;
  const PADDLE_WIDTH = 10;
  const BALL_RADIUS = 10;
  const INITIAL_BALL_SPEED = 5;
  
  // Game state
  const gameStateRef = useRef({
    ballX: 0,
    ballY: 0,
    ballSpeedX: INITIAL_BALL_SPEED,
    ballSpeedY: INITIAL_BALL_SPEED,
    paddle1Y: 0,
    paddle2Y: 0,
    canvasWidth: 800,
    canvasHeight: 400,
    lastFrameTime: 0
  });
  
  // Animation frame reference
  const animationFrameRef = useRef(null);
  
  // Initialize game
  const initGame = () => {
    const state = gameStateRef.current;
    
    // Reset ball position to center
    state.ballX = state.canvasWidth / 2;
    state.ballY = state.canvasHeight / 2;
    
    // Reset paddle positions
    state.paddle1Y = (state.canvasHeight - PADDLE_HEIGHT) / 2;
    state.paddle2Y = (state.canvasHeight - PADDLE_HEIGHT) / 2;
    
    // Random ball direction
    state.ballSpeedX = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    state.ballSpeedY = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    
    // Reset time
    state.lastFrameTime = performance.now();
  };
  
  // Handle mouse movement for paddle control
  const handleMouseMove = (e) => {
    if (!gameStarted) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const mouseX = e.clientX - rect.left;
    const state = gameStateRef.current;
    
    // Calculate paddle position based on mouse position
    const paddleTargetY = mouseY - PADDLE_HEIGHT / 2;
    
    // Determine which paddle to move based on mouse X position
    if (mouseX < state.canvasWidth / 2) {
      // Left side - Player 1
      state.paddle1Y = Math.max(0, Math.min(state.canvasHeight - PADDLE_HEIGHT, paddleTargetY));
    } else {
      // Right side - Player 2
      state.paddle2Y = Math.max(0, Math.min(state.canvasHeight - PADDLE_HEIGHT, paddleTargetY));
    }
  };
  
  // Update game state
  const updateGame = (timestamp) => {
    const state = gameStateRef.current;
    const deltaTime = timestamp - state.lastFrameTime;
    state.lastFrameTime = timestamp;
    
    // Normalize movement based on frame rate
    const timeScale = deltaTime / 16.67; // 60 FPS = 16.67ms per frame
    
    // Move the ball
    state.ballX += state.ballSpeedX * timeScale;
    state.ballY += state.ballSpeedY * timeScale;
    
    // Ball collision with top and bottom walls
    if (state.ballY - BALL_RADIUS < 0 || state.ballY + BALL_RADIUS > state.canvasHeight) {
      state.ballSpeedY = -state.ballSpeedY;
      
      // Adjust ball position to prevent sticking to the wall
      if (state.ballY - BALL_RADIUS < 0) {
        state.ballY = BALL_RADIUS;
      } else {
        state.ballY = state.canvasHeight - BALL_RADIUS;
      }
    }
    
    // Ball collision with paddles
    if (
      // Left paddle
      state.ballX - BALL_RADIUS < PADDLE_WIDTH &&
      state.ballX + BALL_RADIUS > 0 &&
      state.ballY > state.paddle1Y &&
      state.ballY < state.paddle1Y + PADDLE_HEIGHT
    ) {
      // Reverse direction and add some angle based on where the ball hit the paddle
      state.ballSpeedX = -state.ballSpeedX;
      
      // Calculate impact point (0 = top of paddle, 1 = bottom of paddle)
      const impactPoint = (state.ballY - state.paddle1Y) / PADDLE_HEIGHT;
      
      // Add angle effect (higher = more angle)
      const maxAngleEffect = 5;
      state.ballSpeedY = maxAngleEffect * (impactPoint - 0.5);
      
      // Increase speed slightly
      const speedIncrease = 1.05;
      state.ballSpeedX *= speedIncrease;
      
      // Prevent ball from getting stuck in paddle
      state.ballX = PADDLE_WIDTH + BALL_RADIUS;
    } else if (
      // Right paddle
      state.ballX + BALL_RADIUS > state.canvasWidth - PADDLE_WIDTH &&
      state.ballX - BALL_RADIUS < state.canvasWidth &&
      state.ballY > state.paddle2Y &&
      state.ballY < state.paddle2Y + PADDLE_HEIGHT
    ) {
      // Reverse direction and add some angle based on where the ball hit the paddle
      state.ballSpeedX = -state.ballSpeedX;
      
      // Calculate impact point (0 = top of paddle, 1 = bottom of paddle)
      const impactPoint = (state.ballY - state.paddle2Y) / PADDLE_HEIGHT;
      
      // Add angle effect (higher = more angle)
      const maxAngleEffect = 5;
      state.ballSpeedY = maxAngleEffect * (impactPoint - 0.5);
      
      // Increase speed slightly
      const speedIncrease = 1.05;
      state.ballSpeedX *= speedIncrease;
      
      // Prevent ball from getting stuck in paddle
      state.ballX = state.canvasWidth - PADDLE_WIDTH - BALL_RADIUS;
    }
    
    // Ball out of bounds (scoring)
    if (state.ballX < 0) {
      // Player 2 scores
      setPlayer2Score(prevScore => prevScore + 1);
      initGame();
    } else if (state.ballX > state.canvasWidth) {
      // Player 1 scores
      setPlayer1Score(prevScore => prevScore + 1);
      initGame();
    }
  };
  
  // Render game
  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight);
    
    // Set fill style
    ctx.fillStyle = 'white';
    
    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(state.canvasWidth / 2, 0);
    ctx.lineTo(state.canvasWidth / 2, state.canvasHeight);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillRect(0, state.paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(state.canvasWidth - PADDLE_WIDTH, state.paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(state.ballX, state.ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    
    // Draw scores
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player1Score.toString(), state.canvasWidth / 4, 30);
    ctx.fillText(player2Score.toString(), (state.canvasWidth / 4) * 3, 30);
  };
  
  // Game loop
  const gameLoop = (timestamp) => {
    if (!gameStarted) return;
    
    updateGame(timestamp);
    renderGame();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };
  
  // Start/restart game
  const toggleGame = () => {
    if (gameStarted) {
      // Stop game
      cancelAnimationFrame(animationFrameRef.current);
      setGameStarted(false);
    } else {
      // Start game
      setPlayer1Score(0);
      setPlayer2Score(0);
      initGame();
      setGameStarted(true);
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };
  
  // Set up canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions
    canvas.width = gameStateRef.current.canvasWidth;
    canvas.height = gameStateRef.current.canvasHeight;
    
    // Initialize game state
    initGame();
    
    // Draw initial state
    renderGame();
    
    // Add event listener for mouse movement
    const handleMouseMoveEvent = (e) => handleMouseMove(e);
    canvas.addEventListener('mousemove', handleMouseMoveEvent);
    
    // Cleanup
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMoveEvent);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);
  
  // Handle game state changes
  useEffect(() => {
    if (gameStarted) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted]);
  
  return (
    <div className="ping-pong-container">
      <div className="score-board">
        <div className="score">
          <span>Player 1: {player1Score}</span>
        </div>
        <div className="score">
          <span>Player 2: {player2Score}</span>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        className="ping-pong-canvas" 
        tabIndex="0"
      ></canvas>
      <button className="control-button" onClick={toggleGame}>
        {gameStarted ? 'Restart Game' : 'Start Game'}
      </button>
      <div className="instructions">
        <p>Move your mouse to the left side to control Player 1's paddle.</p>
        <p>Move your mouse to the right side to control Player 2's paddle.</p>
      </div>
      <div className="footer">
        <p>Use your mouse to control the paddles. Score by getting the ball past your opponent's paddle.</p>
      </div>
    </div>
  );
};

export default PingPong;