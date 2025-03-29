const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { generateInviteCode, validateInviteCode, expireOldCodes } = require("./inviteCodes");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React Vite default port
    methods: ["GET", "POST"],
  },
});

// Store active game rooms
let rooms = {};

// Player connects
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("create_game", async () => {
    const inviteCode = await generateInviteCode();
    rooms[inviteCode] = [socket.id];
    socket.join(inviteCode);
    socket.emit("invite_code", inviteCode);
  });

  socket.on("join_game", async (inviteCode) => {
    if (await validateInviteCode(inviteCode) && rooms[inviteCode]?.length === 1) {
      rooms[inviteCode].push(socket.id);
      socket.join(inviteCode);
      io.to(inviteCode).emit("start_game");
    } else {
      socket.emit("error", "Invalid or expired code");
    }
  });

  socket.on("game_update", ({ inviteCode, gameData }) => {
    socket.to(inviteCode).emit("game_update", gameData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    Object.keys(rooms).forEach((code) => {
      rooms[code] = rooms[code].filter((id) => id !== socket.id);
      if (rooms[code].length === 0) delete rooms[code];
    });
  });
});

// Periodically expire codes
setInterval(expireOldCodes, 60000); // every minute

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
