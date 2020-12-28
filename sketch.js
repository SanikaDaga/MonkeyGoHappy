// declaring variables globally
var monkey , monkey_running, ground;
var banana ,bananaImage, obstacle, obstacleImage;
var bananaGroup, obstacleGroup;
var score;
var survivalTime = 0;
var gameOver, restart, gameOverImage,restartImage;

var PLAY = 1;
var END = 0;
var gameState = PLAY;


function preload(){
  // loading animation and images
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  monkeyCollided = loadImage("sprite_0.png");
}

function setup() {
  createCanvas(400,350);
  
  // creating monkey sprite
  monkey = createSprite(100,300,20,20);
  monkey.addAnimation("monkeyRunning", monkey_running);
  monkey.addAnimation("dead", monkeyCollided);
  monkey.scale = 0.1;  
  //monkey.setCollider("rectangle",10,40,50,50);
  //monkey.debug = true;
  
  // creating ground sprite
  ground = createSprite(400,330,800,10);
  ground.velocityX = -5;
  ground.x = ground.width/2;
  
  // creating game over sprite
  gameOver = createSprite(200,130,10,10);
  gameOver.addImage("gameover",gameOverImage);
  gameOver.scale = 0.7;
  gameOver.visible = false;
  
  // creating restart sprite
  restart = createSprite(200,170,10,10);
  restart.addImage("restart",restartImage);
  restart.scale = 0.5;
  restart.visible = false;
  
  // creating new groups
  bananaGroup = new Group();
  obstacleGroup = new Group();
}


function draw() {
  background(0);
  
  if(gameState === PLAY){
      // if space key is pressed
    if(keyDown("space") && monkey.y >270){
      monkey.velocityY = -13;
    }
    monkey.velocityY = monkey.velocityY + 0.5;
    //console.log(monkey.y);

    // to reset the ground
    if(ground.x < 0){
      ground.x = ground.width/2;
    }

    // function call
    spawnBananas();
    spawnObstacles();
    
    //console.log("frame : " +getFrameRate());
    // to keep increasing the survival time
    survivalTime = survivalTime + Math.round(getFrameRate()/60);
    
    // if monkey touches banana
    if(monkey.isTouching(bananaGroup)){
      bananaGroup[0].destroy();
      //survivalTime = survivalTime + 10;
    }
    
    // when monkey touches obstacles
    if(obstacleGroup.isTouching(monkey)){
      gameState = END;
    }
  }
  else if(gameState === END){
    ground.velocityX = 0;
    monkey.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);
    
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
    
    gameOver.visible = true;
    restart.visible = true;
    
    monkey.changeAnimation("dead", monkeyCollided);
    
   // survivalTime = 0;
    // if clicked on restart
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  // to prevent monkey from falling
  monkey.collide(ground);
  drawSprites();
  
  stroke("lightgreen");
  textSize(20);
  fill("red");
  text("Survival Time: "+ survivalTime, 125,50);
}

// to spawn the bananas
function spawnBananas(){
  if(frameCount%80 === 0){
    // creating banana sprite
    banana = createSprite(400,Math.round(random(120,220)),10,10);
    banana.addImage(bananaImage);
    banana.velocityX = -5;
    banana.scale = 0.1;
    
    // to adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    // setting lifetime to avoid memory leakage
    banana.lifetime = 200;
    
    // adding all bananas to one group
    bananaGroup.add(banana);
  }
}

// to spawn obstacles
function spawnObstacles(){
  if(frameCount%120 === 0){
    // creating obstacles sprite
    obstacle = createSprite(400,300,10,10);
    obstacle.addImage("obstacle", obstacleImage);
    obstacle.scale = 0.15;
    obstacle.velocityX = -5;
    
    // setting lifetime to avoid memory leakage
    obstacle.lifetime = 200;
    
    // adding all obstacles to one group
    obstacleGroup.add(obstacle);
  }
}

// if clicked on restart
function reset(){
  // change game state
  gameState = PLAY;
  // hide gameover and restart
  gameOver.visible = false;
  restart.visible = false;
  // reset survival time
  survivalTime = 0;
  // destroy obstacle & banana on reset
  obstacleGroup.destroyEach();
  bananaGroup.destroyEach();
  // reset the monkeyy
  monkey.changeAnimation("monkeyRunning", monkey_running);
}

