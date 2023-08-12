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
  console.log("XD");
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    // console.log("roomClients", roomClients);

    const roomClients = io.sockets.adapter.rooms.get(roomId);
    console.log("xx", roomClients);

    if (roomClients?.size === 2) {
      socket.emit("room-full");
    } else {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit("user-connected", userId);
    }

    console.log("roomClients", roomClients);

    socket.on("disconnect", () => {
      console.log("disconnected");
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
      if (roomClients?.size < 2) {
        socket.emit("room-free");
      }
    });
  });
});

server.listen(4000);
