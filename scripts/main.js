const PLAYER_SPEED = 5;
const INITIAL_HEALTH = 3;

let player;
let enemies = [];
let foods = [];

let score = 0;
let health = INITIAL_HEALTH;
let gameState = "menu";
let difficulty = "easy";
let username = "";

let spawnRate = 90;

let playerImg, enemyImg, foodImg, bgImg;
let bgMusic;

let bgY = 0;

function preload() {
    const BASE = window.ASSET_BASE || "";
    playerImg = loadImage(BASE + "sprites/player.png");
    enemyImg = loadImage(BASE + "sprites/enemy.png");
    foodImg = loadImage(BASE + "sprites/food.png");
    bgImg = loadImage(BASE + "sprites/background.png");
    bgMusic = loadSound(BASE + "music/music.mp3");
}

function setup() {
    let canvas = createCanvas(500, 400);
    canvas.parent("gameCanvas");
    player = createSprite(250, 350, 32, 32);
    player.addImage(playerImg);
}

function draw() {
    drawBackground();
    if (gameState === "menu") showMenu();
    else if (gameState === "play") playGame();
    else if (gameState === "gameOver") showGameOver();
}

function drawBackground() {
    bgY += 1;
    image(bgImg, 0, bgY - height, width, height);
    image(bgImg, 0, bgY, width, height);
    if (bgY >= height) bgY = 0;
}

function showMenu() {
    fill("white");
    textSize(24);
    text("Pixel Survival", 140, 100);
    textSize(14);
    text("Name: " + username, 180, 140);
    text("1 = Easy | 2 = Hard", 160, 180);
    text("Collect food, avoid enemies!", 120, 220);
}

function playGame() {
    handleMovement();
    if (frameCount % spawnRate === 0) spawnEnemy(randomSpeed());
    if (frameCount % (spawnRate + 20) === 0) spawnFood();
    updateEnemies();
    updateFood();
    increaseDifficulty();
    drawSprites();
    drawHUD();
    if (health <= 0) gameState = "gameOver";
}

function handleMovement() {
    if (keyDown("LEFT")) player.x -= PLAYER_SPEED;
    if (keyDown("RIGHT")) player.x += PLAYER_SPEED;
    player.rotation = sin(frameCount * 0.2) * 5;
}

function spawnEnemy(speed) {
    let e = createSprite(random(width), 0, 25, 25);
    e.addImage(enemyImg);
    e.velocityY = speed;
    enemies.push(e);
}

function getRandomFood() {
    let types = ["apple", "meat", "berry"];
    return types[floor(random(types.length))];
}

function spawnFood() {
    let f = createSprite(random(width), 0, 20, 20);
    f.addImage(foodImg);
    f.type = getRandomFood();
    foods.push(f);
    return f;
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].y > height) {
            enemies[i].remove();
            enemies.splice(i, 1);
            continue;
        }
        if (player.overlap(enemies[i])) {
            health--;
            enemies[i].remove();
            enemies.splice(i, 1);
        }
    }
}

function updateFood() {
    for (let i = foods.length - 1; i >= 0; i--) {
        if (foods[i].y > height) {
            foods[i].remove();
            foods.splice(i, 1);
            continue;
        }
        if (player.overlap(foods[i])) {
            score++;
            foods[i].remove();
            foods.splice(i, 1);
        }
    }
}

function randomSpeed() {
    if (difficulty === "easy") return random(2, 4);
    return random(4, 7);
}

function increaseDifficulty() {
    if (score > 10) spawnRate = 70;
    if (score > 25) spawnRate = 50;
}

function drawHUD() {
    fill("white");
    textSize(14);
    text("Player: " + username, 10, 20);
    text("Score: " + score, 10, 40);
    text("Health: " + health, 10, 60);
}

function showGameOver() {
    fill("white");
    textSize(24);
    text("Game Over", 170, 150);
    textSize(16);
    text("Score: " + score, 190, 180);
    text("Press R", 200, 220);
}

function keyPressed() {
    if (gameState === "menu") {
        if (key.length === 1) username += key;
        if (key === "1") {
            difficulty = "easy";
            spawnRate = 90;
            startGame();
        }
        if (key === "2") {
            difficulty = "hard";
            spawnRate = 60;
            startGame();
        }
    }
    if (gameState === "gameOver" && key === "r") resetGame();
}

function startGame() {
    gameState = "play";
    if (bgMusic && !bgMusic.isPlaying()) bgMusic.loop();
}

function resetGame() {
    score = 0;
    health = INITIAL_HEALTH;
    enemies.forEach(e => e.remove());
    foods.forEach(f => f.remove());
    enemies = [];
    foods = [];
    gameState = "menu";
}