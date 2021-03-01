import './TurnTracker.scss';

const TurnTracker = ({ currentPlayer, gameInProgress, message }) => {
    return (
        <div className='turn-tracker'>
            <div className={currentPlayer === 'playerOne' && gameInProgress ? 'turn-tracker__player--active' : 'turn-tracker__player'}>
                <h3 className='turn-tracker__player-heading'>player one</h3>
                <div>maggie</div>
            </div>
            <div className='turn-tracker__message'>
                {message}
            </div>
            <div className={currentPlayer === 'playerTwo' && gameInProgress ? 'turn-tracker__player--active' : 'turn-tracker__player'}>
                <h3 className='turn-tracker__player-heading'>player two</h3>
                <p>jeff</p>
            </div>
        </div>
    );
};

export default TurnTracker;