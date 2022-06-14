

let playersStatistic = [];

module.exports.getStatistic = (socket, players, io) => {
  socket.on("getStatistic", () => {
    playersStatistic = []
    for (const id in players) {
      playersStatistic.push({
        name: players[id]._name,
        kill: players[id].killCounter,
        death: players[id].deathCounter,
      })
    }
    io.sockets.emit("takeStatistic", playersStatistic);
  });
}

