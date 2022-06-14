// const socket = io();
const statNode = document.getElementById('js-ui');
const listNode = document.getElementById('js-ui-li');

const gamerName = {
    name: '',
}

let form = document.getElementById('js-change-name-form');
form.onsubmit = (event) => {
    event.preventDefault();
    socket.emit('new player', event.target[0].value);
}

const renderStats = (data) => {
    listNode.innerHTML = '';
    data.forEach(el => {
        const child = document.createElement('li')
        child.innerHTML = `<b>${el.name}</b> ${el.kill} / ${el.death} `
        listNode.appendChild(child);
    });
}

document.addEventListener("keydown", (event) => {

    if (event.keyCode === 9) {
        event.preventDefault();
        if (!event.repeat) {
            statNode.style.display = 'block';
            socket.emit("getStatistic");
        }
    }
});

document.addEventListener("keyup", (event) => {
    //убираем поле статистики
    statNode.style.display = 'none';
});

