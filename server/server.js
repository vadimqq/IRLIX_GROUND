const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const getPlayers = require("./player").getPlayers;
const getProjectiles = require("./projectile").getProjectiles;
const getStatistic = require("./gameStatistics").getStatistic;
const getNeutralObject = require("./neutralObject").getNeutralObject;


const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set("port", 8080);
app.use("/static", express.static(path.dirname(__dirname) + "/static"));

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "index.html"));
});

server.listen(8080, () => {
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log(`http://${add}:8080/`);
  })
});

const game = {
  location: null,
  players: null,
  projectile: null,
  neutralObject: null,
};

io.on("connection", (socket) => {
  game.players = getPlayers(socket, io);
  game.projectile = getProjectiles(socket, game.players);
  getNeutralObject(socket, game.players, io);
  getStatistic(socket, game.players, io);
});


const gameLoop = (game, io) => {
  io.sockets.emit("state", game);
};

setInterval(() => {
  if (game && io) {
    gameLoop(game, io);
  }
}, 1000 / 60)
