import React, { useState } from "react";
import "./../style.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => setGameStarted(true);

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
      <button className="play-button" onClick={onStart}>Play</button>
    </div>
  );
}

function GameScreen() {
  const [deck, setDeck] = useState(createDeck());
  const [players, setPlayers] = useState(initializePlayers(4));

  const dealCards = () => {
    const shuffledDeck = shuffleDeck([...deck]);
    setPlayers(players.map(player => ({
      ...player,
      hand: shuffledDeck.splice(0, 2),
    })));
    setDeck(shuffledDeck);
  };

  return (
    <div className="game-screen start-screen">
      <div className="chips-display">Your Chips: 1000</div>
      <div className="table">
        <Deck deck={deck} />
        <div className="players">
          {players.map((player, index) => (
            <div
              key={index}
              className={`player player-${index + 1}`}
              style={{
                ...getPlayerPosition(index),
                display: "flex",
                alignItems: "center",
                transform: getRotation(index),
              }}
            >
              {player.hand.map((card, i) => (
                <Card key={i} card={card} isBack={player.name !== "You"} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="controls" style={{ position: "absolute", bottom: "20px", right: "20px" }}>
        <button onClick={dealCards}>Deal Cards</button>
      </div>
    </div>
  );
}

function Deck({ deck }) {
  return (
    <div className="deck">
      {deck.slice(0, 5).map((_, index) => (
        <div
          key={index}
          className="deck-card back"
          style={{
            top: `${-index * 2}px`,
            left: `${-index * 2}px`,
          }}
        ></div>
      ))}
    </div>
  );
}

function Card({ card, isBack }) {
  if (isBack) return <div className="card back"></div>;

  const [rank, suit] = [card.slice(0, -1), card.slice(-1)];
  const suitColor = ["♥", "♦"].includes(suit) ? "red" : "black";

  return (
    <div className="card">
      <div className="card-rank" style={{ color: suitColor }}>{rank}</div>
      <div className="card-suit" style={{ color: suitColor }}>{suit}</div>
    </div>
  );
}

function getRotation(index) {
  return index === 1 ? "rotate(90deg)" : index === 2 ? "rotate(-90deg)" : "none";
}

function getPlayerPosition(index) {
  const positions = [
    { top: "10px", left: "45%", transform: "translateX(-50%)" },
    { top: "40%", left: "10px", transform: "translateY(-50%)" },
    { top: "40%", right: "10px", transform: "translateY(-50%)" },
    { bottom: "10px", left: "45%", transform: "translateX(-50%)" },
  ];
  return positions[index];
}

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  return suits.flatMap(suit => ranks.map(rank => `${rank}${suit}`));
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function initializePlayers(numPlayers) {
  return Array.from({ length: numPlayers }, (_, i) => ({
    name: i === numPlayers - 1 ? "You" : `Player ${i + 1}`,
    hand: [],
    chips: 1000,
  }));
}

export default App;