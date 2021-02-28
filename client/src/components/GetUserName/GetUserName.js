const GetUserName = ({ setUserName, players, setPlayers }) => {
    const onSubmit = (e) => {
        e.preventDefault();
        console.log(e.target.username.value);
        setUserName(e.target.username.value);
        setPlayers([...players, e.target.username.value])
    }

    return (
        <form onSubmit={onSubmit}>
            <label htmlFor='username'>Enter your name:</label>
            <input type='text' name='username'/>
            <button>Join Game</button>
        </form>
    );
};

export default GetUserName;