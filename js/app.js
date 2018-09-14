//const variables
const   playerStart_X = 200,
        playerStart_Y = 450;
//let variables
var     score = 0,
        upCount = 0,
        timerReading = false,
        timer,
        timerTagElement = document.querySelector("#timerData"),
        restartButton = document.querySelector("#restart"),
        modal = document.querySelector(".modal"),
        modalButton = document.querySelector("#play-again"),
        earnings = document.querySelector("#earnings");

//starts game after the page querySelectorfi#nishes loading
window.onload = function() {
    document.querySelector("#scoreData").innerHTML = score;
};

//restart Game here using the modal button
modalButton.addEventListener("click", function () {
    // Hide the modal
    modal.style.top = "-200%";
    restartGame();
});
//restart Game here using the game restart icon
restartButton.addEventListener("click", restartGame);

//function to restart Game here
function restartGame() {
        player.reset();
        score = 0;
        document.querySelector("#scoreData").innerHTML = score;
        upCount = 0;
        timerReading = false;
        clearTimeout(timer);
        timerTagElement.innerHTML = "--";      
    }

// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we"ve provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we"ve provided to easily load images
    this.sprite = "images/enemy-bug.png";
    //Set intiale location for enemy
    this.x = x;
    this.y = y;
    //Using Math.random() to speed bugs randomly 
    this.speed = Math.floor((Math.random() * 500) + 100);
};

// Update the enemy"s position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= 505) { //Canvas width 505
        this.x += this.speed * dt;
    }
    else {
        this.x = -100;
    }
    this.checkCollisions();
};

//For detect the collisions
Enemy.prototype.checkCollisions = function(){
    //To reset the player whenever hits the bugs
    if ((this.x - 40 <= player.x &&  this.x + 40 >= player.x) && (this.y - 40 <= player.y && this.y + 40 >= player.y)){
        if (score > 0) {
            //decrease the player score 
            score--;
            //update score
            document.querySelector("#scoreData").innerHTML = score;
        }
        player.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    //Check the chracter has chosen by the user
    //Set the image for the player
    this.sprite = "images/char-boy.png";
    //Set intiale location for the player
    this.x = playerStart_X;
    this.y = playerStart_Y;
};

// Update the player"s position, required method for game
Player.prototype.update = function () {
    if (this.y < 40) {
        //increase the player score if at the water level
        score++;
        //update score
        document.querySelector("#scoreData").innerHTML = score; 
        //reset the player if at the water level
        this.reset();
    }
}

/*
    Function to count down the timer, when it reaches 0 time is done !
*/
function countDown(seconds){
    timerTagElement.innerHTML = seconds;
    //Game over case
    if (seconds == 0 && score < 10){ //If the score less than 10, the player lose
        timerTagElement.innerHTML = "You ran out of time but you can do better"; //time is done
        gameOver();
    }
    //Still the timer is running
    if (seconds > 0){ 
        seconds--;
        timer = setTimeout(`countDown (${seconds})`,1000);//Decrease one in a second
    }
    //Winning case
    if (seconds == 0 && score >= 10){ //If the score greater than 10, the player win
        timerTagElement.innerHTML = "Congratulations... You Won!!!"; //the player win
        gameOver();
    }
};

//game over message here
function gameOver() {
    //display the modal
    modal.style.top = "0";
    //add score
    earnings.innerHTML = `$${score}`;
    // get final game message
    var status = document.querySelector("#status");
    if(score < 10){
        status.innerHTML = "You ran out of time but you can do better";
    }else{
        status.innerHTML = "Congratulations... You Won!!!";
    }
}

//To reset the player to its starting point 
Player.prototype.reset = function(){
    this.x = playerStart_X;
    this.y = playerStart_Y;
};

//moves the player around the game board
Player.prototype.handleInput = function (input) {
    //handle left arrow
    if (input == "left" && this.x > 0) {
        this.x -= 100;
    }
    //handle right arrow
    if (input == "right" && this.x < 400) {
        this.x += 100;
    }
    //handle up arrow
    if (input == "up" && this.y > 0) {
        upCount++;
        timerReading = true;
        if (upCount === 1 && timerReading) {
            countDown(60); 
        }
        this.y -= 100;
    }
    //handle down arrow
    if (input == "down" && this.y < 400) {
        this.y += 100;
    }
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
var enemy1 = new Enemy(-100, 220);
var enemy2 = new Enemy(-150, 140);
var enemy3 = new Enemy(-230, 60);
var enemy4 = new Enemy(-290, 140);

// Place all enemy objects in an array called allEnemies
var allEnemies = [enemy1, enemy2, enemy3, enemy4];
// Place the player object in a variable called player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don"t need to modify this.
document.addEventListener("keyup", function(e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
