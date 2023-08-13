const express = require("express");
const app = express();
const server = require("http").Server(app);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const { v4: uuidV4 } = require("uuid");
const cors = require("cors"); // Import the cors middleware

app.set("view engine", "ejs");
app.use(express.static("public"));

// Use the cors middleware
app.use(cors());

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    const roomClients = io.sockets.adapter.rooms.get(roomId);

    if (roomClients?.size === 2) {
      socket.emit("room-full");
    } else {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("user-connected", userId);

      socket.on("send-message", (message) => {
        socket.broadcast.to(roomId).emit("message", message);
      });
    }

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
      if (roomClients?.size < 2) {
        socket.emit("room-free");
      }
    });
  });
});

server.listen(4000);
