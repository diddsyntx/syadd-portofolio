const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 575;

let scaleX = 1;
let scaleY = 1;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  scaleX = canvas.width / BASE_WIDTH;
  scaleY = canvas.height / BASE_HEIGHT;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const bgImage = new Image();
bgImage.src = "bg/background.png";

const heart = new Image();
heart.src = "warrior2/heart.png";

const idleImage = new Image();
idleImage.src = "warrior/IdleLeft.png";
const runLeftImage = new Image();
runLeftImage.src = "warrior/RunLeft.png";
const Attack1LeftImage = new Image();
Attack1LeftImage.src = "warrior/Attack1Left.png";
const JumpLeftImage = new Image();
JumpLeftImage.src = "warrior/JumpLeft.png";
const death = new Image();
death.src = "warrior/Death.png";

const enemy = new Image();
enemy.src = "warrior2/IDLE.png";
const EnemyRunImage = new Image();
EnemyRunImage.src = "warrior2/RUN.png";
const EnemyAttackImage = new Image();
EnemyAttackImage.src = "warrior2/ATTACK1.png";
const JumpRightImage = new Image();
JumpRightImage.src = "warrior2/JUMP.png";
const death2 = new Image();
death2.src = "warrior2/Death.png";

const cols = 8;
const totalFrames = 8;
const totalFramesAttack = 4;
const totalFramesJump = 2;
const totalFramesEnemy = 6;
const totalFramesJumpEnemy = 2;
const totalFramesDeath = 6;
const totalEnemyFramesDeath = 6;

const warrior = { spriteWidth: 0, spriteHeight: 0 };
let spriteWidthEnemy, spriteHeightEnemy;
let currentFrame = 0;
let currentFrameEnemy = 0;
let frameCounter = 0;
let frameCounterEnemy = 0;
const frameDelay = 8;
const frameEnemyDelay = 6;
let isDead1 = false;
let isDead2 = false;

const GROUND_Y1 = 270;
const GROUND_Y2 = 235;

let posX = BASE_WIDTH - 300;
let posY = GROUND_Y1;
let vx = 0;
let vy = 0;
const gravity = 1;
const gravityEnemy = 1;
const jumpPower = -18;
const jumpPowerEnemy = -18;

const warrior2 = {
  posXEnemy: 0,
  posYEnemy: GROUND_Y2,
  isMovingLeft2: false,
  isMovingRight2: false,
  isJumping2: false,
  isAttacking2: false,
  vxEnemy: 0,
  vyEnemy: 0,
};

const warriorMovement = {
  isMovingLeft: false,
  isMovingRight: false,
  isJumping: false,
  isAttacking: false,
  isFacingLeft: true,
};

let currentImage = idleImage;
let enemyImage = enemy;
let currentTotalFramesEnemy = totalFramesEnemy;

const attackBox = { x: 0, y: 0, width: 115, height: 70, active: false };
const HitBox = { x: 0, y: 0, width: 45, height: 90, active: false };
const attackBox2 = { x: 0, y: 0, width: 155, height: 70, active: false };
const HitBox2 = { x: 0, y: 0, width: 45, height: 92, active: false };

let health1 = 600;
let health2 = 600;
const maxHealth = 600;

idleImage.onload = () => {
  warrior.spriteWidth = idleImage.width / cols;
  warrior.spriteHeight = idleImage.height;
  requestAnimationFrame(animasi);
};

enemy.onload = () => {
  spriteWidthEnemy = enemy.width / cols;
  spriteHeightEnemy = enemy.height;
};

function updateAttackBox() {
  attackBox.active = warriorMovement.isAttacking;
  attackBox.x = posX + 15;
  attackBox.y = posY + 120;
}

function updateHitBox() {
  HitBox.x = posX + 130.7;
  HitBox.y = posY + 120;
  HitBox.active = true;
}

function updateAttackBox2() {
  attackBox2.active = warrior2.isAttacking2;
  attackBox2.x = warrior2.posXEnemy + 220.7;
  attackBox2.y = warrior2.posYEnemy + 150;
}

function updateHitBox2() {
  HitBox2.x = warrior2.posXEnemy + 175;
  HitBox2.y = warrior2.posYEnemy + 150;
  HitBox2.active = true;
}

function PenguranganDarah(r1, r2) {
  return (
    r1.active &&
    r2.active &&
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y
  );
}

