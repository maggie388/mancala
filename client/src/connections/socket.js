import io from 'socket.io-client';
const url = 'http://localhost:8000';
const socket = io(url);

let mySocketId;

socket.on('createNewGame', gameData => {
    mySocketId = gameData.socketId;
});

export {
    socket,
    mySocketId
}