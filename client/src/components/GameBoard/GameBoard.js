import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GameBoard.scss';

// compoenents
import TurnTracker from '../TurnTracker/TurnTracker';
import { mySocketId, socket } from '../../connections/socket';


const GameBoard = ({ players, gameInProgress, currentPlayer, setCurrentPlayer, setMessage, setFinalScore, isMyTurn, setIsMyTurn, pitValues}) => {

    /*
    -----------------------------------------
    ------  5 -  4 -  3 -  2 -  1 -  0 ------ 
    -  6 - - - - - - - - - - - - - - - - 13 -
    ------  7 -  8 -  9 - 10 - 11 - 12 ------
    -----------------------------------------
    */
    
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

    // react-router-dom params
    const { gameId } = useParams();

    const makeMove = (currentIndex) => {
        let count = pitValues[currentIndex];
        let nextIndex = currentIndex + 1;

        let pitValuesProxy = JSON.parse(JSON.stringify(pitValues));
        let gameInProgressProxy = true;
        let messageProxy = '';
        let switchTurn = true;

        // make clicked pit 0
        pitValuesProxy[currentIndex] = 0;

        // distrubute pebbles
        while (count > 0) {
            if (nextIndex > 13) {
                nextIndex = 0;
            }
            if (nextIndex !== opposingPlayerStore) {
                pitValuesProxy[nextIndex] = pitValuesProxy[nextIndex] + 1;
                nextIndex++;
                count--;
            } else {
                nextIndex++;
            }
        }

        // check for bonus pebbles condition
        if (currentPlayerPits.includes(nextIndex - 1) && pitValuesProxy[nextIndex -1] === 1) {
            console.log('last was in current player\'s empty pit');
            pitValuesProxy[nextIndex - 1] = 0;
            pitValuesProxy[currentPlayerStore] += 1;
            let opposingPitContains = pitValuesProxy[oposingPits[nextIndex - 1]];
            pitValuesProxy[currentPlayerStore] += opposingPitContains;
            pitValuesProxy[oposingPits[nextIndex - 1]] = 0;
        }

        // check game end condition
        const currentPlayerPitsEmpty = currentPlayerPits.filter((pit) => pitValuesProxy[pit] === 0).length === 6;
        const opposingPlayerPitsEmpty = opposingPlayerPits.filter((pit) => pitValuesProxy[pit] === 0).length === 6;

        if (currentPlayerPitsEmpty || opposingPlayerPitsEmpty) {
            gameInProgress = false;
        }

        // check next turn condition
        if (nextIndex - 1 === currentPlayerStore) {
            messageProxy = `The last pebble was placed in ${players[currentPlayer]}'s mancala. ${players[currentPlayer]} goes again!`;
            switchTurn = false;
            
        } 
        if (isMyTurn) {
            socket.emit('makeMove', { 
                gameId, 
                gameInProgress: gameInProgressProxy,
                message: messageProxy,
                pitValues: pitValuesProxy, 
                switchTurn, 
                fromSocket: mySocketId, 
                currentPlayer: switchTurn ? currentPlayer === 'playerOne' ? 'playerTwo' : 'playerOne' : currentPlayer
               });
            if (switchTurn) {
                setIsMyTurn(false);
            }
        }
    }

    const playerOneMove = (currentIndex) => {
        if (currentPlayer === 'playerOne' && isMyTurn && pitValues[currentIndex] !== 0 && gameInProgress) {
            makeMove(currentIndex)
        }
    }

    const playerTwoMove = (currentIndex) => {
        if (currentPlayer === 'playerTwo' && isMyTurn && pitValues[currentIndex] !== 0 && gameInProgress) {
            makeMove(currentIndex)
        }
    };

    useEffect(() => {
        setMessage(`it's ${players[currentPlayer]}'s turn`)
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
        <div className='game-board'>
            <div className='game-board__store'>
                {new Array(pitValues[6]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
            </div>
            <div className='game-board__pit-wrapper'>
                <div className='game-board__player-pits'>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn  && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(5)}
                        >
                        {new Array(pitValues[5]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(4)}
                        >
                        {new Array(pitValues[4]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(3)}
                        >
                        {new Array(pitValues[3]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(2)}
                        >
                        {new Array(pitValues[2]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(1)}
                        >
                        {new Array(pitValues[1]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerOne' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerOneMove(0)}
                        >
                        {new Array(pitValues[0]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                </div>
                <div className='game-board__player-pits'>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(7)}
                        >
                        {new Array(pitValues[7]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(8)}
                        >
                        {new Array(pitValues[8]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(9)}
                        >
                        {new Array(pitValues[9]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(10)}
                        >
                        {new Array(pitValues[10]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
                        onClick={() => playerTwoMove(11)}
                        >
                        {new Array(pitValues[11]).fill(undefined).map((_, i) => <div key={i} className='game-board__pebble'></div>)}
                    </div>
                    <div 
                        className={currentPlayer === 'playerTwo' && isMyTurn && gameInProgress ? 'game-board__pit--active' : 'game-board__pit'} 
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
        </>
    );
};

export default GameBoard;