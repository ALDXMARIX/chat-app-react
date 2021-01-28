var app = require("express")();
var http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
const chatNamespace = io.of('/public-chat');

// var app = require("express")();
// var http = require("http").Server(app);
// var io = require("socket.io")(http);

const port = 6900;

const website = "Batman";

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// const getOnlineUsers = () => {
//   let clients = io.sockets.clients().connected;
//   let sockets = Object.values(clients);
//   let users = sockets.map(s => s.user);
//   return users.filter(u => u != undefined);
// };

const store = {
  messages: [],
};
io.on("connection", function (socket) {
  console.log("a user connected");
  
  const emitOnlineUsers = () => {
    io.emit('ALL_CONNECTED_CLIENTS', Object.values(store).map(e => e.data));
  };
  const clearFeedbackAll = () => {
    socket.broadcast.emit("clear_feedback_all",'');
  };
  const clearFeedback = () => {
    socket.emit("clear_feedback",'');
  };


  // add socket to store, like this
  // note 'data' is null at this point, yet needs to be set
  store[socket.id] = {
    socket : socket, 
    data   : null
  }
  socket.on('user_join', function (user) {
    // here we receive data from frontend, and add it to the serverside reference
    store[socket.id].data = user;
    
    // once a socket updates his custom client data
    // emit all custom data to all clients
    emitOnlineUsers();

    socket.emit("server_message_feedback", {
      name: store[socket.id].data.name,
      message: `Welcome to ${website} ${user.name}!`
    });

    socket.broadcast.emit("server_message", {
      name: website,
      message: `${user.name} just Joined Chat`
    });

    setTimeout(clearFeedback, 4000);
    socket.user = user;
    emitOnlineUsers();

  });

  socket.on('disconnect', function () {
    // if socket disconnects, make sure to remove the reference in your store
    delete store[socket.id];
  });


  socket.on("message", string => {
    // store.messages.push(message);
    const message = {
      name: store[socket.id].data.name,
      message: string
    }

    socket.broadcast.emit("message", message);
    // io.sockets.emit('chat', data);
  });

  socket.on("typing", () => {
    const name = store[socket.id].data.name;
    console.log(name);
    // const name = socket.user.name;
    socket.broadcast.emit("typing", `${name} is typing`);
  });

  socket.on("stopped_typing", ( )=> {
    const name = store[socket.id].data.name;
    socket.broadcast.emit("stopped_typing", `${name} stopped typing`);
    setTimeout(clearFeedbackAll, 4000);
  });
  // socket.on("clear_feedback", () => {
  //   socket.broadcast.emit("clear_feedback",'');
  // });

  socket.on("disconnect", function() {
    const { user } = socket;

    if (user) {
      socket.broadcast.emit("server_message", {
        name: website,
        message: `${user.name} just left chat`
      });
    }
    setTimeout(clearFeedbackAll, 4000);
    emitOnlineUsers();
  });
});

http.listen(port, function() {
  console.log(`listening on *:${port}`);
});
