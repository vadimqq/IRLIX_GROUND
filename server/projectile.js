// const takeDamage = require('./player').takeDamage
const physic = require("./constants").physic;
const map = require("./constants").map;
const colors = require("./constants").colors;
const levelLocation = require("./constants").levelLocation;

const listOfProjectile = [];

const _rad = Math.PI / 180;

function getCollisionWall(point) {
  for (const iterator of levelLocation.walls) {
    if (iterator[0] === point[0] && iterator[1] === point[1]) {
      return false;
    }
  }
  return true;
}

class Projectile {
  constructor(props) {
    this._id = props.id;
    this._BulletRadius = physic.m / 6;
    this._v = physic.bullet_v;
    this.color = props._color;
    this._initDamage = props.damage;

    // gamaplay
    this.positionX = props.x;
    this.positionY = props.y;
    this.angle = props.angle + 180;
    this.traveled = 0;
    this.players = props.players;
    this.damage = props.damage;
  }

  move() {
    this.TempX = this.positionX + this._v * Math.cos((this.angle) * _rad);
    this.TempY = this.positionY + this._v * Math.sin((this.angle) * _rad);
    this.traveled += this._v;
    this.damage = Math.floor(this._initDamage + ((this.traveled / physic.bullet_max_distance) * this._initDamage));

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

  remove(index) {
    listOfProjectile.splice(index, 1)
  }
}

module.exports.getProjectiles = (socket, players) => {
  socket.on("createProjectile", () => {
    listOfProjectile.push(new Projectile({
      id: socket.id,
      x: players[socket.id]?.positionX,
      y: players[socket.id]?.positionY,
      _color: players[socket.id]?._color,
      angle: players[socket.id]?.angle,
      damage: players[socket.id]?.damage,
      players: players,
    }))
  });

  return listOfProjectile;
}

setInterval(() => {
  if (listOfProjectile.length) {
    listOfProjectile.forEach((projectile, index) => {
      if (projectile.traveled > physic.bullet_max_distance) {
        projectile.remove(index)
      }

      //check colision
      for (const id in projectile.players) {

        //check X
        const checkX = projectile.players[id].positionX + projectile.players[id]._playerRadius > projectile.positionX && projectile.players[id].positionX - projectile.players[id]._playerRadius < projectile.positionX
        const checkY = projectile.players[id].positionY + projectile.players[id]._playerRadius > projectile.positionY && projectile.players[id].positionY - projectile.players[id]._playerRadius < projectile.positionY
        const checkPlayer = projectile._id !== projectile.players[id]._id

        if (checkX && checkY && checkPlayer) {
          projectile.players[id].takeDamage(projectile._id, projectile.damage)
          projectile.remove(index)
        }
      }

      projectile.move()

    })
  }
}, 1000 / 60)
