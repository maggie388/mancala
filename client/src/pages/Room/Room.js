import React, { useState, useEffect } from 'react';
import { socket } from '../../connections/socket';
import { useParams } from 'react-router-dom';

import GetUserName from '../../components/GetUserName/GetUserName';
import GameBoard from '../../components/GameBoard/GameBoard';
import Players from '../../components/Players/Players';

const Room = ({ username, setUsername }) => {
    // state
    const [players, setPlayers] = useState([]);
    const [isRoomFull, setIsRoomFull] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    // react-router-dom params
    const { gameId } = useParams();

    // event handlers
    const joinGame = (e) => {
        e.preventDefault();
        const newUsername = e.target.username.value
        setUsername(newUsername);
        setPlayers([...players, newUsername]);

        // Call playerJoinsRoom event on the server
        socket.emit('playerJoinsRoom', { gameId, username: newUsername });
    }

    const startGame = () => {
        socket.emit('startGame', {gameId});
        setGameStarted(true);
    }

    // execute when component mounts
    useEffect(() => {
        if (username) {
            setPlayers([username]);
        }

        // Handle the response from the playerJoinsRoom event
        socket.on('playerJoinsRoom', (update) => {
            if (update.success) {
                setPlayers([...update.players]);
                return;
            }
            setIsRoomFull(true);
        });

        socket.on('startGame', () => {
            setGameStarted(true);
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
            <h1>{`Welcome to your game ${username}!`}</h1>
            {players.length === 1 ? 'Waiting for opponent' : 'You can now start the game'}
            {players.length > 0 ? <Players players={players} /> : ''}
            {players.length === 2 && gameStarted === false ? <button onClick={startGame}>Start Game</button> : ''}
            {gameStarted && <GameBoard players={players} />}

        </div>
    );
}

export default Room;