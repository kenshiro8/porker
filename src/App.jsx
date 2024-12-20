import React, { useState } from "react";
import "./../style.css";

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
  const [deck, setDeck] = useState(createDeck());
  const [players, setPlayers] = useState(initializePlayers(4));

  const dealCards = () => {
    const shuffledDeck = shuffleDeck([...deck]);
    const updatedPlayers = players.map((player) => {
      return {
        ...player,
        hand: shuffledDeck.splice(0, 2),
      };
    });
    setDeck(shuffledDeck);
    setPlayers(updatedPlayers);
  };

  return (
    <div className="game-screen start-screen">
      <div className="chips-display">Your Chips: 1000</div>
      <div className="table">
        <div className="deck">Deck</div>
        <div className="players">
          {players.map((player, index) => (
            <div
              key={index}
              className={`player player-${index + 1}`}
              style={{
                ...getPlayerPosition(index),
                display: `flex`,
                alignItems: `center`,
                transform: getRotation(index),
              }}
            >
              {player.hand.map((card, i) => (
                <Card
                  key={i}
                  card={card}
                  isBack={player.name !== "You"}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        <button onClick={dealCards}>Deal Cards</button>
      </div>
    </div>
  );
}

function getRotation(index) {
  switch (index) {
    case 1: // 左プレイヤー
      return 'rotate(90deg)';
    case 2: // 右プレイヤー
      return 'rotate(-90deg)';
    default:
      return 'none'; // 自分と上部プレイヤーは回転しない
  }
}

function Card({ card, isBack }) {
  const cardStyle = "card";
  if(isBack) {
    return <div className={`${cardStyle} back`}></div>;
  }
  const [rank, suit] = [card.slice(0, -1), card.slice(-1)];
  const suitColor = suit === "♥" || suit === "♦" ? "red" : "black";
 return(
    <div className={cardStyle}>
      <div className="card-rank" style={{ color: suitColor }}>{rank}</div>
      <div className="card-suit" style={{ color: suitColor }}>{suit}</div>
    </div>
  )
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
  const deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push(`${rank}${suit}`);
    });
  });
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function initializePlayers(numPlayers) {
  const players = [];
  for (let i = 0; i < numPlayers; i++) {
    players.push({
      name: i === numPlayers - 1 ? "You" : `Player ${i + 1}`,
      hand: [],
      chips: 1000,
    });
  }
  return players;
}

export default App;
