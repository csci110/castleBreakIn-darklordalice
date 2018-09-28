import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("grass.png");

class Wall extends Sprite {
    constructor(x, y, name, image) {
        super();
        this.y = y;
        this.x = x;
        this.name = name;
        this.setImage(image);
        this.accelerateOnBounce = false;

    }
}

new Wall(0, 0, "A Spooky Castle Wall", "castle.png");

let leftWall = new Wall(0, 200, "Left Side Wall", "wall.png");
let rightWall = new Wall(game.displayWidth - 48, 200, "Right Side Wall", "wall.png");

class Princess extends Sprite {
    constructor() {
        super();
        this.name = "Princess Ann";
        this.setImage("ann.png");
        this.height = 48;
        this.width = 48;
        this.x = game.displayWidth / 2;
        this.y = game.displayHeight - this.height;
        this.speedWhenWalking = 150;
        this.lives = 1;
        this.accelerateOnBounce = false;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.lives = 3;
    }

    handleLeftArrowKey() {
        this.playAnimation("left");
        this.speed = this.speedWhenWalking;
        this.angle = 180;
    }

    handleRightArrowKey() {
        this.playAnimation("right");
        this.speed = this.speedWhenWalking;
        this.angle = 0;
    }

    handleGameLoop() {
        this.x = Math.max(leftWall.width, this.x);
        this.x = Math.min(game.displayWidth - rightWall.width - ann.width, this.x);
        this.speed = 0;
        //keeps ann in display area
    }

    handleCollision(otherSprite) {
        // horizontally, Ann's image file is about one third blank, one third ann, and
        // one third blank
        // vertically, there is very little blank space. Ann's head is about one fourth
        // the height
        // the other sprite (ball) should change if:
        // 1 it hits the middle horizontal third of the image, which is not blank and
        // 2 it hits the upper fourth, which is Ann's head
        let horizontalOffset = this.x - otherSprite.x;
        let verticalOffset = this.y - otherSprite.y;
        if (Math.abs(horizontalOffset) < this.width / 3 &&
            verticalOffset > this.height / 4) {
            // the new angle depends on the horizontal difference between sprites.
            otherSprite.angle = 90 + 2 * horizontalOffset;
        }
        return false;
    }

    handleFirstGameLoop() {
        // sets up a text area to display the number of lives remaining
        this.livesDisplay = game.createTextArea(game.displayWidth - 3 * 48, 20);
        this.updateLivesDisplay();
    }

    updateLivesDisplay() {
        game.writeToTextArea(this.livesDisplay, "Lives =" + this.lives);
    }

    loseALife() {
        this.lives = this.lives - 1;
        this.updateLivesDisplay();
        new Ball(game.displayWidth / 2, game.displayHeight / 2, "Ball", "ball.png");
        if (this.lives <= 0) {
            game.end("The Mysterious Stranger Has Escaped\nPrincess Ann for Now!" +
                "\n\nBetter Luck Next Time!");
        }
    }
}

let ann = new Princess();

class Ball extends Sprite {
    constructor(x, y, name, image) {
        super();
        this.x = game.displayWidth / 2;
        this.y = game.displayHeight / 2;
        this.height = 48;
        this.width = 48;
        this.name = name;
        this.setImage(image);
        this.speed = 1;
        this.angle = 50 + Math.random() * 80;
        this.defineAnimation("spin", 0, 12);
        this.playAnimation("spin");
    }

    handleGameLoop() {
        if (this.speed < 200) {
            this.speed = this.speed + 2;
        }
    }

    handleBoundaryContact() {
        game.removeSprite(this);
        ann.loseALife();
    }

    handleCollision() {
        game.removeSprite(this);
        
    }
}

new Ball(game.displayWidth / 2, game.displayHeight / 2, "Ball", "ball.png");

class Block extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.name = "Block";
        this.setImage("block1.png");
        this.accelerateOnBounce = false;
    }
    
    handleCollision() {
        game.removeSprite(this);
        Block.blocksToDestroy = Block.blocksToDestroy - 1;
        if (Block.blocksToDestroy <= 0) {
            game.end("Congratulations!\nPrincess Ann Can Continue Her Pursuit" +
            "\n\nof The Mysterious Stranger!");
        }
    }
}

Block.blocksToDestroy = Block.blocksToDestroy + 1;

for (let i = 0; i < 5; i = i + 1) {
    new Block(200 + i * 48, 200);
}


