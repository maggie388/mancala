import React, { useState, useEffect } from 'react';
import { socket, mySocketId } from '../../connections/socket';
import { useParams } from 'react-router-dom';

// components
import GameBoard from '../../components/GameBoard/GameBoard';
import GameAddress from '../../components/GameAddress/GameAddress';
import TurnTracker from '../../components/TurnTracker/TurnTracker';

const Room = ({ nickname, setNickname, isCreator }) => {  
    
    /*
    -----------------------------------------
    ------  5 -  4 -  3 -  2 -  1 -  0 ------ 
    -  6 - - - - - - - - - - - - - - - - 13 -
    ------  7 -  8 -  9 - 10 - 11 - 12 ------
    -----------------------------------------
    */
    
    const startingValues = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
   
    // state
    const [players, setPlayers] = useState([]);
    const [isRoomFull, setIsRoomFull] = useState(false);
    const [gameInProgress, setGameInProgress] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    // game play state 
    const [pitValues, setPitValues] = useState([...startingValues]);
    const [currentPlayer, setCurrentPlayer] = useState('playerOne');
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [message, setMessage] = useState(`waiting for opponent`);
    const [finalScore, setFinalScore] = useState([0, 0]);

    // react-router-dom params
    const { gameId } = useParams();

    // event handlers
    const joinGame = (e) => {
        e.preventDefault();
        const newNickname = e.target.nickname.value
        setNickname(newNickname);
        setPlayers({...players, playerTwo: newNickname});

        // Call playerJoinsRoom event on the server
        socket.emit('playerJoinsRoom', { gameId, nickname: newNickname });
    }

    const startGame = () => {
        socket.emit('startGame', { gameId });
        
    }

    // execute when component mounts
    // set up socket events to listen for
    useEffect(() => {
        if (nickname) {
            setPlayers({playerOne: nickname});
        }

        // Handle the response from the playerJoinsRoom event
        socket.on('playerJoinsRoom', (update) => {
            if (update.success) {
                setPlayers({playerOne: update.players[0], playerTwo: update.players[1]});
                setMessage('ready to start game');
                return;
            }
            setIsRoomFull(true);
        });

        socket.on('startGame', () => {
            console.log('start game');
            setGameInProgress(true);
            setGameStarted(true);
            if (isCreator) {
                console.log('change isMyTurn to: ', !isMyTurn)
                setIsMyTurn(true);
            }
        });

        socket.on('opponentMove', (gameData) => {
            setPitValues(gameData.pitValues);
            setGameInProgress(gameData.gameInProgress);
            setMessage(gameData.message);
            setCurrentPlayer(gameData.currentPlayer)
            if (gameData.fromSocket !== mySocketId && gameData.switchTurn) {
                // setCurrentPlayer(currentPlayer === 'playerOne' ? 'playerTwo' : 'playerOne');
                setIsMyTurn(true);
            }
        });

        socket.on('status', (update) => {
            console.log('status Update ::: ', update);
        });
    },[]);

    // if no user name is passed in, get user name before dispalying game
    if (!nickname) {
        return (
            <form onSubmit={joinGame}>
                <label htmlFor='nickname'>Add your name to continue</label>
                <input type='text' name='nickname' />
                <button>Join Game</button>
            </form>
        );
    }

    if (isRoomFull) {
        return (
            <div>
                <h1>This game is at capacity</h1>
            </div>
        )
    }

    return (
        <div>
            <GameAddress />
            <TurnTracker 
                players={players}
                gameInProgress={gameInProgress} 
                gameStarted={gameStarted}
                currentPlayer={currentPlayer} 
                message={message} 
                finalScore={finalScore}
            />
            {players.playerTwo && !gameInProgress && <button onClick={startGame}>Start Game</button>}
            {gameInProgress && 
            <GameBoard 
                players={players} 
                gameInProgress={gameInProgress} 
                setGameInProgress={setGameInProgress} 
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
                message={message}
                setMessage={setMessage}
                setFinalScore={setFinalScore}
                isMyTurn={isMyTurn}
                setIsMyTurn={setIsMyTurn}
                pitValues={pitValues}
                setPitValues={setPitValues}
            />}

        </div>
    );
}

export default Room;