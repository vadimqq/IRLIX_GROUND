
const movement = {
  up: false,
  down: false,
  left: false,
  right: false,
}

document.addEventListener("keydown", (event) => {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      // checkColisionDirection('RIGHT')
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

setInterval(() => {
  socket.emit("movement", movement);
}, 1000 / 60);

// const checkColisionDirection = (direction) => {
//   switch (direction) {
//     case 'RIGHT':
//       levelLocation.array.forEach(element => {
//         if (getColision(PLAYER, element)) {
//           return 'kek'
//         }
//       });
//       break;
//     case 'LEFT':

//       break;
//     case 'DOWN':

//       break;
//     case 'UP':

//       break;
//     default:
//       return false
//   }
// }

// const getWallColision = (player, object) => {
//   const r = player._playerRadius + physic.m
//   const dX = player.positionX - object.positionX
//   const dY = player.positionY - object.positionY
//   const x2 = dX * dX
//   const y2 = dY * dY
//   const d2 = x2 + y2
//   const d = Math.sqrt(d2)

//   return r > d
// }
