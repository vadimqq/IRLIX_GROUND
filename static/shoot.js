
let shoot = null

const click = () => {
  socket.emit("createProjectile");
  // console.log('event', event.clientX / physic.m);
  // console.log('event', event.clientY / physic.m);
  // shoot = setInterval(() => socket.emit("createProjectile"), 200)
}

document.addEventListener("mousedown", click)

document.removeEventListener("mouseup", click);
