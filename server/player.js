const physic = require("./constants").physic;
const map = require("./constants").map;
const colors = require("./constants").colors;
const levelLocation = require("./constants").levelLocation;
const playerState = require("./constants").playerState;

const players = {};

let server = null

function getCollisionWall(point) {
  for (const iterator of levelLocation.walls) {
    if (iterator[0] === point[0] && iterator[1] === point[1]) {
      return false;
    }
  }
  return true;
}

class Player {
  constructor(props) {
    // inits
    this._name = props.name;
    this._id = props.id;
    this._playerRadius = physic.m / 2;
    this._color = colors[props.index];

    // temp
    this.TempX = 300;
    this.TempY = 300;

    // gamaplay
    this.positionX = 300;
    this.positionY = 300;
    this.HP = physic.maxHP;
    this.angle = 0;
    this.state = playerState.IDLE;
    this.killCounter = 0;
    this.deathCounter = 0
    this.damage = physic.baseDamage;
  }

  takeDamage(fromId, dmg) {
    let kill = false;
    this.HP -= dmg;

    if (this.HP <= 0) {
      this.death();
      this.giveKill(fromId);
      kill = true;
    } else {
      kill = false;
    }

    server.sockets.emit("playerTakeDamage", {
      from: fromId,
      to: this._id,
      kill: kill,
      damage: dmg,
      x: this.positionX,
      y: this.positionY,
    })
  }

  addKillCounter() {
    this.killCounter += 1
  }

  giveKill(id) {
    players[id].addKillCounter()
  }

  takeHeal() {
    this.HP = physic.maxHP;
  }

  death() {
    // this.state = playerState.DEATH;
    this.deathCounter += 1
    this.respawn()
  }

  respawn() {
    const randomNum = Math.floor(Math.random() * 4);
    this.positionX = map.respawnPoint[randomNum][0];
    this.positionY = map.respawnPoint[randomNum][1];
    this.TempX = map.respawnPoint[randomNum][0];
    this.TempY = map.respawnPoint[randomNum][1];
    this.HP = physic.maxHP;
  }

  moveTo(direction) {
    switch (direction) {
      case 'left':
        this.state = playerState.MOVE
        this.TempX = this.positionX - physic.v;
        break;
      case 'up':
        this.state = playerState.MOVE
        this.TempY = this.positionY - physic.v;
        break;
      case 'right':
        this.state = playerState.MOVE
        this.TempX = this.positionX + physic.v;
        break;
      case 'down':
        this.state = playerState.MOVE
        this.TempY = this.positionY + physic.v;
        break;

      default:
        this.state = playerState.IDLE
        break;
    }

    const _x = Math.floor(this.TempX / physic.m);
    const _y = Math.floor(this.TempY / physic.m);

    if (getCollisionWall([_x, _y])) {
      this.positionX = this.TempX;
      this.positionY = this.TempY;
    } else {
      this.TempX = this.positionX;
      this.TempY = this.positionY;
    }
  }
}

module.exports.getPlayers = (socket, io) => {
  server = io
  socket.on("new player", (name) => {
    players[socket.id] = new Player({
      id: socket.id,
      name: name,
      index: Object.keys(players).length,
    })
  });

  socket.on("movement", (move) => {
    const player = players[socket.id] || {};
    if (move.left && player.positionX > 0) {
      player.moveTo('left');
    }
    if (move.up && player.positionY > 0) {
      player.moveTo('up');
    }
    if (move.right && player.positionX < map.size.x) {
      player.moveTo('right');
    }
    if (move.down && player.positionY < map.size.y) {
      player.moveTo('down');
    }
  });

  socket.on("mouseMove", (mousePosition) => {
    const player = players[socket.id] || {};
    player.angle = Math.round(Math.atan2(player.positionY - mousePosition.y, player.positionX - mousePosition.x) * (180 / Math.PI));
    // player.angle = Math.acos( getAngle(player.positionX, player.positionY, mousePosition.x, mousePosition.y).cos );
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  })

  // socket.on("changeName", (name) => {
  //   players[socket.id]._name = name;
  // })

  return players;
}
