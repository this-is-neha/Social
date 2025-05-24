// const http = require('http');

// const app = require("./src/config/express.config")
// const server=http.createServer(app);    
// server.listen(3002,'127.0.0.1',(err)=>{
//     if(!err){
//         console.log("Server is running on port 3002")
//         console.log("Press Ctrl + C to stop the server")
//     }
// })


// index.js



const http = require('http');
const { Server } = require('socket.io');
const app = require("./src/config/express.config");
const Message = require("./src/modules/auth/messgae.model");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


  socket.on("register", (userId) => {

    socket.join(userId);


    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("sendMessage", async ({ from, to, message }) => {
    try {

      const newMsg = new Message({ from, to, message });
      await newMsg.save();


      io.to(to).emit("receiveMessage", {
        from,
        message,
        timestamp: newMsg.timestamp
      });
    } catch (err) {
      console.error("Error saving/sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);


    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, '127.0.0.1', (err) => {
  if (!err) {
    console.log(`Server is running on port ${PORT}`);
    console.log("Press Ctrl + C to stop the server");
  }
});
