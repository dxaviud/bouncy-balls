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

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, radius) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.radius = radius;
}

Ball.prototype = Object.create(Shape.prototype);

Object.defineProperty(Ball.prototype, 'constructor', {
    value: Ball,
    enumerable: false,
    writable: true
});

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

Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j]) && balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + balls[j].radius) {
                balls[j].color = this.color = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
                // this.velX *= -1;
                // this.velY *= -1;
                // balls[j].velX *= -1;
                // balls[j].velY *= -1;
            }
        }

    }
}

function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'white';
    this.radius = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);

Object.defineProperty(EvilCircle.prototype, 'constructor', {
    value: EvilCircle,
    enumerable: false,
    writable: true
});

EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.radius) >= width) {
        this.x -= this.radius;
    }

    if ((this.x - this.radius) <= 0) {
        this.x += this.radius;
    }

    if ((this.y + this.radius) >= height) {
        this.y -= this.radius;
    }

    if ((this.y - this.radius) <= 0) {
        this.y += this.radius;
    }

    // this.x += this.velX;
    // this.y += this.velY;
}

EvilCircle.prototype.setControls = function() {
    let _this = this;
    window.onkeydown = function(e) {
        if (e.key === 'a') {
            _this.x -= _this.velX;
            
        } else if (e.key === 'd') {
            _this.x += _this.velX;

        } else if (e.key === 'w') {
            _this.y -= _this.velY;

        } else if (e.key === 's') {
            _this.y += _this.velY;

        }
    }
}

EvilCircle.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + balls[j].radius) {
                balls[j].exists = false;
            }
        }

    }
}

let balls = [];

while (balls.length < 25) {
    let radius = random(10, 20);
    let ball = new Ball(
        random(0 + radius, width - radius),
        random(0 + radius, height - radius),
        random(-7, 7),
        random(-7, 7),
        true,
        `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0,255)})`,
        radius
    );

    balls.push(ball);
}

const evilCircle = new EvilCircle(
    random(0 + 10, width - 10),
    random(0 + 10, height - 10), 
    true
);
evilCircle.setControls();

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }

    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

    requestAnimationFrame(loop);
}

loop();