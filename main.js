var bottomPlatform, leftPlatform;
// var myObstacle;
var myBall, mySecondBall;
var screen_width = window.screen.width/2, screen_height = window.screen.height/2;
var blocks = [];
var points = 0;
var leftPlatformVisibility = false;
var pauseGameCheck = 0;
var isPaused = false;
function rand(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function startGame() {
    for(i = 0; i < 10; ++i) {
        for(j = 0; j < 3; ++j) {
            var block_width = (screen_width-25)/10;
            blocks.push(new component(block_width - 2, 20, "gray", 1 + block_width * i + 20, 22 * j+5));
        }
    }
    bottomPlatform = new component(rand(80, screen_width/2), 20, "red", 50, screen_height - 20); //platformę na dole strony grubości 20 px
    leftPlatform = new component(20, rand(80, screen_height/2), "pink", 0, 50); 
    myBall = new ball(rand(50, screen_width-50), rand(80, screen_height/2), rand(1,3), rand(1,3), "green", 10);
    mySecondBall = new ball(rand(50, screen_width-50), rand(80, screen_height/2), rand(1,3), rand(1,3), "blue", 10);
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
        leftPlatformVisibility = leftPlatformVisibility;
    }
}

function component(width, height, color, x=0, y=0, visibility=true) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.visibility = visibility;
    this.color = color;   

    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }

    this.crashWithPlatform = function(component) {
        if(this.x <= component.x + component.width && this.y <= component.y + component.height && this.height < this.width){
            this.x = 20
            this.speedX = 0;
        }
        if(this.y + this.height >= component.y && this.x + this.width >= component.x && this.height > this.width) {
            this.y = screen_height - 20 - this.height;
            this.speedY = 0;
        }
    }

    this.crashWithEdge = function() {
        if (this.x < 0) {
            this.x += 10;
            this.speedX = 0;
        }
        if (this.x + this.width > screen_width) {
            this.x -= 10;
            this.speedX = 0;
        }
        if (this.y < 0) {
            this.y += 10;
            this.speedY = 0;
        }
        if (this.y + this.height > screen_height) {
            this.y -= 10;
            this.speedY = 0;
        }   
    }

    this.deleteBlock = function() {
        this.visibility = false;
        this.color = "red";
        points += 1;
        this.update();
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
        var ball_y_up = this.y  - this.size;
        var ball_y_down = this.y  + this.size;
        var ball_x_left = this.x  - this.size;
        var ball_x_right = this.x  + this.size;
        var ball_x = this.x;
        var ball_y = this.y;
        
        if (ball_y_up < 0 ) {
            if((ball_x >= 0 && ball_x < screen_width*0.1) || (ball_x <= screen_width && ball_x > screen_width*0.9)){
                if(this.speed_x > 0)
                    this.speed_x = 3;
                else
                    this.speed_x = -3;
                this.speed_y *= -1;
                }
            if((ball_x < screen_width*0.3 && ball_x >= screen_width*0.1) || (ball_x > screen_width*0.7  && ball_x <= screen_width*0.9)){
                if(this.speed_x > 0)
                    this.speed_x = 2;
                else
                    this.speed_x = -2;
                this.speed_y *= -1;
                }
            if((ball_x >= screen_width*0.3 && ball_x < screen_width*0.4) || (ball_x <= screen_width*0.7  && ball_x > screen_width*0.6)){
                if(this.speed_x > 0)
                    this.speed_x = 1.5;
                else
                    this.speed_x = -1.5;
                this.speed_y *= -1;
                }
            if(ball_x >= screen_width*0.4 && ball_x <= screen_width*0.6){
                if(this.speed_x > 0)
                    this.speed_x = 1;
                else
                    this.speed_x = -1;
                this.speed_y *= -1;
                }
        }
        
        if (ball_x_right > screen_width) {
            if((ball_y >= 0 && ball_y < screen_height*0.1) || 
                (ball_y > screen_height*0.9 && ball_y <= screen_height)){
                if(this.speed_y < 0)
                    this.speed_y = -3;
                else
                    this.speed_y = 3;
                this.speed_x *= -1;
            }
            else if((ball_y < screen_height*0.3 && ball_y >= screen_height*0.1) || 
                    (ball_y <= screen_height*0.9 && ball_y > screen_height*0.7)){
                    if(this.speed_y < 0)
                        this.speed_y = -2;
                    else
                        this.speed_y = 2;
                    this.speed_x *= -1;
            }
            else if((ball_y >= screen_height*0.3 && ball_y < screen_height*0.4) || 
                    (ball_y > screen_height*0.6 && ball_y <= screen_height*0.7)){
                    if(this.speed_y < 0)
                        this.speed_y = -1.5;
                    else
                        this.speed_y = 1.5;
                    this.speed_x *= -1;
                    }
            else if(ball_y >= screen_height*0.4 && ball_y <= screen_height*0.6){
                if(this.speed_y < 0)
                    this.speed_y = -1;
                else
                    this.speed_y = 1;
                this.speed_x *= -1;
            }
        }

        if(leftPlatformVisibility){
            if(ball_y_down >= screen_height || ball_x_left <= 0) {
                myGameArea.stop();
                alert("GAME OVER\nPoints: " + points);
            }
        }else {
            if(ball_y_down >= screen_height) {
                myGameArea.stop();
                alert("GAME OVER\nPoints: " + points);
            }else if (ball_x_left <= 0) {
                if((ball_y >= 0 && ball_y < screen_height*0.1) || 
                    (ball_y > screen_height*0.9 && ball_y <= screen_height)){
                    if(this.speed_y < 0)
                        this.speed_y = -3;
                    else
                        this.speed_y = 3;
                    this.speed_x *= -1;
                }
                else if((ball_y < screen_height*0.3 && ball_y >= screen_height*0.1) || 
                        (ball_y <= screen_height*0.9 && ball_y > screen_height*0.7)){
                        if(this.speed_y < 0)
                            this.speed_y = -2;
                        else
                            this.speed_y = 2;
                        this.speed_x *= -1;
                }
                else if((ball_y >= screen_height*0.3 && ball_y < screen_height*0.4) || 
                        (ball_y > screen_height*0.6 && ball_y <= screen_height*0.7)){
                        if(this.speed_y < 0)
                            this.speed_y = -1.5;
                        else
                            this.speed_y = 1.5;
                        this.speed_x *= -1;
                        }
                else if(ball_y >= screen_height*0.4 && ball_y <= screen_height*0.6){
                    if(this.speed_y < 0)
                        this.speed_y = -1;
                    else
                        this.speed_y = 1;
                    this.speed_x *= -1;
                }
            }
        }
    }

    this.crashWithPlatform = function(component){
        var ball_x = this.x;
        var ball_x_left = this.x - this.size;
        var ball_y_down = this.y + this.size;
        var ball_y = this.y;

        if(ball_x_left < component.x + component.width){
            if((ball_y >= component.y && ball_y < component.y + component.height*0.1) || 
                (ball_y > component.y + component.height*0.9 && ball_y <= component.y + component.height)){
                if(this.speed_y < 0)
                    this.speed_y = -3;
                else
                    this.speed_y = 3;
                this.speed_x *= -1;
            }
            else if((ball_y < component.y + component.height*0.3 && ball_y >= component.y + component.height*0.1) || 
                    (ball_y <= component.y + component.height*0.9 && ball_y > component.y + component.height*0.7)){
                    if(this.speed_y < 0)
                        this.speed_y = -2;
                    else
                        this.speed_y = 2;
                    this.speed_x *= -1;
            }
            else if((ball_y >= component.y + component.height*0.3 && ball_y < component.y + component.height*0.4) || 
                    (ball_y > component.y + component.height*0.6 && ball_y <= component.y + component.height*0.7)){
                    if(this.speed_y < 0)
                        this.speed_y = -1.5;
                    else
                        this.speed_y = 1.5;
                    this.speed_x *= -1;
                    }
            else if(ball_y >= component.y + component.height*0.4 && ball_y <= component.y + component.height*0.6){
                if(this.speed_y < 0)
                    this.speed_y = -1;
                else
                    this.speed_y = 1;
                this.speed_x *= -1;
            }
        }
        if(ball_y_down >= component.y){
            if((ball_x >= component.x && ball_x < component.x + component.width*0.1) || 
                (ball_x > component.x + component.width * 0.9 && ball_x <= component.x + component.width)){
                if(this.speed_x > 0)
                    this.speed_x = 3;
                else
                    this.speed_x = -3;
                this.speed_y = Math.abs(this.speed_y)*-1;
            }
            else if((ball_x < component.x + component.width*0.3 && ball_x >= component.x + component.width*0.1) || 
                    (ball_x <= component.x + component.width*0.9 && ball_x > component.x + component.width*0.7)){
                    if(this.speed_x > 0)
                        this.speed_x = 2;
                    else
                        this.speed_x = -2;
                    this.speed_y = Math.abs(this.speed_y)*-1;
            }
            else if((ball_x >= component.x + component.width*0.3 && ball_x < component.x + component.width*0.4) || 
                    (ball_x > component.x + component.width*0.6 && ball_x <= component.x + component.width*0.7)){
                    if(this.speed_x > 0)
                        this.speed_x = 1.5;
                    else
                        this.speed_x = -1.5;
                    this.speed_y = Math.abs(this.speed_y)*-1;
            }
            else if(ball_x >= component.x + component.width*0.4 && ball_x <= component.x + component.width*0.6){
                if(this.speed_x > 0)
                    this.speed_x = 1;
                else
                    this.speed_x = -1;
                this.speed_y = Math.abs(this.speed_y)*-1;
            }
        }
        
    }

    this.crashWithBlocks = function(component) {
        var ball_y_up = this.y  - this.size/2;
        var ball_y_down = this.y  + this.size/2;
        var ball_x_left = this.x  - this.size/2;
        var ball_x_right = this.x  + this.size/2;
        var ball_x = this.x;
        var ball_y = this.y;

        if(component.visibility == true) {
            if(ball_y_down == component.y){
                if(ball_x <= component.x + component.width && ball_x >= component.x) {
                    component.deleteBlock();
                    // this.speed_x *= -1;
                    this.speed_y *= -1;
                    return true;
                }
            }
            else if(ball_x_left == component.x + component.width || ball_x_right == component.x) {
                if(ball_y <= component.y + component.height && ball_y >= component.y){
                    component.deleteBlock();
                    this.speed_x *= -1;
                    if((this.speed_y = rand(-2,2)) == 0)
                        this.speed_y = 1;
                    return true;
                }
            }
            else if(ball_y_up <= component.y + component.height){
                if(ball_x <= component.x + component.width && ball_x >= component.x) {
                    component.deleteBlock();
                    if((this.speed_x = rand(-4,4)) == 0)
                    this.speed_x = 2;
                    this.speed_y *= -1;
                    return true;
                }
            }
        }
        return false;
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
    if (myGameArea.key && myGameArea.key == 83 && isPaused == true) {
        myBall.speed_x = -2;
        myBall.speed_y = 2;
        mySecondBall.speed_x = 2;
        mySecondBall.speed_y = 2;
        isPaused = false;
    }
}

 function score(points){
    ctx = myGameArea.context;
    ctx.font = "30px Helvetica";
    ctx.fillText("Score: " + points, screen_width-150, screen_height);           
 }

