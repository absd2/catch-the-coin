const game = {
    // GLOBAL VARIABLES.
    gameContainer: null,
    stopwatchContainer: null,
    scoreContainer: null,

    mapSize: null,

    mayMove: true,

    defaultCountdownSeconds: 5,
    defaultCountdownMilliseconds: 9,

    score: 0,
    hasScored: false,



    // CLASSES.
    player: {
        posX: 0, posY: 0,

        setPos: function(posX, posY) {
            if(posX<0 || posY<0 || posX>game.mapSize-1 || posY>game.mapSize-1) {
                return false;
            }else{
                this.posX = posX;
                this.posY = posY;
                return true;
            }
        }
    },

    coin: {
        posX: 0,
        posY: 0
    },



    
    init: function(stopwatchContainer, scoreContainer, gameContainer, mapSize) {
        // Initializes game object variables.
        this.mapSize = mapSize;
        this.gameContainer = gameContainer;
        this.stopwatchContainer = stopwatchContainer;
        this.scoreContainer = scoreContainer;
        
        this.player.posX = this.getRandomPos();
        this.player.posY = this.getRandomPos();

        this.coin.posX = this.getRandomPos();
        this.coin.posY = this.getRandomPos();

        this.updateScore();
    },

    getRandomPos: function() {
        // Returns a random value in the interval of [0, 29].
        return Math.ceil( Math.random() * (game.mapSize-1) );
    },



    
    drawCountdown: function() {
        // Draws and handles countdown activitiy.
        let nowCountdownSeconds = game.defaultCountdownSeconds;
        let nowCountdownMilliseconds = game.defaultCountdownMilliseconds;

        // Handles every one second interval.
        setInterval(function() {
            game.stopwatchContainer.innerHTML = nowCountdownSeconds + '.' + game.nowCountdownMilliseconds + 's';

            if(!game.hasScored) {
                game.gameContainer.style.backgroundColor = 'white';
            }

            if(nowCountdownSeconds == 0) {
                nowCountdownSeconds = game.defaultCountdownSeconds;
                game.coin.posX = game.getRandomPos();
                game.coin.posY = game.getRandomPos();
                game.drawGame();
                game.mayMove = true;
                game.hasScored=false;
                
                if(!game.hasScored) {
                    game.gameContainer.style.backgroundColor = '#e34949'; // turns red.
                }else{
                    game.gameContainer.style.backgroundColor = 'white';
                }
            }else{
                nowCountdownSeconds--;
            }
        }, 1000);
        
        // Handles every millisecond interval.
        setInterval(function() {
            console.log(game.hasScored);
            game.stopwatchContainer.innerHTML = nowCountdownSeconds + '.<span class=\'ms\'>' + nowCountdownMilliseconds + 's</span>';

            if(nowCountdownMilliseconds == 0) {
                nowCountdownMilliseconds = game.defaultCountdownMilliseconds;
            }else{
                nowCountdownMilliseconds--;
            }
        }, 100);
    },

    drawGame: function() {
        // Draws and updates game container.
        let content = '';

        for(let i=0; i<game.mapSize; i++) {
            for(let j=0; j<game.mapSize; j++) {
                // Draws player.
                if(this.player.posX == j && this.player.posY == i) {
                    content += '<div class=\'mapPixel playerPixel\'></div>'
                }
                // Draws coin.
                else if(this.coin.posX == j && this.coin.posY == i) {
                    content += '<div class=\'mapPixel coinPixel\'></div>'
                }

                // Draws normal map.
                else{
                    content += '<div class=\'mapPixel\'></div>'
                }
            }
        }

        this.gameContainer.innerHTML = content;
    },

    updateScore: function() {
        // Simply updates score header.
        this.scoreContainer.innerHTML = this.score + ' points';
    },



    move: function(keyCode) {
        // Responsible for handling key events.
        if(this.mayMove) {
            switch (keyCode) {
                case 38: // arrow up
                    this.player.setPos(this.player.posX, this.player.posY-1);
                    break;

                case 40: // arrow down
                    this.player.setPos(this.player.posX, this.player.posY+1);
                    break;

                case 37: // arrow left
                    this.player.setPos(this.player.posX-1, this.player.posY);
                    break;

                case 39: // arrow right
                    this.player.setPos(this.player.posX+1, this.player.posY);
                    break;
            }

            // If player got the coin.
            if(this.player.posX == this.coin.posX && this.player.posY == this.coin.posY) {
                this.mayMove = false; // freezes the game.
                this.gameContainer.style.backgroundColor = '#77ff94'; // turns green.
                game.score++;
                game.hasScored=true;
                this.updateScore();
            }
            this.drawGame(); // updates game container after every move.
        }
    }
};