function drawHealthBars() {
  const barW = 500;
  const barH = 22;
  const barY = 50;
  const radius = 4;
  const padding = 2;

  const p1ratio = health1 / maxHealth;
  const p2ratio = health2 / maxHealth;

  const p1x = 20;
  const p2x = BASE_WIDTH - 20 - barW;

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  ctx.fillStyle = "rgba(0,0,0,0.55)";
  roundRect(
    p1x - padding,
    barY - padding,
    barW + padding * 2,
    barH + padding * 2,
    radius + 1,
  );
  ctx.fill();
  roundRect(
    p2x - padding,
    barY - padding,
    barW + padding * 2,
    barH + padding * 2,
    radius + 1,
  );
  ctx.fill();

  ctx.fillStyle = "#3a3a3a";
  roundRect(p1x, barY, barW, barH, radius);
  ctx.fill();
  roundRect(p2x, barY, barW, barH, radius);
  ctx.fill();

  const getColor = (ratio) => {
    if (ratio > 0.5) return "#e03333";
    if (ratio > 0.25) return "#e07a33";
    return "#e0c433";
  };

  ctx.fillStyle = getColor(p2ratio);
  roundRect(p1x, barY, barW * p2ratio, barH, radius);
  ctx.fill();

  ctx.fillStyle = getColor(p1ratio);
  roundRect(p2x + barW * (1 - p1ratio), barY, barW * p1ratio, barH, radius);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  roundRect(p1x, barY, barW, barH, radius);
  ctx.stroke();
  roundRect(p2x, barY, barW, barH, radius);
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = 'bold 18px "Pixelify Sans", monospace';
  ctx.textAlign = "left";
  ctx.fillText("Samurai", p1x, barY - 8);
  ctx.textAlign = "right";
  ctx.fillText("King", p2x + barW, barY - 8);
  ctx.textAlign = "left";
}

function animasi() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

  ctx.drawImage(bgImage, 0, 0, BASE_WIDTH, BASE_HEIGHT);

  posX += vx;
  warrior2.posXEnemy += warrior2.vxEnemy;

  vy += gravity;
  posY += vy;
  if (posY >= GROUND_Y1) {
    posY = GROUND_Y1;
    vy = 0;
    warriorMovement.isJumping = false;
    updateImageByMovement();
  }

  warrior2.vyEnemy += gravityEnemy;
  warrior2.posYEnemy += warrior2.vyEnemy;
  if (warrior2.posYEnemy >= GROUND_Y2) {
    warrior2.posYEnemy = GROUND_Y2;
    warrior2.vyEnemy = 0;
    warrior2.isJumping2 = false;
  }

  updateAttackBox();
  updateHitBox();
  updateHitBox2();
  updateAttackBox2();

  const scale = 2;
  const drawWidth = warrior.spriteWidth * scale;
  const drawHeight = warrior.spriteHeight * scale;
  ctx.drawImage(
    currentImage,
    currentFrame * warrior.spriteWidth,
    0,
    warrior.spriteWidth,
    warrior.spriteHeight,
    posX,
    posY,
    drawWidth,
    drawHeight,
  );

  const scale2 = 2;
  const drawWidth2 = spriteWidthEnemy * scale2;
  const drawHeight2 = spriteHeightEnemy * scale2;
  ctx.drawImage(
    enemyImage,
    currentFrameEnemy * spriteWidthEnemy,
    0,
    spriteWidthEnemy,
    spriteHeightEnemy,
    warrior2.posXEnemy,
    warrior2.posYEnemy,
    drawWidth2,
    drawHeight2,
  );

  if (PenguranganDarah(attackBox, HitBox2)) {
    health2 = Math.max(0, health2 - 1);
    attackBox.active = false;
  }
  if (PenguranganDarah(attackBox2, HitBox)) {
    health1 = Math.max(0, health1 - 1);
    attackBox2.active = false;
  }

  drawHealthBars();

  document.fonts.load('45px "Pixelify Sans"').then(() => {
    if (health1 <= 0) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(BASE_WIDTH / 2 - 220, BASE_HEIGHT / 2 - 55, 440, 70);
      ctx.fillStyle = "white";
      ctx.font = '45px "Pixelify Sans", monospace';
      ctx.textAlign = "center";
      ctx.fillText("Samurai Win!", BASE_WIDTH / 2, BASE_HEIGHT / 2);
      ctx.textAlign = "left";
    }
    if (health2 <= 0) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(BASE_WIDTH / 2 - 180, BASE_HEIGHT / 2 - 55, 360, 70);
      ctx.fillStyle = "white";
      ctx.font = '45px "Pixelify Sans", monospace';
      ctx.textAlign = "center";
      ctx.fillText("King Win!", BASE_WIDTH / 2, BASE_HEIGHT / 2);
      ctx.textAlign = "left";
    }
  });

  frameCounter++;
  if (frameCounter >= frameDelay) {
    frameCounter = 0;
    currentFrame++;
    if (isDead1 && currentFrame >= totalFramesDeath) {
      currentFrame = totalFramesDeath - 1;
      vx = 0;
      vy = 0;
    } else if (
      warriorMovement.isAttacking &&
      currentFrame >= totalFramesAttack
    ) {
      warriorMovement.isAttacking = false;
    } else if (warriorMovement.isJumping && currentFrame >= totalFramesJump) {
      currentFrame = totalFramesJump - 1;
    } else if (
      !warriorMovement.isAttacking &&
      !warriorMovement.isJumping &&
      !isDead1 &&
      currentFrame >= totalFrames
    ) {
      currentFrame = 0;
    }
  }

  frameCounterEnemy++;
  if (frameCounterEnemy >= frameEnemyDelay) {
    frameCounterEnemy = 0;
    currentFrameEnemy++;
    if (isDead2 && currentFrameEnemy >= totalFramesDeath) {
      currentFrameEnemy = totalFramesDeath - 1;
      warrior2.vxEnemy = 0;
      warrior2.vyEnemy = 0;
    } else if (
      warrior2.isJumping2 &&
      currentFrameEnemy >= totalFramesJumpEnemy
    ) {
      currentFrameEnemy = totalFramesJumpEnemy - 1;
    } else if (
      !warrior2.isJumping2 &&
      !isDead2 &&
      currentFrameEnemy >= currentTotalFramesEnemy
    ) {
      currentFrameEnemy = 0;
      if (warrior2.isAttacking2) {
        warrior2.isAttacking2 = false;
        updateImageByMovementEnemy();
        currentTotalFramesEnemy = totalFramesEnemy;
      }
    }
  }

  if (health1 <= 0 && !isDead1) {
    isDead1 = true;
    currentFrame = 0;
    currentImage = death;
    vx = 0;
    warriorMovement.isAttacking = false;
    warriorMovement.isMovingLeft = false;
    warriorMovement.isMovingRight = false;
  }
  if (health2 <= 0 && !isDead2) {
    isDead2 = true;
    currentFrameEnemy = 0;
    enemyImage = death2;
    vx = 0;
    warrior2.isAttacking2 = false;
    warrior2.isMovingLeft2 = false;
    warrior2.isMovingRight2 = false;
  }

  requestAnimationFrame(animasi);
}

