const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const Filter = require("bad-words");
const generateMessage = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    const user = getUser(socket.id);

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }

    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  socket.on("sendLocation", (data, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "locationMessage",
      generateMessage(
        user.username,
        `https://google.com/maps?q=${data.latitude},${data.longitude}`
      )
    );

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("System", `${user.username} has left the chat!`)
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("join", ({ username, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("System", `${user.username} has joined!`)
      );
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
