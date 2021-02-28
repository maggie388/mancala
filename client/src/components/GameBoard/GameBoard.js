import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GameBoard.scss';

// compoenents
import Player from '../Players/Players';
import TurnTracker from '../TurnTracker/TurnTracker';
import GameAddress from '../GameAddress/GameAddress';
import FinalScore from '../FinalScore/FinalScore';

const GameBoard = ({ players }) => {

    /*
    -----------------------------------------
    ------  5 -  4 -  3 -  2 -  1 -  0 ------ 
    -  6 - - - - - - - - - - - - - - - - 13 -
    ------  7 -  8 -  9 - 10 - 11 - 12 ------
    -----------------------------------------
    */
    
    const startingValues = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
    const playersObj = {
        playerOne: 'maggie',
        playerTwo: 'jeff'
    }

    // state
    const [pitValues, setPitValues] = useState([...startingValues]);
    const [currentPlayer, setCurrentPlayer] = useState('playerOne');
    const [gameInProgress, setGameInProgress] = useState(true);
    const [isMyTurn, setIsMyTurn] = useState(true);
    const [message, setMessage] = useState(`${playersObj[currentPlayer]} goes first`);
    const [finalScore, setFinalScore] = useState([0, 0]);

    // game tracking
    const currentPlayerPits = currentPlayer === 'playerOne' ? [0, 1, 2, 3, 4, 5] : [7, 8, 9, 10, 11, 12];
    const opposingPlayerPits = currentPlayer == 'playerOne' ? [7, 8, 9, 10, 11, 12] : [0, 1, 2, 3, 4, 5];
    const currentPlayerStore = currentPlayer === 'playerOne' ? 6 : 13;
    const opposingPlayerStore = currentPlayer === 'playerOne' ? 13 : 6;
    const oposingPits = {
        0: 12,
        1: 11,
        2: 10,
        3: 9,
        4: 8,
        5: 7,
        7: 5,
        8: 4,
        9: 3,
        10: 2,
        11: 1,
        12: 0
    }

    const makeMove = (currentIndex) => {
        let count = pitValues[currentIndex];
        let nextIndex = currentIndex + 1;

        let pitValuesCopy = JSON.parse(JSON.stringify(pitValues));

        // make clicked pit 0
        pitValuesCopy[currentIndex] = 0;

        // distrubute pebbles
        while (count > 0) {
            if (nextIndex > 13) {
                nextIndex = 0;
            }
            if (nextIndex !== opposingPlayerStore) {
                pitValuesCopy[nextIndex] = pitValuesCopy[nextIndex] + 1;
                nextIndex++;
                count--;
            } else {
                nextIndex++;
            }
        }
        setPitValues(pitValuesCopy);

        // check for bonus pebbles condition
        if (currentPlayerPits.includes(nextIndex - 1) && pitValuesCopy[nextIndex -1] === 1) {
            console.log('last was in current player\'s empty pit');
            pitValuesCopy[nextIndex - 1] = 0;
            pitValuesCopy[currentPlayerStore] += 1;
            let opposingPitContains = pitValuesCopy[oposingPits[nextIndex - 1]];
            pitValuesCopy[currentPlayerStore] += opposingPitContains;
            pitValuesCopy[oposingPits[nextIndex - 1]] = 0;
            setPitValues(pitValuesCopy);
        }

        // check game end condition
        const currentPlayerPitsEmpty = currentPlayerPits.filter((pit) => pitValuesCopy[pit] === 0).length === 6;
        const opposingPlayerPitsEmpty = opposingPlayerPits.filter((pit) => pitValuesCopy[pit] === 0).length === 6;

        if (currentPlayerPitsEmpty || opposingPlayerPitsEmpty) {
            setGameInProgress(false);
        }

        // check next turn condition
        if (nextIndex - 1 === currentPlayerStore) {
            setMessage(`The last pebble was placed in ${playersObj[currentPlayer]}'s mancala. ${playersObj[currentPlayer]} goes again!`);
            return;
        }
        setCurrentPlayer(currentPlayer === 'playerOne' ? 'playerTwo' : 'playerOne');
    }

    const playerOneMove = (currentIndex) => {
        if (currentPlayer === 'playerOne' && isMyTurn === true && pitValues[currentIndex] !== 0 && gameInProgress) {
            makeMove(currentIndex)
        }
    }

    const playerTwoMove = (currentIndex) => {
        if (currentPlayer === 'playerTwo' && isMyTurn === true && pitValues[currentIndex] !== 0 && gameInProgress) {
            makeMove(currentIndex)
        }
    }

    useEffect(() => {
        setMessage(`it's ${playersObj[currentPlayer]}'s turn`)
    }, [currentPlayer]);

    useEffect(() => {
        if (!gameInProgress) {
            const playerOneScore = pitValues.slice(0, 7).reduce((a, b) => a + b);
            const playerTwoScore = pitValues.slice(7).reduce((a, b) => a + b);
            const winner = playerOneScore > playerTwoScore ? 'Player one wins!' : playerOneScore === playerTwoScore ? 'It\'s a tie!' : 'Player two wins!';
            setFinalScore([playerOneScore, playerTwoScore]);
            setMessage(`Game Over! ${winner}`);
        }
    }, [gameInProgress]);

    return (
        <>
        <GameAddress />
        <TurnTracker currentPlayer={currentPlayer} message={message} />
        <div className='game-board'>
            <div className='game-board__store'>
                {new Array(pitValues[6]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
            </div>
            <div className='game-board__pit-wrapper'>
                <div className='game-board__player-pits'>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(5)}
                        >
                        {new Array(pitValues[5]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(4)}
                        >
                        {new Array(pitValues[4]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(3)}
                        >
                        {new Array(pitValues[3]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(2)}
                        >
                        {new Array(pitValues[2]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(1)}
                        >
                        {new Array(pitValues[1]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(0)}
                        >
                        {new Array(pitValues[0]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                </div>
                <div className='game-board__player-pits'>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(7)}
                        >
                        {new Array(pitValues[7]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(8)}
                        >
                        {new Array(pitValues[8]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(9)}
                        >
                        {new Array(pitValues[9]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(10)}
                        >
                        {new Array(pitValues[10]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(11)}
                        >
                        {new Array(pitValues[11]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(12)}
                        >
                        {new Array(pitValues[12]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                </div>
            </div>
            <div className='game-board__store'>
                {new Array(pitValues[13]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
            </div>
        </div>
        {!gameInProgress && <FinalScore finalScore={finalScore} /> }
        </>
    );
};

export default GameBoard;