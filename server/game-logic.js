let io;
let gameSocket;
let gamesInProgress = [];

const _ = require('lodash');

const initializeGame = (sio, client) => {
    console.log('initialize game');
    io = sio;
    gameSocket = client;

    gamesInProgress.push(gameSocket);
    console.log('Games in progress ::: ', gamesInProgress.length);

    gameSocket.on('createNewGame', createNewGame);

    gameSocket.on('playerJoinsRoom', playerJoinsRoom);

    gameSocket.on('startGame', startGame);

    gameSocket.on('makeMove', makeMove);

    gameSocket.on('disconnect', onDisconnect);
};

exports.initializeGame = initializeGame;



function createNewGame(gameData) {
    console.log('Create New Game');

    this.nickname = gameData.nickname;

    this.join(gameData.gameId);

    // this.id is the same as gameSocket.id
    gameData.socketId = this.id;
    
    this.emit('createNewGame', gameData);
    io.sockets.in(gameData.gameId).emit('setGameData', gameData);
}

function playerJoinsRoom(gameData) {
    console.log('Request to joins room with id ::: ', gameData.gameId)

    let sock = this;
    this.nickname = gameData.nickname;
    console.log('Set nickname to ::: ', this.nickname);

    let room = io.sockets.adapter.rooms.get(gameData.gameId);
    console.log('Room ::: ', room);

    if (!room) {
        console.log('This game session does not exist');
        this.emit('status', 'This game session does not exist');
        return;
    }

    if (room.size < 2) {
        console.log('Room is not full');

        let sock = this;
        this.nickname = gameData.nickname;
        console.log('Set nickname to ::: ', this.nickname);

        // setting new key on data object
        gameData.mySocketId = sock.id;
    
        // join existing room
        sock.join(gameData.gameId)

        const players = [];
        const sockets = []
        for (let item of room) {
            sockets.push(item);
            let nickname = io.of('/').sockets.get(item).nickname;
            players.push(nickname);
        }
        console.log(players);
        io.sockets.in(gameData.gameId).emit('playerJoinsRoom', {success: true, message: `${gameData.nickname} joined the room`, players: players, sockets: sockets});

    // otherwise send an error message to the user...
    } else {
        this.emit('playerJoinsRoom', { success: false, message: 'This game is at capacity' });
    }

}

function startGame(gameData) {
    let room = _.cloneDeep(Array.from(io.sockets.adapter.rooms.get(gameData.gameId)));
    console.log('startGame room: ',room)
    const players = [];
    for (let item of room) {
        let nickname = io.of('/').sockets.get(item).nickname;
        players.push(nickname);
    }
    io.sockets.in(gameData.gameId).emit('startGame', {success: true, players: players})
}

function makeMove(gameData) {
    io.sockets.in(gameData.gameId).emit('opponentMove', gameData);
}


function onDisconnect() {
    console.log('disconnect')
    let index = gamesInProgress.indexOf(gameSocket);
    gamesInProgress.splice(index, 1);
}