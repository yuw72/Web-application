
// this makes the browser catch a LOT more runtime errors. leave it here!
"use strict";

// arr.removeItem(obj) finds and removes obj from arr.
Array.prototype.removeItem = function (item) {
    let i = this.indexOf(item);

    if (i > -1) {
        this.splice(i, 1);
        return true;
    }

    return false;
};

// gets a random int in the range [min, max) (lower bound inclusive, upper bound exclusive)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// ------------------------------------------------------------------------------------
// Add your code below!
// ------------------------------------------------------------------------------------

// constants for you.
const IMG_W = 120;    // width of the mosquito image
const IMG_H = 88;     // height of the mosquito image
const SCREEN_W = 640; // width of the playfield area
const SCREEN_H = 480; // height of the playfield area

// global variables. add more here as you need them.
let kills = 0;
let misses = 0;
let points = 0;
let round = 1;
let mosAll = 15;
let mos_arr = [];

function mos(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.img = document.createElement('img');
    this.img.src = 'mosquito.png';
    document.getElementById('playfield').appendChild(this.img);
    this.img.mos = this;
    this.img.onmousedown = function (event) {
        event.target.parentNode.removeChild(event.target);
        mos_arr.removeItem(event.target.mos);
        kills +=1 ;
        points +=100;
    }
}



window.onload = function () {
    // here is where you put setup code.
    // this way, we can write gameMessage.innerHTML or whatever in your code.
    let gameMessage = document.getElementById('gameMessage');
    gameMessage.onclick = startGame;

    // give it the name of the function to call.
    // requestAnimationFrame(gameLoop);
};

function updateDisplay() {
    let left = 10 - kills;
    document.getElementById('roundDisplay').innerHTML = round;
    document.getElementById('mosquitoDisplay').innerText = left.toString();
    document.getElementById('missesDisplay').innerText = misses;
    document.getElementById('scoreDisplay').innerText = points;
}

let timing = 0;

function startGame() {
    if (timing == 0) {
    startSpawning();
    }
    timing = 1;

    document.getElementById('gameMessage').style.display = 'none';
    requestAnimationFrame(gameLoop);
}

function gameLoop() {


    // 1. update the position of the mosquitoes
    // 2. update the score/misses/etc. displays
    // 3. check if the user won or lost



    updateMos();

    updateDisplay();

    if (kills == 10) {
        endRound();
    }
    if (misses == 5) {
        gameOver();
    }

    // this is sort of the "loop condition."
    // we call requestAnimationFrame again with gameLoop.
    // this isn't recursive; the browser will call us again
    // at some future point in time.

    if (!checkOver()) {
        requestAnimationFrame(gameLoop);
    }
}

function startSpawning() {
    // 1000 ms (1 second) from now, spawnMosquito() will be called.
    window.setTimeout(spawnMosquito, 1000)
}


function spawnMosquito() {
    // this is a "destructuring assignment."
    // it makes 4 local variables by extracting elements of the array that was returned.
    let [x, y, vx, vy] = pickPointAndVector();
    mos_arr.push(new mos(x, y, vx, vy));

    if (mos_arr.length < 14 && !checkOver()) {
        // spawn another one a second from now
        window.setTimeout(spawnMosquito, 1000)
    }

}

function updateMos() {
    //console.log(m.length);
    for (var m of mos_arr) {
        m.img.style.position = 'absolute';
        m.img.style.left = m.x + 'px';
        m.img.style.top = m.y + 'px';

        m.x += m.vx * 2;
        m.y += m.vy * 2;

        //console.log(m.img);
        if (m.x < -IMG_W - 1 || m.y < -IMG_H - 1 || m.x > SCREEN_W + IMG_W || m.y > SCREEN_H + IMG_H ) {
            document.getElementById('playfield').removeChild(m.img);
            console.log("disappear");
            console.log("mos num left is "+mos_arr.length);
            mos_arr.removeItem(m);
            misses += 1;
        }
    }

}


// given a side (0, 1, 2, 3 = T, R, B, L), returns a 2-item array containing the x and y
// coordinates of a point off the edge of the screen on that side.
function randomPointOnSide(side) {
    switch (side) {
        /* top    */
        case 0:
            return [getRandomInt(0, SCREEN_W - IMG_W), -IMG_H];
        /* right  */
        case 1:
            return [SCREEN_W, getRandomInt(0, SCREEN_H - IMG_H)];
        /* bottom */
        case 2:
            return [getRandomInt(0, SCREEN_W - IMG_W), SCREEN_H];
        /* left   */
        case 3:
            return [-IMG_W, getRandomInt(0, SCREEN_H - IMG_H)];
    }
}

// returns a 4-item array containing the x, y, x direction, and y direction of a mosquito.
// use it like:
// let [x, y, vx, vy] = pickPointAndVector()
// then you can multiply vx and vy by some number to change the speed.
function pickPointAndVector() {
    let side = getRandomInt(0, 4);                    // pick a side...
    let [x, y] = randomPointOnSide(side);             // pick where to place it...
    let [tx, ty] = randomPointOnSide((side + 2) % 4); // pick a point on the opposite side...
    let [dx, dy] = [tx - x, ty - y];                  // find the vector to that other point...
    let mag = Math.hypot(dx, dy);                     // and normalize it.
    let [vx, vy] = [(dx / mag), (dy / mag)];
    return [x, y, vx, vy];
}


// onmousedown = function (event) {
//
//         //console.log("click" +evt.x + "," + evt.y);
//         //m1.img.onmousedown(event.target);
//         // mos_arr.removeItem(m1);
//         // document.getElementById('playfield').removeChild(m.img);
//         // kills += 1;4
//         // event.button is 0 for the left mouse button.
//         // event.target is the DOM element that was clicked.
//         // how can you get the Mosquito object that represents this DOM element?
//         // well, you can put *your own properties* on DOM elements too...
//
//         // stops the event from bubbling up.
//         event.stopPropagation()
//
// }


function endRound() {
    round += 1;
    calePoint();
    kills = 0;
    misses = 0;
    nextRound();
}

function checkOver() {
    if (kills == 10) {
        endRound();
        return true;
    }
    if (misses == 5) {
        gameOver();
        return true;

    }
}


function calePoint() {
    let bonus = 1000 - (250 * misses);
    points = points + bonus;
    // console.log(points);
}

function gameOver() {
    //console.log("GameOver");

    for (var m of mos_arr) {
        document.getElementById('playfield').removeChild(m.img);
        mos_arr.removeItem(m);
    }

    document.getElementById('gameMessage').style = 'block';
    document.getElementById('gameMessage').innerHTML = "Game over, Click it";
    const list = document.getElementById("highScores");
    let add = document.getElementById('gameMessage');
    add.onclick = function () {
        points = 0;
        misses = 0;
        timing = 0;
        requestAnimationFrame(startGame);
    };

}

function nextRound() {
    // let gameMessage = document.getElementById('gameMessage').innerHTML = "Next round, Click it";
    // gameMessage.addEventListener("click", gameLoop);
}