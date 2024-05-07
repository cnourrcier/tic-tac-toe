import { useState } from 'react'

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice(); // create a shallow copy
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squaresIsFull(squares)) {
    status = "Cats Game";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O")
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map(row => (
        <div key={row} className="board-row">
          {[0, 1, 2].map(col => {
            return <Square key={col} value={squares[row * 3 + col]} onSquareClick={() => handleClick(row * 3 + col)} />
          })}
        </div>
      ))}
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isReversed, setIsReversed] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function reverseMovesOrder() {
    setIsReversed(!isReversed);
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    if (move === currentMove && move > 0) {
      return (
        <li key={move}>
          <p>You are at move # {move}</p>
        </li>
      )
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    };
  });

  if (isReversed) {
    moves = moves.reverse();
  }

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="toggle-sort">
        <button onClick={() => reverseMovesOrder()}>Reverse Moves Order</button>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function squaresIsFull(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      return false;
    }
  }
  return true;
}





// To collect data from multiple children, or to have two child components communicate with each other, 
// declare the shared state in their parent component instead. 
// The parent component can pass that state back down to the children via props. 
// This keeps the child components in sync with each other and with their parent.

// Lifting state into a parent component is common when React components are refactored.

// In React, it’s conventional to use onSomething names for props which represent events
//  and handleSomething for the function definitions which handle those events.

// By default, all child components re-render automatically when the state of a parent component changes. 
// This includes even the child components that weren’t affected by the change. 

// Info about keys:
// key is a special and reserved property in React. When an element is created, 
// React extracts the key property and stores the key directly on the returned element. 
// Even though key may look like it is passed as props, React automatically uses key to decide which components to update. 
// There’s no way for a component to ask what key its parent specified.

// It’s strongly recommended that you assign proper keys whenever you build dynamic lists. 
// If you don’t have an appropriate key, you may want to consider restructuring your data so that you do.

// If no key is specified, React will report an error and use the array index as a key by default. 
// Using the array index as a key is problematic when trying to re-order a list’s items or inserting/removing list items. 
// Explicitly passing key={i} silences the error but has the same problems as array indices and is not recommended in most cases.

// Keys do not need to be globally unique; they only need to be unique between components and their siblings.

// In the tic-tac-toe game’s history, each past move has a unique ID associated with it: it’s the sequential number of the move. 
// Moves will never be re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.