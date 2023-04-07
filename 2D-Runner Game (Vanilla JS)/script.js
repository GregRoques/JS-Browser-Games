// ================================================================== Player Class

class Player {
  constructor() {
    this.position = 0;
    this.isJumping = false;
    this.isGameOver = false;
    this.controller = new AbortController();
  }
  createPlayer() {
    const player = document.createElement("div");
    player.id = "player";
    player.style = `
      position: absolute;
      width: 60px;
      height: 60px;
      background-image: url(t-rex.png);
      bottom: 0px;
    `;
    const gameBox = document.getElementById("gameBox");
    gameBox.append(player);
    document.addEventListener(
      "keyup",
      (e) => {
        if ((!this.isJumping && e.code == "Space") || e.key == " ") {
          this.jump();
        }
      },
      {
        signal: this.controller.signal,
      }
    );
  }
  getPlayerPosition(){
    return this.position;
  }
  getGameOverStatus(){
    return this.isGameOver;
  }
  setGameOver() {
    this.isGameOver = true;
    player.style.backgroundImage =
      "url(https://icon2.cleanpng.com/20171220/cqe/explosion-png-5a3a717f8ac125.8974526615137795835684.jpg)";

    this.controller.abort();
    setTimeout(() => {
      alert("You Are Dead!");
      gameBox.removeChild(player);
      player.delete;
    }, 250);
  }
  jump() {
    let position = this.position;

    const gravity = 0.9;
    let count = 0;
    //descent
    let playerUpTimer = setInterval(() => {
      if (count === 15) {
        clearInterval(playerUpTimer);
        let playerDownTimer = setInterval(() => {
          if (count === 0) {
            clearInterval(playerDownTimer);
            this.isJumping = false;
          }
          position -= 5;
          count--;
          position = position * gravity;
          player.style.bottom = `${position}px`;
        });
      }
      position += 30;
      count++;
      position = position * gravity;
      player.style.bottom = `${position}px`;
    }, 20);
  }
}

// ================================================================== Enemy Class

function newEnemy(player) {
  let enemyPosition = window.innerWidth / 2;

  const enemy = document.createElement("div");
  enemy.style = `
      position: absolute;
      width: 60px;
      height: 60px;
      background-image: url(cacti.png);
      bottom: 0px;
      left:${enemyPosition}px;
    `;
  const gameBox = document.getElementById("gameBox");
  gameBox.append(enemy);
  let enemyTimer = setInterval(() => {
    const playerPosition = player.getPlayerPosition()
    if (enemyPosition > 0 && enemyPosition < 60 && playerPosition < 60) {
      clearInterval(enemyTimer);
      gameBox.removeChild(enemy);
      player.setGameOver(true);
      return;
    }
    if (enemyPosition <= 0) {
      clearInterval(enemyTimer);
      gameBox.removeChild(enemy);
    }
    enemyPosition -= 10;
    enemy.style.left = `${enemyPosition}px`;
  }, 20);
}

// ================================================================== Game Start

document.addEventListener("DOMContentLoaded", () => {
  const player = new Player();
  player.createPlayer();

  function getEnemy() {
    let randomTime = Math.random() * 4000;
    setTimeout(() => {
      if (!player.getGameOverStatus()) {
        randomTime = Math.random() * 4000;
        newEnemy(player);
        setTimeout(getEnemy, randomTime);
      }
    }, randomTime);
  }
  getEnemy(player);
});
