import './Home.scss';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { socket } from '../../connections/socket';


const Home = ({ setUsername }) => {
    // state
    const [gameId, setGameId] = useState('');

    const onCreateNewGame = (e) => {
        e.preventDefault();

        const newGameId = uuid();
        const newUsername = e.target.username.value;

        // update state
        setGameId(newGameId);
        setUsername(newUsername);

        console.log('gameId ::: ', newGameId);
        console.log('username ::: ', newUsername);
        
        // call createNewGame function on server
        socket.emit('createNewGame', { gameId: newGameId, username: newUsername });
    }

    return (
        <>
            {
                gameId ? 
                <Redirect to={`/game/${gameId}`}></Redirect> : 
                <div>
                    <form className='new-game-form' onSubmit={onCreateNewGame}>
                        <label className='new-game-form__label' htmlFor='username'>Add your name to get started</label>
                        <input className='new-game-form__input' type='text' name='username' />
                        <button className='new-game-form__button'>Create New Game</button>
                    </form>
                    <h2>Instructions</h2>
                    <ol>
                        <li>Pick any one of the pockets on your side of the board.</li>
                        <li>Moving counter-clockwise, one stone will be deposited in each pocket until the stones run out.</li>
                        <li>If you run into your own Mancala (store), deposit one piece in it. If you run into your opponent's Mancala, skip it and continue moving to the next pocket.</li>
                        <li>If the last piece you drop is in your own Mancala, you take another turn.</li>
                        <li> If the last piece you drop is in an empty pocket on your side, you capture that piece and any pieces in the pocket directly opposite.</li>
                        <li>Always place all captured pieces in your Mancala (store).</li>
                        <li>The game ends when all six pockets on one side of the Mancala board are empty.</li>
                        <li>The player who still has pieces on his/her side of the board when the game ends captures all of those pieces.</li>
                        <li>Count all the pieces in each Mancala. The winner is the player with the most pieces.</li>
                    </ol>
                </div>
            }  
        </>
    );
}

export default Home;