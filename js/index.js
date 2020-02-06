//? GRAPH SETUP
let graphElm = document.querySelector("#graph");
graphElm.height = document.querySelector("#graphContainer").offsetHeight;
graphElm.width = document.querySelector("#graphContainer").offsetWidth;
let graph_x = 0;
let graph_y = graphElm.height / 2;
let graph = graphElm.getContext("2d");

let speaker = document.getElementById("speaker")

let marketPrice;
let capPrice = 10000;
let playing = false;
let money = 10000;
let shares = 0;
let level = 1;
let callRequest = false;
let putRequest = false;
let speed = 10;

function start() {
    playing = true;
    loop();
}
function stop() {
    playing = false;
}

function random(min, max) {
    return Math.round((Math.random() * (max - min)) - min);
}

function updateGraph() {
    let old_x = graph_x;
    let old_y = graph_y;

    if (random(0, 1)) graph_y -= random(0, 10);
    else graph_y += random(0, 10);
    graph_x += 2;

    if (graph_y <= 0) graph_y = 0
    if (graph_y >= graphElm.height) graph_y = graphElm.height


    if (callRequest) {
        callRequest = false;

        graph.beginPath();
        graph.strokeStyle = "steelblue";
        graph.moveTo(graph_x, 0);
        graph.lineTo(graph_x, graphElm.height);
        graph.stroke();

    }
    if (putRequest) {
        putRequest = false;

        graph.beginPath();
        graph.strokeStyle = "crimson";
        graph.moveTo(graph_x, 0);
        graph.lineTo(graph_x, graphElm.height);
        graph.stroke();

    }

    graph.beginPath();
    graph.moveTo(old_x, old_y);
    graph.strokeStyle = "lime";
    graph.lineWidth = 2;
    graph.lineTo(graph_x, graph_y);
    graph.stroke();

}

function loop() {
    marketPrice = Number(((capPrice * (1 - (graph_y / graphElm.height)))).toFixed(2));

    setTimeout(() => {
        if (graph_x >= graphElm.width) {
            nextLevel();
            return;
        }
        updateGraph();
        if (playing) loop();
    }, speed)

}

function buy() {
    if (!playing) return;
    if (money - marketPrice <= 0) return
    shares++;
    money = Number((money - marketPrice).toFixed(2))
    callRequest = true;

    speaker.src = "./media/buy.m4a";
    speaker.play();
}

function sell() {
    if (!playing) return;
    if (shares == 0) return
    shares--;
    money = Number((money + marketPrice).toFixed(2));
    putRequest = true;

    speaker.src = "./media/sell.m4a";
    speaker.play();
}

function gameOver() {
    if (!localStorage.getItem("max")) {
        localStorage.setItem("max", money)
    } else {
        if (Number(localStorage.max) < money) {
            localStorage.setItem("max", money)
        }
    }

    document.querySelector(".max").innerText = localStorage.max
    popup();
}
function popup() {
    document.querySelector("#popup").classList.toggle("show")
}

function nextLevel() {
    level++;
    speed--;
    if (level >= 10) {
        gameOver();
        return
    }
    graph_x = 0;
    graph.clearRect(0, 0, graphElm.width, graphElm.height);
    start();
}

function updateDisplay() {
    const displayElms = ["marketPrice", "shares", "money", "level"]

    displayElms.forEach(name => {
        document.querySelectorAll(`.${name}`).forEach(elm => {
            elm.innerText = eval(name);
        })
    })
}

function reset() {
    popup();
    level = 0;
    money = 10000;
    shares = 0;
    speed = 10;
    start();
}

//linear logic

setInterval(() => {
    updateDisplay();
}, 100)

//keyboard events

document.onkeypress = (e) => {
    switch (e.key) {
        case "b":
            buy();
            break;
        case "s":
            sell();
            break;
    }
}