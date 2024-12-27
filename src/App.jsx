import React, { useState } from "react";
import "./../style.css";

const INITIAL_CHIPS = 1000;
const INITIAL_DECK = createDeck();
const MIN_BET = 50;

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="app">
      {gameStarted ? (
        <GameScreen 
          initialDeck={INITIAL_DECK}
          initialChips={INITIAL_CHIPS}
        />
      ) : (
        <StartScreen onStart={() => setGameStarted(true)} />
      )}
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

function GameScreen({ initialDeck, initialChips }) {
  const [deck, setDeck] = useState(initialDeck);
  const [players, setPlayers] = useState(initializePlayers(4, initialChips));
  const [communityCards, setCommunityCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(MIN_BET);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [round, setRound] = useState("pre-flop");

  const dealHoleCards = () => {
    const newDeck = [...deck];
    const updatedPlayers = players.map(player => ({
      ...player,
      hand: [newDeck.pop(), newDeck.pop()],
    }));
    setPlayers(updatedPlayers);
    setDeck(newDeck);
  };

  const dealCommunityCard = () => {
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    setCommunityCards([...communityCards, newCard]);
    setDeck(newDeck);
  };

  const handleBet = (amount) => {
    const updatedPlayers = players.map((player, index) => {
      if (index === currentPlayerIndex) {
        return { ...player, chips: player.chips - amount };
      }
      return player;
    });
    setPlayers(updatedPlayers);
    setPot(pot + amount);
    setCurrentBet(amount);
    nextPlayer();
  };

  const handleFold = () => {
    const updatedPlayers = players.map((player, index) => {
      if (index === currentPlayerIndex) {
        return { ...player, active: false };
      }
      return player;
    });
    setPlayers(updatedPlayers);
    nextPlayer();
  };

  const handleCheck = () => {
    nextPlayer();
  };

  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
  };

  const advanceRound = () => {
    switch (round) {
      case "pre-flop":
        setRound("flop");
        dealCommunityCard();
        dealCommunityCard();
        dealCommunityCard();
        break;
      case "flop":
        setRound("turn");
        dealCommunityCard();
        break;
      case "turn":
        setRound("river");
        dealCommunityCard();
        break;
      case "river":
        setRound("showdown");
        break;
      default:
        break;
    }
  };

  return (
    <div className="game-screen">
      <div className="chips-display">Your Chips: {players[players.length - 1].chips}</div>
      <div className="table">
        <div className="community-cards">
          {communityCards.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>
        <div className="deck">
          <div className="deck-card back"></div>
        </div>
        <div className="players">
          {players.map((player, index) => (
            <div
              key={index}
              className={`player player-${index + 1}`}
              style={getPlayerPosition(index)}
            >
              <Player player={player} isVertical={index === 1 || index === 2} isBack={index !== 3} />
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        {round !== "showdown" && (
          <>
            <button onClick={() => handleBet(currentBet)}>Bet {currentBet}</button>
            <button onClick={handleCheck}>Check</button>
            <button onClick={handleFold}>Fold</button>
          </>
        )}
        {round !== "showdown" && <button onClick={advanceRound}>Next Round</button>}
      </div>
      <div className="pot-display">Pot: {pot}</div>
    </div>
  );
}

function Card({ card, isBack, isRotated, cardOffset }) {
  const cardClass = `card${isRotated ? " rotated" : ""}`;

  if (isBack) {
    return <div className={cardClass + " back"} style={{ top: cardOffset }}></div>;
  }

  const [rank, suit] = [card.slice(0, -1), card.slice(-1)];
  const suitColor = ["♥", "♦"].includes(suit) ? "red" : "black";

  return (
    <div className={cardClass} style={{ top: cardOffset }}>
      <div className="card-rank" style={{ color: suitColor }}>{rank}</div>
      <div className="card-suit" style={{ color: suitColor }}>{suit}</div>
    </div>
  );
}

function Player({ player, isVertical, isBack }) {
  return (
    <div className="player">
      <div
        className="hand"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
        }}
      >
        {player.hand.map((card, index) => (
          <Card
            key={index}
            card={card}
            isBack={isBack}
            isRotated={isVertical}
            cardOffset={isVertical ? `${index * 20}px` : "0"}
          />
        ))}
      </div>
      <div className="chips">Chips: {player.chips}</div>
    </div>
  );
}

function getPlayerPosition(index) {
  const positions = [
    { top: "5%", left: "45%", transform: "translateX(-50%)" }, // 上部
    { top: "45%", left: "5%", transform: "translateY(-50%)" }, // 左側
    { top: "45%", right: "15%", transform: "translateY(-50%)" }, // 右側
    { bottom: "15%", left: "45%", transform: "translateX(-50%)" }, // 下部（自分）
  ];
  return positions[index];
}

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck = suits.flatMap(suit => ranks.map(rank => `${rank}${suit}`));
  return shuffle(deck);
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function initializePlayers(numPlayers, initialChips) {
  return Array.from({ length: numPlayers }, (_, index) => ({
    name: `Player ${index + 1}`,
    chips: initialChips,
    hand: [],
    active: true,
  }));
}

export default App;
