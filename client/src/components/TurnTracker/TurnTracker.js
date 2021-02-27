import React from 'react';
import './TurnTracker.scss';

const TurnTracker = ({ message }) => {
    return (
        <div className='turn-tracker'>
            <div>
                <h3>player one</h3>
                <div>maggie</div>
            </div>
            <div>
                {message}
            </div>
            <div>
                <h3>player two</h3>
                <p>jeff</p>
            </div>
        </div>
    );
};

export default TurnTracker;