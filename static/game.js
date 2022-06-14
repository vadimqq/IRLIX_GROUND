const socket = io();
const aidImage = document.getElementById('js-aid-img');
const wallImage = document.getElementById('js-wall-img');

const WINDOW_WIDTH = map.size.x;
const WINDOW_HIGHT = map.size.y;

const canvas = document.getElementById('canvas');
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HIGHT;
const context = canvas.getContext('2d');

const canvasBG = document.getElementById('canvas_bg');
canvasBG.width = WINDOW_WIDTH;
canvasBG.height = WINDOW_HIGHT;
const contextBG = canvasBG.getContext('2d');

let PLAYER = null
let NEUTRAL_OBJECT = null

function drawBGOnce(level) {
  contextBG.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HIGHT);
  contextBG.fillStyle = '#7c604a';
  level.walls.forEach((el) => {
    contextBG.drawImage(
      wallImage,
      el[0] * physic.m,
      el[1] * physic.m,
      physic.m,
      physic.m
    );
  });
}
setTimeout(() => {
  drawBGOnce(levelLocation);
}, 1000);

const checkNeutralObjectPosition = () => {
  if (NEUTRAL_OBJECT) {
    NEUTRAL_OBJECT.forEach((object) => {
      if (getColision(PLAYER, object)) {
        socket.emit("getNeutralObject", {
          playerID: PLAYER._id,
          object
        });
      }
    })
  }
}

const getColision = (player, object) => {
  const r = player._playerRadius + object._radius
  const dX = player.positionX - object.positionX
  const dY = player.positionY - object.positionY
  const x2 = dX * dX
  const y2 = dY * dY
  const d2 = x2 + y2
  const d = Math.sqrt(d2)

  return r > d
}



socket.on('state', (game) => {
  window.requestAnimationFrame(() => {
    PLAYER = game.players[socket.id];
    checkNeutralObjectPosition();
    context.fillStyle = 'black';
    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HIGHT);
    for (const id in game.players) {
      const player = game.players[id];
      drawPlayer(context, player);
    }

    game.projectile.forEach((projectile) => {
      drawProjectile(context, projectile);
    });
  })
});

socket.on('takeStatistic', (data) => {
  renderStats(data);
});

socket.on('playerTakeDamage', (damage) => {
  const myID = socket.id;

  effects.damage.push(damage);
  setTimeout(() => {
    effects.damage.shift();
  }, 1000);

  if (damage.from === myID) {
    if (damage.kill) {
      const myAudio = document.getElementById('js-damage');
      myAudio.currentTime = 0;
      myAudio.play();
      console.log('Я убил');
    } else {
      const myAudio = document.getElementById('js-pop');
      myAudio.currentTime = 0;
      myAudio.play();
      console.log('Я попал');
    }
  } else if (damage.to === myID) {
    if (damage.kill) {
      const myAudio = document.getElementById('js-dead');
      myAudio.currentTime = 0;
      myAudio.play();
      console.log('я умер');
    }
  }
});

socket.on('updateNeutralObject', (data) => {
  NEUTRAL_OBJECT = data
  drawBGOnce(levelLocation);
  data.forEach(el => {
    console.log(el)
    if (el._type === 'heal') {
      contextBG.drawImage(
        aidImage,
        el.positionX,
        el.positionY,
        el._radius,
        el._radius
      );
    }
  });
});
