const physic = require("./constants").physic;
const listOfSpawnPoint = require("./constants").levelLocation.spawnPoints;

let timer = 0

const listOfObject = [];
const spawnTime = 10000;
let server = null
class NeutralObject {
  constructor(props) {
    this._id = props.id;
    this._radius = physic.m;
    this._type = props.type;

    this.positionX = props.x * physic.m;
    this.positionY = props.y * physic.m;
  }

  delete(index) {
    listOfObject.splice(index, 1)
    server.sockets.emit("updateNeutralObject", listOfObject)
  }
}

setInterval(() => {
  if (timer + 1000 >= spawnTime && listOfObject.length < listOfSpawnPoint.length) {
    objectGenerator()
    timer = 0
  } else {
    timer += 1000
  }
}, 1000)

const objectGenerator = () => {
  const randomNum = Math.floor(Math.random() * listOfSpawnPoint.length);
  listOfObject.push(new NeutralObject({
    id: listOfObject.length + 1,
    x: listOfSpawnPoint[randomNum][0],
    y: listOfSpawnPoint[randomNum][1],
    type: 'heal'
  }))
  if (server?.sockets) {
    server.sockets.emit("updateNeutralObject", listOfObject)
  }
}

module.exports.getNeutralObject = (socket, players, io) => {
  server = io

  socket.on("getNeutralObject", ({ object, playerID }) => {
    players[playerID].takeHeal()
    listOfObject.forEach((item, index) => {
      if (item._id === object._id) {
        item.delete(index)
      }
    })
  });
}


