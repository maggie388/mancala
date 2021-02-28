import './FinalScore.scss';

const FinalScore = ({ finalScore }) => {
    return (
        <div className='final-score'>
            <div className='final-score__column'>
                <div>player one</div>
                <div>{finalScore[0]}</div>
            </div>
            <div className='final-score__column'>
                <div>player two</div>
                <div>{finalScore[1]}</div>
            </div>
        </div>
    );
};

export default FinalScore;