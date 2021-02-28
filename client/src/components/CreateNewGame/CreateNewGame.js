import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { socket } from '../../connections/socket';
import { Redirect } from 'react-router-dom';

// components
import NewGameButton from '../../components/NewGameButton/NewGameButton';

const CreateNewGame = () => {
    const [gameId, setGameId] = useState('');
  
    const onCreateNewGame = () => {
        const gameId = uuid();
        setGameId(gameId);
        console.log('game id: ', gameId);
        socket.emit('createNewGame', { gameId });
    }

    const renderCreateGameButton = () => {
        return <button onClick={onCreateNewGame}>Create New Game</button>;
    }

    return (
        <>
            {gameId ? 
            <Redirect to={`/game/${gameId}`}></Redirect> : 
            <NewGameButton />}
        </>
    );
};

export default CreateNewGame;