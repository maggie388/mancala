import './GameAddress.scss';
import { useRef } from 'react';

// assets
import copyIcon from '../../assets/icon-copy.svg';

const GameAddress = () => {
    const inputEl = useRef();

    const handleClick = (e) => {
        navigator.clipboard.writeText(inputEl.current.value);
    }

    return (
        <div class="game-address">
            <input className='game-address__input' type='text' ref={inputEl} value={window.location.href} />
            <button className='game-address__button' onClick={handleClick}>
                <img src={copyIcon} alt='copy' />
            </button>
        </div>
    );
};

export default GameAddress;

