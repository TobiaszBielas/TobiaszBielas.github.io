var bottomPlatform, leftPlatform;
var blocks_quantity = 0;
var myBall, mySecondBall;
var screen_width = 640, screen_height = 480;
var blocks = [];
var points = 0, second_blocks=0;
var leftPlatformVisibility = false;
var pauseGameCheck = 0;
var isPaused = false;
var start_time = Date.now();
var bonusObject=[];
var points_bonus = 1;
var bonus_time_start=0, bonus_time_stop, active_bonus = false;
var left=37, right=39;
function rand(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function startFirstGame() {
    for(i = 0; i < 10; ++i) {
        for(j = 0; j < 3; ++j) {
            var block_width = 50, type=true, img_src = "img/block_1.png";
            if((i*j+j)%8 == 0) {
                type = false;
                img_src = "img/block_2.png";
            }
            blocks.push(new component(block_width, 20, img_src, 1 + block_width * i + 70, 22 * j+50, type));
        }
    }
    bottomPlatform = new component(128, 20, "img/platform.png", 50, screen_height - 20); //platformę na dole strony grubości 20 px
    leftPlatform = new component(20, rand(80, screen_height/2), "img/platform_2.png", 0, 50); 
    myBall = new ball(rand(20, screen_width-20), rand(130, screen_height/2), rand(1,3), rand(1,3), "green", 10);
    mySecondBall = new ball(rand(20, screen_width-20), rand(130, screen_height/2), rand(1,3), rand(1,3), "blue", 10, false);
    myGameArea.start_first();
}
function startSecondGame() {
    for(i = 0; i < 10; ++i) {
        for(j = 0; j < 3; ++j) {
            var block_width = 50, type=true, img_src = "img/block_1.png";
            if((i*j+j)%8 == 0) {
                type = false;
                img_src = "img/block_2.png";
            }
            blocks.push(new component(block_width, 20, img_src, 1 + block_width * i + 70, 22 * j+50, type));
        }
    }
    bottomPlatform = new component(128, 20, "img/platform.png", 50, screen_height - 20); //platformę na dole strony grubości 20 px
    leftPlatform = new component(20, rand(80, screen_height/2), "img/platform_2.png", 0, 50); 
    myBall = new ball(rand(20, screen_width-20), rand(130, screen_height/2), rand(1,3), rand(1,3), "green", 10);
    mySecondBall = new ball(rand(20, screen_width-20), rand(130, screen_height/2), rand(1,3), rand(1,3), "blue", 10, false);
    myGameArea.start_second();
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start_first : function() {
        this.canvas.width = screen_width;
        this.canvas.height = screen_height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameAreaFirst, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    start_second : function() {
        this.canvas.width = screen_width;
        this.canvas.height = screen_height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameAreaSecond, 20);
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

function component(width, height, img_src, x=0, y=0, type=true, visibility=true) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.visibility = visibility;
    this.image = new Image();
    this.image.src = img_src;
    this.type = type;

    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

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
    this.bonusCrashWithPlatform = function(platform) {
        if(this.x >= platform.x && this.x <= platform.x + platform.width)
            if(this.y + this.height >= platform.y){
                // bonus_time_start = Date.now();
                return true;
            }
        return false;
    }
    this.bonus = function(platform) {
        var check_bonus = rand(0,5);
        if(this.type && check_bonus <= 1 && !active_bonus) {
            platform.width *= 1.2;
            active_bonus = true;
            return true;
        }else if(this.type && check_bonus<=2 && !active_bonus) {
            platform.width *= 0.8;
            active_bonus = true;
            return true;
        }else if(this.type && check_bonus<=3 && !active_bonus) {
            points_bonus = 2;
            active_bonus = true;
            return true;
        }else if(this.type && check_bonus<=4 && !active_bonus) {
            points_bonus = 5;
            active_bonus = true;
            return true;
        }else if(this.type && check_bonus<=5 && !active_bonus) {
            active_bonus = true;
            left=39;
            right=37;
            return true;
        }
        return false;
    }
    
    this.deleteBlock = function() {
        if(!this.type)second_blocks+=1;
        this.visibility = false;
        points += 1 * points_bonus;
        blocks_quantity += 1;
        this.update();
    }
    this.showBlock = function() {
        if(!this.visibility){
            this.visibility = true;
            blocks_quantity -= 1;
            this.update();
        }
    }
}

function ball(x, y, speed_x, speed_y, color, size, type=true){
    this.x = x;
    this.y = y;
    this.speed_x = speed_x;
    this.speed_y = speed_y;
    this.size = size;
    this.type = type;

    this.path = function(){
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x -1*this.speed_x, this.y -1*this.speed_y, this.size, 0, Math.PI * 2);
        ctx.arc(this.x -1.5*this.speed_x, this.y -1.5*this.speed_y, this.size, 0, Math.PI * 2);
        ctx.arc(this.x -2*this.speed_x, this.y -2*this.speed_y, this.size, 0, Math.PI * 2);
        ctx.arc(this.x -2.5*this.speed_x, this.y -2.5*this.speed_y, this.size, 0, Math.PI * 2);
        ctx.arc(this.x -3*this.speed_x, this.y -3*this.speed_y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, .4)';
        ctx.fill();
    }
    this.update = function() {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    this.newPos = function() {
        this.x += this.speed_x;
        this.y += this.speed_y;        
    }

    this.crashWithBall = function(s_ball) {
        if((this.x + this.size >= s_ball.x - s_ball.size && this.x - this.size <= s_ball.x + s_ball.size) && (this.y + this.size >= s_ball.y && this.y - this.size <= s_ball.y)) {
            this.speed_x *= -1;
            this.speed_y *= -1;
            s_ball.speed_x *= -1;
            s_ball.speed_y *= -1;
        }
        if((this.y + this.size >= s_ball.y - s_ball.size && this.y - this.size <= s_ball.y + s_ball.size) && (this.x - this.size <= s_ball.x && this.x + this.size >= s_ball.x)) {
            this.speed_x *= -1;
            this.speed_y *= -1;
            s_ball.speed_x *= -1;
            s_ball.speed_y *= -1;
        }
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
            if((ball_y_down >= screen_height || ball_x_left <= 0)) {
                if(this.type){
                    myGameArea.stop();
                    alert("GAME OVER\nPoints: " + points);
                }else second_blocks = 0;
            }
        }else {
            if(ball_y_down >= screen_height) {
                if(this.type){
                    myGameArea.stop();
                    alert("GAME OVER\nPoints: " + points);
                }else second_blocks = 0;
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
        var ball_y_up = this.y  - this.size;
        var ball_y_down = this.y  + this.size;
        var ball_x_left = this.x  - this.size;
        var ball_x_right = this.x  + this.size;
        var ball_x = this.x;
        var ball_y = this.y;

        if(component.visibility == true) {
            if(ball_y_down >= component.y && ball_y_up <= component.y){
                if(ball_x <= component.x + component.width && ball_x >= component.x) {
                    component.deleteBlock();
                    // this.speed_x *= -1;
                    this.speed_y *= -1;
                    return true;
                }
            }
            else if((ball_x_left <= component.x + component.width && ball_x_right >= component.x + component.width) || (ball_x_right >= component.x && ball_x_left <= component.x)) {
                if(ball_y <= component.y + component.height && ball_y >= component.y){
                    component.deleteBlock();
                    this.speed_x *= -1;
                    // if((this.speed_y = rand(-2,2)) == 0)
                    //     this.speed_y = 1;
                    return true;
                }
            }
            else if(ball_y_up <= component.y + component.height && ball_y_down >= component.y + component.height){
                if(ball_x <= component.x + component.width && ball_x >= component.x) {
                    component.deleteBlock();
                    // if((this.speed_x = rand(-4,4)) == 0)
                    //     this.speed_x = 2;
                    this.speed_y *= -1;
                    return true;
                }
            }
        }
        return false;
    }
}

function movement(){
    if (myGameArea.key && myGameArea.key == left) {
        bottomPlatform.speedX = -8; 
        bottomPlatform.newPos(); 
        bottomPlatform.speedX = 0;
    }
    if (myGameArea.key && myGameArea.key == right) {
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
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillText("Score: " + points, screen_width/2-50, 25);           
 }
var bonus_on_screen = 0;
function updateGameAreaFirst() {
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

    bonus_time_stop = Date.now();
    bonus_time_stop = (bonus_time_stop-bonus_time_start);
    console.log(bonus_time_stop);
    if(bonus_time_stop >= 5000 && bonus_time_stop <= 6000) {
            console.log(bonus_time_stop);
        bonus_time_start = 0;
        bottomPlatform.width = 128;
        points_bonus = 1;
        left=37;
        right=39;
        active_bonus = false;
    }
    for(i = 0; i < blocks.length; ++i) {
        if(blocks[i].visibility){
            blocks[i].update();
        }

        if(blocks_quantity > 9 && blocks_quantity < 20) {
            x = Math.floor(Math.random() * 30);
            blocks[x].showBlock();
        }
        
        if(myBall.crashWithBlocks(blocks[i]) && blocks[i].type && rand(0,5)<= 1 && !active_bonus && bonus_time_stop > 5) {
            bonusObject[bonus_on_screen] = new component(20, 20, "img/bonus.png", blocks[i].x, blocks[i].y);
            bonusObject[bonus_on_screen].speedY = 3;
            bonus_on_screen += 1;
        }
        
        if(second_blocks>=5)
            
            if(mySecondBall.crashWithBlocks(blocks[i]) && blocks[i].type && 1<= 1 && !active_bonus && bonus_time_stop > 5) {
                bonusObject[bonus_on_screen] = new component(20, 20, "img/bonus.png", blocks[i].x, blocks[i].y);
                bonusObject[bonus_on_screen].speedY = 3;
                bonus_on_screen += 1;
            }
    }
    
    for(i=0; i<bonus_on_screen; ++i){
        if(bonusObject[i].visibility){
            bonusObject[i].newPos();
            bonusObject[i].update();
        }
        
        if(bonusObject[i].x > screen_height)
            bonusObject[i].visibility = false;
        
        if(bonusObject[i].bonusCrashWithPlatform(bottomPlatform)) {
            if(bonusObject[i].visibility){
                bonus_time_start = Date.now();;
                bonusObject[i].bonus(bottomPlatform)
                bonusObject[i].visibility = false;
            }
        }   
    }
    myBall.crashWithEdge();
    myBall.crashWithPlatform(bottomPlatform);
    // myBall.crashWithBall(mySecondBall);
    myBall.newPos();
    myBall.path();
    myBall.update();
    if(second_blocks==4){ 
        mySecondBall.x = rand(20, screen_width-20);
        mySecondBall.y = rand(130, screen_height/2);
    }
    if(second_blocks>=5){
        mySecondBall.crashWithEdge();
        mySecondBall.crashWithPlatform(bottomPlatform);
        mySecondBall.crashWithBall(myBall);
        mySecondBall.newPos();
        mySecondBall.path();
        mySecondBall.update();
    }

}
var time = 0, temporary=0;
function updateGameAreaSecond() {
    myGameArea.clear();
    var stop_time = Date.now();
    time = Math.floor((stop_time-start_time)/1000);
    if(time % 10 == 0 && time!=0){
        temporary += 1;
        // console.log(temporary);
    }        
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
    bonus_time_stop = Date.now();
    bonus_time_stop = (bonus_time_stop-bonus_time_start);
    console.log(bonus_time_stop);
    if(bonus_time_stop >= 5000 && bonus_time_stop <= 6000) {
            console.log(bonus_time_stop);
        bonus_time_start = 0;
        bottomPlatform.width = 128;
        points_bonus = 1;
        left=37;
        right=39;
        active_bonus = false;
    }
    var length = blocks.length;
    for(i = 0; i < length; ++i) {
        if(blocks[i].visibility){
            blocks[i].update();
        }
        ////////////////////////////////////////
        if((time % 20 == 0 || time == 10) && time!=0 && temporary%48 == 0 && length<100){
            var img_src = "img/block_1.png"
            var type = true;
            blocks[i].y += 20;
            if(i%2==0) {
                img_src = "img/block_2.png";
                type = false;
            }
            if(i<10 && time % 20 == 0) {
            // console.log("add")
            blocks.push(new component(50, 20, img_src, 1 + 50 * i + 70, 22+50, type));
            }
        }
        if(myBall.crashWithBlocks(blocks[i]) && blocks[i].type && 1<= 1 && !active_bonus && bonus_time_stop > 5) {
            bonusObject[bonus_on_screen] = new component(20, 20, "img/bonus.png", blocks[i].x, blocks[i].y);
            bonusObject[bonus_on_screen].speedY = 3;
            bonus_on_screen += 1;
        }
        
        if(second_blocks>=5)
            
            if(mySecondBall.crashWithBlocks(blocks[i]) && blocks[i].type && rand(0,5)<= 1 && !active_bonus && bonus_time_stop > 5) {
                bonusObject[bonus_on_screen] = new component(20, 20, "img/bonus.png", blocks[i].x, blocks[i].y);
                bonusObject[bonus_on_screen].speedY = 3;
                bonus_on_screen += 1;
            }
    }
       
    ///////////////////////////////////////////////
    myBall.crashWithEdge();
    myBall.crashWithPlatform(bottomPlatform);
    // myBall.crashWithBall(mySecondBall);
    myBall.newPos();
    myBall.path();
    myBall.update();
    if(second_blocks==4){ 
        mySecondBall.x = rand(20, screen_width-20);
        mySecondBall.y = rand(130, screen_height/2);
    }
    if(second_blocks>=5){
        mySecondBall.crashWithEdge();
        mySecondBall.crashWithPlatform(bottomPlatform);
        mySecondBall.crashWithBall(myBall);
        mySecondBall.newPos();
        mySecondBall.path();
        mySecondBall.update();
    }
    for(i=0; i<bonus_on_screen; ++i){
        if(bonusObject[i].visibility){
            bonusObject[i].newPos();
            bonusObject[i].update();
        }
        
        if(bonusObject[i].x > screen_height)
            bonusObject[i].visibility = false;
        
        if(bonusObject[i].bonusCrashWithPlatform(bottomPlatform)) {
            if(bonusObject[i].visibility){
                bonus_time_start = Date.now();;
                bonusObject[i].bonus(bottomPlatform)
                bonusObject[i].visibility = false;
            }
        }
    }
}


function newGameFirst() {
    myGameArea.stop();
    myGameArea.clear();
    points = 0;
    pauseGameCheck = 0;
    leftPlatformVisibility = false;
    blocks = [];
    startFirstGame();
}
function newGameSecond() {
    myGameArea.stop();
    myGameArea.clear();
    start_time = Date.now();
    points = 0;
    pauseGameCheck = 0;
    leftPlatformVisibility = false;
    blocks = [];
    startSecondGame();
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