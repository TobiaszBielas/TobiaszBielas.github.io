var bottomPlatform, leftPlatform;
// var myObstacle;
var myBall, mySecondBall;
var screen_width = window.screen.width/2, screen_height = window.screen.height/2;

function startGame() {
    bottomPlatform = new component(150, 20, "red", (screen_width-150)/2, screen_height - 20); //platformę na dole strony grubości 20 px
    leftPlatform = new component(20, 150, "pink", 0, (screen_height - 150)/2); 
    myBall = new ball(100, 100, 1, 1, "green", 10);
    mySecondBall = new ball(100, 100, 2, 2, "blue", 10);
    //myObstacle  = new component(10, 200, "green", 300, 120);    
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = screen_width;
        this.canvas.height = screen_height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    }, 
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;   

    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }

    this.crashWithEdge = function() {
        if (this.x < 0) {
            this.speedX *= -1;
            this.x += 20;
            this.speedX = 0;
        }
        if (this.x + this.width > screen_width) {
            this.speedX *= -1;
            this.x -= 20;
            this.speedX = 0;
        }
        if (this.y < 0) {
            this.speedY *= -1;
            this.y += 20;
            this.speedY = 0;
        }
        if (this.y + this.height > screen_height) {
            this.speedY *= -1;
            this.y -= 20;
            this.speedY = 0;
        }
        
    }    
}

function ball(x, y, speed_x, speed_y, color, size){
    this.x = x;
    this.y = y;
    this.speed_x = speed_x;
    this.speed_y = speed_y;
    this.size = size;
    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    this.newPos = function() {
        this.x += this.speed_x;
        this.y += this.speed_y;        
    }

    this.crashWithEdge = function() {
        var ball_y = this.y;
        var ball_x = this.x; 

        if (ball_y < 0 + this.size) {
            this.speed_y *= -1;
        }
        
        if (ball_x > screen_width - this.size) {
            this.speed_x *= -1;
        }

        if(ball_y >= screen_height - this.size || ball_x <= 0 + this.size) {
            myGameArea.stop();
        }
    }

    this.crashWithPlatform = function(component){
        var ball_y = this.y;
        var ball_x = this.x;

        if (ball_y > component.y - this.size && ball_x >= component.x && ball_x <= component.x + component.width) {
            this.speed_y *= -1
        }
        else if (ball_x - this.size < component.x + component.width && ball_y >= component.y && ball_y <= component.y + component.height) {
            this.speed_x *= -1

        }
    }
}

function movement(){
    if (myGameArea.key && myGameArea.key == 37) {
        bottomPlatform.speedX = -8; 
        bottomPlatform.newPos(); 
        bottomPlatform.speedX = 0;
    }
    if (myGameArea.key && myGameArea.key == 39) {
        bottomPlatform.speedX = 8;  
        bottomPlatform.newPos(); 
        bottomPlatform.speedX = 0;
    }
    
    if (myGameArea.key && myGameArea.key == 38) {
        leftPlatform.speedY = -8; 
        leftPlatform.newPos(); 
        leftPlatform.speedY = 0;
    }
    if (myGameArea.key && myGameArea.key == 40) {
        leftPlatform.speedY = 8;  
        leftPlatform.newPos(); 
        leftPlatform.speedY = 0;
    }
}

function updateGameArea() {
    myGameArea.clear();  
    movement(); 

    bottomPlatform.newPos();    
    bottomPlatform.update();
    bottomPlatform.crashWithEdge();
    
    leftPlatform.newPos();    
    leftPlatform.update();
    leftPlatform.crashWithEdge();
    //myObstacle.update();
    
    myBall.crashWithEdge();
    myBall.crashWithPlatform(bottomPlatform);
    myBall.crashWithPlatform(leftPlatform);
    myBall.newPos();
    myBall.update();

    mySecondBall.crashWithEdge();
    mySecondBall.crashWithPlatform(bottomPlatform);
    mySecondBall.crashWithPlatform(leftPlatform);
    mySecondBall.newPos();
    mySecondBall.update();
}

function moveup() {
    leftPlatform.speedY = -8; 
}

function movedown() {
    leftPlatform.speedY = 8; 
}

function moveleft() {
    bottomPlatform.speedX = -8; 
}

function moveright() {
    bottomPlatform.speedX = 8; 
}

function clearmove() {
    bottomPlatform.speedX = 0; 
    bottomPlatform.speedY = 0;
    leftPlatform.speedX = 0; 
    leftPlatform.speedY = 0; 
}