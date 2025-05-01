import './App.css';
import PingPong from './components/PingPong';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Ping Pong Game</h1>
      </header>
      <main>
        <PingPong />
      </main>
      <footer>
        <p>Use your mouse to control the paddles. Score by getting the ball past your opponent's paddle.</p>
      </footer>
    </div>
  );
}

export default App;
