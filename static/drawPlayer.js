const trooperImage = document.getElementById('js-trooper-img');

const drawPlayer = (ctx, player) => {
  const playerX = player.positionX;
  const playerY = player.positionY;
  const playerAngle = player.angle;
  const rad = Math.PI / 180;
  const percentHP = player.HP / physic.maxHP;

  // name
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${player._name}`, playerX, playerY - physic.m * 1.2);
  ctx.closePath();

  // healBar
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    playerX - physic.m * 1,
    playerY - physic.m * 1,
    physic.m * 2,
    physic.m / 6
  );
  ctx.fillStyle = percentHP > 0.3 ? '#0ed00e' : 'red';
  ctx.fillRect(
    playerX - physic.m * 1,
    playerY - physic.m * 1,
    physic.m * 2 * (player.HP / physic.maxHP),
    physic.m / 6
  );

  ctx.save();
  ctx.translate(playerX, playerY);
  ctx.rotate((playerAngle + 270) * rad);
  ctx.drawImage(trooperImage, -35, -35, 70, 70);
  ctx.restore();

  effects.damage.forEach((el) => {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${el.damage}`, el.x, el.y);
    ctx.closePath();
  });
};