function updateImageByMovement() {
  if (warriorMovement.isAttacking) return;
  let newImage = idleImage;
  vx = 0;
  if (warriorMovement.isJumping) newImage = JumpLeftImage;
  else if (warriorMovement.isMovingRight || warriorMovement.isMovingLeft) {
    newImage = runLeftImage;
    vx = warriorMovement.isMovingRight ? 5 : -5;
  }
  const changed = newImage !== currentImage;
  currentImage = newImage;
  return changed;
}

function updateImageByMovementEnemy() {
  warrior2.vxEnemy = 0;
  if (warrior2.isMovingRight2) {
    warrior2.vxEnemy = 5;
    if (!warrior2.isAttacking2) enemyImage = EnemyRunImage;
  } else if (warrior2.isMovingLeft2) {
    warrior2.vxEnemy = -5;
    if (!warrior2.isAttacking2) enemyImage = EnemyRunImage;
  } else if (!warrior2.isAttacking2) {
    enemyImage = enemy;
  }
  currentTotalFramesEnemy = totalFramesEnemy;
}

document.addEventListener("keydown", (e) => {
  if (isDead1 || isDead2) return;
  if (e.code === "ArrowLeft" && !warriorMovement.isMovingLeft) {
    warriorMovement.isMovingLeft = true;
    warriorMovement.isFacingLeft = true;
    updateImageByMovement();
    currentFrame = 0;
  }
  if (e.code === "ArrowRight" && !warriorMovement.isMovingRight) {
    warriorMovement.isMovingRight = true;
    warriorMovement.isFacingLeft = false;
    updateImageByMovement();
    currentFrame = 0;
  }
  if (e.code === "ArrowUp" && !warriorMovement.isJumping) {
    vy = jumpPower;
    warriorMovement.isJumping = true;
    currentImage = JumpLeftImage;
    currentFrame = 0;
  }
  if (e.code === "ArrowDown" && !warriorMovement.isAttacking) {
    warriorMovement.isAttacking = true;
    currentImage = Attack1LeftImage;
    currentFrame = 0;
  }
  if (e.code === "KeyD" && !warrior2.isMovingRight2) {
    warrior2.isMovingRight2 = true;
    updateImageByMovementEnemy();
  }
  if (e.code === "KeyA" && !warrior2.isMovingLeft2) {
    warrior2.isMovingLeft2 = true;
    warrior2.isMovingRight2 = false;
    updateImageByMovementEnemy();
  }
  if (e.code === "Space" && !warrior2.isAttacking2) {
    warrior2.isAttacking2 = true;
    enemyImage = EnemyAttackImage;
    currentFrameEnemy = 0;
  }
  if (e.code === "KeyW" && !warrior2.isJumping2) {
    warrior2.vyEnemy = jumpPowerEnemy;
    warrior2.isJumping2 = true;
    enemyImage = JumpRightImage;
    currentFrameEnemy = 0;
  }
});
document.addEventListener("keyup", (e) => {
  if (isDead1 || isDead2) return;
  if (e.code === "ArrowLeft") warriorMovement.isMovingLeft = false;
  if (e.code === "ArrowRight") warriorMovement.isMovingRight = false;
  if (!warriorMovement.isJumping) updateImageByMovement();
  if (e.code === "KeyD") warrior2.isMovingRight2 = false;
  if (e.code === "KeyA") warrior2.isMovingLeft2 = false;
  updateImageByMovementEnemy();
});
