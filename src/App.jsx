import React, { useState } from "react";
import "./../style.css"; // カスタムCSSでカジノ風のデザインを適用

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="app">
      {gameStarted ? <GameScreen /> : <StartScreen onStart={startGame} />}
    </div>
  );
}

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1>Poker</h1>
      <button className="play-button" onClick={onStart}>
        Play
      </button>
    </div>
  );
}

function GameScreen() {
  const players = ["Player 1", "Player 2", "Player 3", "You"];

  return (
    <div className="game-screen start-screen">
    <div className="chips-display">Your Chips: 1000</div>
      <div className="table">
        <div className="deck">Deck</div>
        <div className="players">
          {players.map((player, index) => (
            <div
              key={index}
              className={`player player-${index + 1} ${player === "You" ? "your-hand" : ""}`}
            >
              {player === "You" ? "Your Cards" : "Opponent"}
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        <button>Deal Cards</button>
      </div>
    </div>
  );
}

export default App;
