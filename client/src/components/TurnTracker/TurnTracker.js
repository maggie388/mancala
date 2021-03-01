import './TurnTracker.scss';

const TurnTracker = ({ players, currentPlayer, gameInProgress, gameStarted, message, finalScore }) => {
    return (
        <div className='turn-tracker'>
            <div className={currentPlayer === 'playerOne' && gameInProgress ? 'turn-tracker__player--active' : 'turn-tracker__player'}>
                <div className='turn-tracker__name-group'>
                    <h3 className='turn-tracker__player-heading'>player one</h3>
                    <div>{players.playerOne ? players.playerOne : '...'}</div>
                </div>
                {!gameInProgress && gameStarted && <div className='turn-tracker__score'>{finalScore[0]}</div>}
            </div>
            <div className='turn-tracker__message'>
                {message}
            </div>
            <div className={currentPlayer === 'playerTwo' && gameInProgress ? 'turn-tracker__player--active' : 'turn-tracker__player'}>
                {!gameInProgress && gameStarted && <div className='turn-tracker__score'>{finalScore[1]}</div>}
                <div className='turn-tracker__name-group'>
                    <h3 className='turn-tracker__player-heading'>player two</h3>
                    <p>{players.playerTwo ? players.playerTwo : '...'}</p>
                </div>
                
            </div>
        </div>
    );
};

export default TurnTracker;