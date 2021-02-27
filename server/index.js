const app = require('express')();
const httpServer = require('http').createServer(app);
const ioOptions = {
    cors: {
        origin: 'http://localhost:3002'
    }
}
const io = require('socket.io')(httpServer, ioOptions);

const gameLogic = require('./game-logic');

const PORT = process.env.PORT || 8000;

io.on('connection', client => {
    // console.log('client id: ', client.id);
    // console.log('client sockets: ', client.sockets);
    console.log('open connection')
    gameLogic.initializeGame(io, client)
})

app.get('/', (req, res) => {
    res.status(200).send('hello world');
})

httpServer.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
});