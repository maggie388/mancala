import React, { useState, useEffect } from 'react';
import { socket } from '../../connections/socket';
import { useParams } from 'react-router-dom';

// components
import GameBoard from '../../components/GameBoard/GameBoard';
import GameAddress from '../../components/GameAddress/GameAddress';
import TurnTracker from '../../components/TurnTracker/TurnTracker';

const Room = ({ username, setUsername }) => {    
    // state
    const [players, setPlayers] = useState({});
    const [isRoomFull, setIsRoomFull] = useState(false);
    const [gameInProgress, setGameInProgress] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    // game play state 
    const [currentPlayer, setCurrentPlayer] = useState('playerOne');
    const [message, setMessage] = useState(`waiting for opponent`);
    const [finalScore, setFinalScore] = useState([0, 0]);

    // react-router-dom params
    const { gameId } = useParams();

    // event handlers
    const joinGame = (e) => {
        e.preventDefault();
        const newUsername = e.target.username.value
        setUsername(newUsername);
        setPlayers({...players, playerTwo: newUsername});

        // Call playerJoinsRoom event on the server
        socket.emit('playerJoinsRoom', { gameId, username: newUsername });
    }

    const startGame = () => {
        socket.emit('startGame', {gameId});
        setGameInProgress(true);
    }

    // execute when component mounts
    useEffect(() => {
        if (username) {
            setPlayers({playerOne: username});
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
            setGameInProgress(true);
            setGameStarted(true);
            setMessage(`it's ${players.playerOne}'s turn`);
        });

        socket.on('status', (update) => {
            console.log('status Update ::: ', update);
        })
    },[]);

    // if no user name is passed in, get user name before dispalying game
    if (!username) {
        return (
            <form onSubmit={joinGame}>
                <label htmlFor='username'>Add your name to continue</label>
                <input type='text' name='username' />
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
                setMessage={setMessage}
                setFinalScore={setFinalScore}
            />}

        </div>
    );
}

export default Room;