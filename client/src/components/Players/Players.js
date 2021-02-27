import React from 'react';

const Players = ({ players }) => {
    return (
        <div>
            <ul>
                {players.map((player, i) => {
                    return <li key={i}>{player}</li>;
                })} 
           </ul>
        </div>
    );
};

export default Players;