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
const chatNamespace = io.of('/chat');

const port = 6600;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// const getVisitors = async() => {

//   // let clients = io.clients((error, clients) => {
//   //   return clients;
//   // });

//   // const myIDs = [];
//   // const myIDs2 = [];
//   // io.allSockets().then(data => {
//   //   console.log(data);
//   //   myIDs.push(data);
//   //   const specificClient = io.sockets.connected[data];
//   //   myIDs2.push(specificClient);

//   // })

//   const myIDs = [];
//   const myIDs2 = [];


//   const ids = await io.of("/").allSockets().then(data => {
//     console.log(data);
//     myIDs.push(data);
//     const set = new Set(data);
//     const values = set.values();
//     const array = Array.from(values);
//     myIDs.push(array);
//   }
//   )  
//   for (const id of myIDs) {
//     const specificClient = io.sockets.connected[id];
//     console.log(specificClient);
//   }

//   // console.log(ids);
//   console.log(myIDs);
//   // console.log(myIDs2);



// //   specificClient.then(data => {
// //     console.log(data);
// //   })
// //       myIDs2.push(specificClient);
  
// // })

// // const specificClient = io.sockets.connected[data];


// // const clients = io.sockets.connected;
// // const specificClient = io.sockets.connected[id];


//   //   console.log(myIDs);
//   // // id = clients.get()
//   // var sockets_in_room = io.nsps['/'].adapter.rooms['room1'];
//   // var socket_objects = []


//   // var socket_objects = []
//   // // let clients = io.allSockets().then()

//   //   io.allSockets().then(id => {
//   //     id.forEach(id => {
//   //     console.log(id.user)
//   //     // const allIds = id.data();
//   //     socket_objects.push(id);
//   //   })
//   // })
//   // console.log(socket_objects);


//   // const ids = Array.from(clients);

//   // for (id in ids) {
//   //   socket_objects.push(io.sockets.connected[id])
//   // } 
//   // clients.get(socketId);

// //   var srvSockets = io.sockets.sockets;
// // Object.keys(srvSockets);

// //   let users;
// //   // loop through all sockets
// // const sockets = io.of("room1").connected;
// // for (const id in sockets) {
// //   let sockets = Object.values(id);
// //   users = sockets.map(s => s.user);
// //   }
// //   console.log(users);
// //   return users;

// // get the number of connected sockets
// // const count = Object.keys(io.of("/").connected).length;

  
// //   let sockets = Object.values(socket_objects);
//   // let users = sockets.map(s => s.user);

//   // console.log(clients);
//   // return users;
// };

// const getVisitors = () => {
//   let clients = io.sockets.clients().connected;
//   let sockets = Object.values(clients);
//   let users = sockets.map(s => s.user);
//   return users;
// }
const getVisitors = async () => {
  const socketMap = io.sockets.connected;
  const allUserData = Object.values(socketMap).map((s) => {
    return s.user
  });
  return allUserData;
}

// const getVisitors = async () => {
//   const clients = io.sockets.connected;
//   let sockets = Object.values(clients);
//   let users = sockets.map(s => s.user);
//   return users;
// }

const emitVisitors = () => {
  io.emit("visitors", getVisitors());
};

const store = {};
io.on("connection", function (socket) {

  // add socket to store, like this
  // note 'data' is null at this point, yet needs to be set
  store[socket.id] = {
    socket : socket, 
    data   : null
  }
  socket.on('SET_CLIENT_DATA', function (clientdata) {
    // here we receive data from frontend, and add it to the serverside reference
    store[socket.id].data = clientdata;
 
    // once a socket updates his custom client data
    // emit all custom data to all clients
    io.emit('ALL_CONNECTED_CLIENTS', Object.values(store).map(e => e.data));
  });

  socket.on('disconnect', function () {
    // if socket disconnects, make sure to remove the reference in your store
    delete store[socket.id];
  });



  // socket.join("room1");
  console.log("a user connected");

  socket.on("new_visitor", user => {
    console.log("new_visitor", user);
    socket["user"] = user;
    emitVisitors();
  });

  socket.on("disconnect", function() {
    emitVisitors();
    console.log("user disconnected");
  });
});

http.listen(port, function() {
  console.log(`listening on *:${port}`);
});