function updateGameArea() {
    myGameArea.clear();
    if(isPaused){
        myBall.speed_x = 0;
        myBall.speed_y = 0;
        mySecondBall.speed_x = 0;
        mySecondBall.speed_y = 0;
        myBall.x = bottomPlatform.x + bottomPlatform.width / 3; 
        myBall.y = bottomPlatform.y;
        mySecondBall.x = bottomPlatform.x + bottomPlatform.width * 2/3;
        mySecondBall.y = bottomPlatform.y;
    }
    movement();
    score(points);
    if(leftPlatformVisibility){
        bottomPlatform.crashWithPlatform(leftPlatform);
        leftPlatform.crashWithPlatform(bottomPlatform);
        leftPlatform.newPos();    
        leftPlatform.update();
        leftPlatform.crashWithEdge();
        myBall.crashWithPlatform(leftPlatform);
        mySecondBall.crashWithPlatform(leftPlatform);
    }

    bottomPlatform.newPos();    
    bottomPlatform.update();
    bottomPlatform.crashWithEdge();
    //myObstacle.update();
    for(i = 0; i < blocks.length; ++i) {
        if(blocks[i].visibility){
            blocks[i].update();
        }
        myBall.crashWithBlocks(blocks[i]);
        mySecondBall.crashWithBlocks(blocks[i]);
    }
    myBall.crashWithEdge();
    myBall.crashWithPlatform(bottomPlatform);
    myBall.newPos();
    myBall.update();

    mySecondBall.crashWithEdge();
    mySecondBall.crashWithPlatform(bottomPlatform);
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
function newGame() {
    myGameArea.stop();
    myGameArea.clear();
    points = 0;
    pauseGameCheck = 0;
    leftPlatformVisibility = leftPlatformVisibility;
    blocks = [];
    startGame();
}

function checkLeftPlatform() {
    if(leftPlatformVisibility)
        leftPlatformVisibility = false;
    else
        leftPlatformVisibility = true;
}

function pauseGame() {
    if(points >= 10 && pauseGameCheck < 3 && isPaused == false){
        pauseGameCheck += 1;
        isPaused = true;
    }
}