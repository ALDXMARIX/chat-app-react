const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 5500;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const getVisitors = () => {
    let clients = io.sockets.clients().connected;
    let sockets = Object.values(clients);
    let users = sockets.map(s => s.user);
    return users;
}
const emitVisitors = () => {
    io.emit("visitors", getVisitors());
}


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('new_visitor', user => {
      console.log('new_visitor', user);
      socket.user = user;
      emitVisitors();
  });
    
  socket.on('disconnect', ()=> {
    console.log('user disconnected');
  });
    
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});