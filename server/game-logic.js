let io;
let gameSocket;
let gamesInProgress = [];

const initializeGame = (sio, client) => {
    console.log('initialize game');
    io = sio;
    gameSocket = client;

    gamesInProgress.push(gameSocket);
    console.log('Games in progress ::: ', gamesInProgress.length);

    gameSocket.on('createNewGame', createNewGame);

    gameSocket.on('playerJoinsRoom', playerJoinsRoom);

    gameSocket.on('startGame', startGame);

    gameSocket.on('disconnect', onDisconnect);
};

exports.initializeGame = initializeGame;



function createNewGame(data) {
    this.nickname = data.username;
    console.log('set nickname to ::: ', this.nickname);

    this.join(data.gameId);
    console.log('create and join game with id: ', data.gameId);

    // this.id is the same as gameSocket.id
    // send data back to client
    this.emit('createNewGame', { gameId: data.gameId, mySocketId: this.id });
}

function playerJoinsRoom(data) {
    console.log('Player joins room with id ::: ', data.gameId)
    console.log('Games in progress ::: ', gamesInProgress.length);

    let sock = this;
    this.nickname = data.username;

    // get room so we can check if it exists or if it is full
    let room = io.sockets.adapter.rooms.get(data.gameId);
    console.log('Room ::: ', room);

    // if room does not exists...
    if (!room) {
        this.emit('status', 'This game session does not exist');
        return;
    }

    // if room exists and has not reached capacity...
    if (room.size < 2) {
        // setting new key on data object
        data.mySocketId = sock.id;
    
        // join existing room
        sock.join(data.gameId)

        const players = [];
        for (let item of room) {
            let nickname = io.of('/').sockets.get(item).nickname;
            players.push(nickname);
        }

        io.sockets.in(data.gameId).emit('playerJoinsRoom', {success: true, message: `${data.username} joined the room`, players: players});

        // Check if room is at capacity after player joins...
        if (room.size === 2) {
            // io.sockets.in(data.gameId).emit('startGame', data.username)
        }

    // otherwise send an error message to the user...
    } else {
        this.emit('playerJoinsRoom', { success: false, message: 'This game is at capacity' });
    }

}

function startGame(data) {
    io.sockets.in(data.gameId).emit('startGame', {success: true, message: 'Opponent started game'})
}

function onDisconnect() {
    console.log('disconnect')
    let index = gamesInProgress.indexOf(gameSocket);
    gamesInProgress.splice(index, 1);
}