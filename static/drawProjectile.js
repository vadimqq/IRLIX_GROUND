

const drawProjectile = (ctx, bullet) => {
  const x = bullet.positionX;
  const y = bullet.positionY;

  ctx.fillStyle = bullet.color;
  ctx.beginPath();
  ctx.arc(x, y, bullet._BulletRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}
