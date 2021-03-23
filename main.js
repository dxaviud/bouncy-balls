// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function Ball(x, y, velX, velY, color, radius) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.radius = radius;
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
    if ((this.x + this.radius) >= width) {
        this.velX *= -1;
    }

    if ((this.x - this.radius) <= 0) {
        this.velX *= -1;
    }

    if ((this.y + this.radius) >= height) {
        this.velY *= -1;
    }

    if ((this.y - this.radius) <= 0) {
        this.velY *= -1;
    }

    this.x += this.velX;
    this.y += this.velY;
}

let balls = [];

while (balls.length < 25) {
    let radius = random(10, 20);
    let ball = new Ball(
        random(0 + radius, width - radius),
        random(0 + radius, height - radius),
        random(-7, 7),
        random(-7, 7),
        `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0,255)})`,
        radius
    );

    balls.push(ball);
}

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
    }

    requestAnimationFrame(loop);
}

loop();