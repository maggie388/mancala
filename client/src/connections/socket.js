import io from 'socket.io-client';

const url = 'http://localhost:8000';

const socket = io(url);

let mySocketId;

socket.on('createNewGame', statusUpdate => {
    mySocketId = statusUpdate.mySocketId;
});

export {
    socket,
    mySocketId
}