

const mousePostion = {
  x: 0,
  y: 0,
}

canvas.addEventListener("mousemove", (event) => {
  mousePostion.x = event.x
  mousePostion.y = event.y
});

setInterval(() => {
  socket.emit("mouseMove", mousePostion);
}, 1000 / 60);
