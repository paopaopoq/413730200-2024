let sprites = {
  player1: {
  idle: {
  img: null,
  width: 47,
  height: 95,
  frames: 1
  },
  walk: {
  img: null,
  width: 91,
  height: 95,
  frames: 1
  },
  jump: {
  img: null,
  width: 73,
  height: 95,
  frames: 1
  },
  attack: {
  img: null,
  width: 97,
  height: 92,
  frames: 1
  }
  },
  player2: {
  idle: {
  img: null,
  width: 51,
  height: 95,
  frames: 1
  },
  walk: {
  img: null,
  width: 58,
  height: 95,
  frames: 1
  },
  jump: {
  img: null,
  width: 50,
  height: 87,
  frames: 1
  },
  attack: {
  img: null,
  width: 99,
  height: 93,
  frames: 1
  }
  },
  bullet: {
  img: null,
  width: 35,
  height: 31,
  frames: 8
  },
  background: {
    img: null,
    width: 1920,
    height: 1080
  }
  };
  
  let player1, player2;
  
  function preload() {
  // 載入角色1的動作圖片
  sprites.player1.idle.img = loadImage('圖/11idle.png');
  sprites.player1.walk.img = loadImage('圖/11walk.png');
  sprites.player1.jump.img = loadImage('圖/11jump.png');
  
  // 載入角色2的動作圖片
  sprites.player2.idle.img = loadImage('圖/22idle.png');
  sprites.player2.walk.img = loadImage('圖/22walk.png');
  sprites.player2.jump.img = loadImage('圖/22jump.png');
  
  // 載入其他圖片
  
  // 載入攻擊動作圖片
  sprites.player1.attack.img = loadImage('圖/11attack.png');
  sprites.player2.attack.img = loadImage('圖/22attack.png');
  
  // 載入子彈圖片
  sprites.bullet.img = loadImage('圖/ｅｆｆｅｃｔ.png');
  
  // 載入背景圖片
  sprites.background.img = loadImage('圖/17153931_703cb5553e copy.jpeg');
  }
  
  function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 計算角色的實際大小（考慮放大倍數）
  const scale_factor = 3;
  const char1Width = sprites.player1.idle.width * scale_factor;
  const char2Width = sprites.player2.idle.width * scale_factor;
  
  player1 = {
  x: windowWidth * 0.25 - char1Width/2,
  y: windowHeight * 0.25,
  speedX: 5,
  speedY: 0,
  gravity: 0.4,
  jumpForce: -20,
  isJumping: false,
  groundY: windowHeight * 0.4,
  currentFrame: 0,
  currentAction: 'idle',
  direction: 1,
  bullets: [],
  health: 100,
  isAttacking: false,
  attackTimer: 0,
  attackDuration: 30,
  attackFrame: 0,
  isDead: false,
  particles: [],
  explosions: [],
  name: "玩家1",
  nameColor: color(255, 100, 100)
  };
  
  player2 = {
  x: windowWidth * 0.75 - char2Width/2,
  y: windowHeight * 0.25,
  speedX: 5,
  speedY: 0,
  gravity: 0.4,
  jumpForce: -20,
  isJumping: false,
  groundY: windowHeight * 0.4,
  currentFrame: 0,
  currentAction: 'idle',
  direction: -1,
  bullets: [],
  health: 100,
  isAttacking: false,
  attackTimer: 0,
  attackDuration: 30,
  attackFrame: 0,
  isDead: false,
  particles: [],
  explosions: [],
  name: "玩家2",
  nameColor: color(100, 100, 255)
  };
  
  gameState = {
  winner: null,
  gameOver: false,
  announceTimer: 180,
  countDown: 3,
  isStarting: true,
  startTimer: 180,
  waitingForStart: true
  };
  }
  
  // 新增視窗大小改變時的處理函數
  function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // 計算角色的實際大小（考慮放大倍數）
  const scale_factor = 3;
  const char1Width = sprites.player1.idle.width * scale_factor;
  const char2Width = sprites.player2.idle.width * scale_factor;
  
  // 更新角色的地面位置
  player1.groundY = windowHeight * 0.4;
  player2.groundY = windowHeight * 0.4;
  
  // 更新角色的位置
  player1.x = windowWidth * 0.25 - char1Width/2;
  player2.x = windowWidth * 0.75 - char2Width/2;
  player1.y = windowHeight * 0.25;
  player2.y = windowHeight * 0.25;
  }
  
  function draw() {
  // 繪製背景圖片
  drawBackground();
  
  // 繪��系名（放在最上層）
  drawDepartmentName();
  
  // 重設繪圖設定
  noStroke();
  fill(255);
  
  if (gameState.waitingForStart) {
  drawStartScreen();
  if (keyIsDown(27)) {
  gameState.waitingForStart = false;
  }
  return;
  }
  
  if (gameState.isStarting) {
    drawCountDown();
    return;
  }
  
  updatePhysics(player1);
  updatePhysics(player2);
  updateBullets(player1);
  updateBullets(player2);
  
  checkKeys();
  checkCollisions();
  
  drawCharacter(player1, sprites.player1);
  drawCharacter(player2, sprites.player2);
  drawBullets(player1);
  drawBullets(player2);
  
  // 繪製操作說明
  drawControls();
  
  updateEffects(player1);
  updateEffects(player2);
  
  drawEffects(player1);
  drawEffects(player2);
  
  // 繪製勝利宣告
  if (gameState.gameOver && gameState.announceTimer > 0) {
  drawAnnouncement();
  gameState.announceTimer--;
  }
  }
  
  function drawCharacter(player, playerSprites) {
  let currentSprite = playerSprites[player.currentAction];
  
  if (!currentSprite || !currentSprite.img) {
  console.log("圖片未載入:", player.currentAction);
  return;
  }
  
  if (player.currentAction === 'attack') {
  if (player.attackTimer > 0) {
  player.attackFrame = Math.floor((player.attackDuration - player.attackTimer) *
  (currentSprite.frames / player.attackDuration));
  }
  player.currentFrame = player.attackFrame;
  } else {
  player.currentFrame = (player.currentFrame + 1) % currentSprite.frames;
  }
  
  let sx = player.currentFrame * currentSprite.width;
  let scale_factor = 3;
  
  // 繪製血條
  let healthBarWidth = 100;
  let healthBarHeight = 10;
  let healthX = player.x + (currentSprite.width * scale_factor / 2) - (healthBarWidth / 2);
  let healthY = player.y - 20; // 血條位置在角色上方
  
  // 繪製血條背景（灰色）
  fill(100);
  rect(healthX, healthY, healthBarWidth, healthBarHeight);
  
  // 繪製當前血量（紅色）
  fill(255, 0, 0);
  rect(healthX, healthY, (player.health / 100) * healthBarWidth, healthBarHeight);
  
  // 繪製血條邊框（黑色）
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(healthX, healthY, healthBarWidth, healthBarHeight);
  
  // 重設繪圖設定
  noStroke();
  
  // 繪製角色
  push();
  translate(player.x + (player.direction === -1 ? currentSprite.width * scale_factor : 0), player.y);
  scale(player.direction, 1);
  image(currentSprite.img,
  0, 0,
  currentSprite.width * scale_factor, currentSprite.height * scale_factor,
  sx, 0,
  currentSprite.width, currentSprite.height
  );
  pop();
  
  // 重設 tint
  noTint();
  
  // 繪製玩家名稱
  let nameX = player.x + (currentSprite.width * scale_factor / 2);
  let nameY = player.y - 40; // 位於血條上方
  
  // 設定文字樣式
  textAlign(CENTER);
  textSize(20);
  
  // 繪製名稱陰影
  fill(0, 150);
  text(player.name, nameX + 2, nameY + 2);
  
  // 繪製名稱
  fill(player.nameColor);
  text(player.name, nameX, nameY);
  
  // 重設文字對齊
  textAlign(LEFT);
  }
  
  function checkKeys() {
  // 玩家1移動控制 (WASD)
  if (!player1.isDead) {
  if (keyIsDown(65)) { // A鍵
  player1.x -= player1.speedX;
  player1.direction = -1;
  player1.currentAction = 'walk';
  } else if (keyIsDown(68)) { // D鍵
  player1.x += player1.speedX;
  player1.direction = 1;
  player1.currentAction = 'walk';
  } else if (!player1.isJumping) {
  player1.currentAction = 'idle';
  }
  
  if (keyIsDown(87) && !player1.isJumping) { // W鍵跳躍
    player1.speedY = player1.jumpForce;
    player1.isJumping = true;
    player1.currentAction = 'jump';
  }
  }
  
  // 玩家2移動控制 (方向鍵)
  if (!player2.isDead) {
  if (keyIsDown(LEFT_ARROW)) {
  player2.x -= player2.speedX;
  player2.direction = -1;
  player2.currentAction = 'walk';
  } else if (keyIsDown(RIGHT_ARROW)) {
  player2.x += player2.speedX;
  player2.direction = 1;
  player2.currentAction = 'walk';
  } else if (!player2.isJumping) {
  player2.currentAction = 'idle';
  }
  
  if (keyIsDown(UP_ARROW) && !player2.isJumping) {
    player2.speedY = player2.jumpForce;
    player2.isJumping = true;
    player2.currentAction = 'jump';
  }
  }
  
  // 玩家1攻擊 (F鍵)
  if (keyIsDown(70) && !player1.isAttacking) {
  player1.isAttacking = true;
  player1.attackTimer = player1.attackDuration;
  player1.currentAction = 'attack';
  player1.attackFrame = 0;
  
  setTimeout(() => {
    if (player1.isAttacking) {
      let bulletX = player1.x + (player1.direction === 1 ? 100 : -20);
      player1.bullets.push(createBullet(bulletX, player1.y + 50, player1.direction));
    }
  }, player1.attackDuration * 8);
  }
  
  // 玩家2攻擊 (空白鍵)
  if (keyIsDown(32) && !player2.isAttacking) {
  player2.isAttacking = true;
  player2.attackTimer = player2.attackDuration;
  player2.currentAction = 'attack';
  player2.attackFrame = 0;
  
  setTimeout(() => {
    if (player2.isAttacking) {
      let bulletX = player2.x + (player2.direction === 1 ? 100 : -20);
      player2.bullets.push(createBullet(bulletX, player2.y + 50, player2.direction));
    }
  }, player2.attackDuration * 8);
  }
  }
  
  function updatePhysics(player) {
  // 應用重力
  if (player.y < player.groundY) {
  player.speedY += player.gravity;
  player.isJumping = true;
  }
  
  // 更新垂���位���
  player.y += player.speedY;
  
  // 檢查是否超出上邊界
  if (player.y < 0) {
  player.y = 0;
  player.speedY = 0;
  }
  
  // 檢查是否著地
  if (player.y >= player.groundY) {
  player.y = player.groundY;
  player.speedY = 0;
  player.isJumping = false;
  if (player.currentAction === 'jump') {
  player.currentAction = 'idle';
  }
  }
  
  // 確保角色不會超出畫面範圍
  if (player.x < 0) {
  player.x = 0;
  }
  if (player.x > windowWidth - sprites.player1.idle.width * 3) {
  player.x = windowWidth - sprites.player1.idle.width * 3;
  }
  
  // 更新攻擊狀態
  if (player.isAttacking) {
  player.attackTimer--;
  if (player.attackTimer <= 0) {
  player.isAttacking = false;
  player.currentAction = 'idle';
  }
  }
  }
  
  function createBullet(x, y, direction) {
  return {
  x: x,
  y: y,
  speedX: 15 * direction,
  frame: 0,
  active: true
  };
  }
  
  function updateBullets(player) {
  for (let i = player.bullets.length - 1; i >= 0; i--) {
  let bullet = player.bullets[i];
  bullet.x += bullet.speedX;
  bullet.frame = (bullet.frame + 1) % sprites.bullet.frames;
  
  if (bullet.x < 0 || bullet.x > windowWidth) {
    player.bullets.splice(i, 1);
  }
  }
  }
  
  function drawBullets(player) {
  let scale_factor = 2;
  
  for (let bullet of player.bullets) {
  if (bullet.active) {
  push();
  translate(bullet.x, bullet.y);
  scale(bullet.speedX > 0 ? 1 : -1, 1);
  
    let sx = bullet.frame * sprites.bullet.width;
    image(sprites.bullet.img,
      0, 0,
      sprites.bullet.width * scale_factor, sprites.bullet.height * scale_factor,
      sx, 0,
      sprites.bullet.width, sprites.bullet.height
    );
    pop();
  }
  }
  }
  
  // 修改操作說明繪製函數
  function drawControls() {
  let padding = 20;  // 邊距
  let lineHeight = 25;  // 行高
  let y = windowHeight - padding - lineHeight * 4;  // 從底部往上第4行開始
  
  // 設定文字樣式
  textSize(20);  // 增加文字大小
  textAlign(LEFT);
  
  // 繪製半透明背景
  fill(0, 0, 0, 150);
  noStroke();
  rect(padding - 10, y - 30, 400, 150, 10);  // 添加圓角矩形背景
  
  // 玩家1控制說明
  // 標題
  fill(255, 100, 100);  // 玩家1用紅色
  text("玩家1控制：", padding, y);
  
  // 詳細說明
  fill(255);  // 白色文字
  text("W：跳躍", padding + 20, y + lineHeight);
  text("A：向左移動", padding + 20, y + lineHeight * 2);
  text("D：向右移動", padding + 20, y + lineHeight * 3);
  text("F：攻擊", padding + 20, y + lineHeight * 4);
  
  // 玩家2控制說明
  let x2 = padding + 200;  // 第二列的x座標
  
  // 標題
  fill(100, 100, 255);  // 玩家2用藍色
  text("玩家2控制：", x2, y);
  
  // 詳細說明
  fill(255);  // 白色文字
  text("↑：跳躍", x2 + 20, y + lineHeight);
  text("←：向左移動", x2 + 20, y + lineHeight * 2);
  text("→：向右移動", x2 + 20, y + lineHeight * 3);
  text("空白鍵：攻擊", x2 + 20, y + lineHeight * 4);
  
  // 添加發光效果
  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = 'white';
  
  // 重設陰影效果
  drawingContext.shadowBlur = 0;
  }
  
  // 新增碰撞檢測函數
  function checkCollisions() {
  // 檢查玩家1的子彈是否擊中玩家2
  for (let i = player1.bullets.length - 1; i >= 0; i--) {
  let bullet = player1.bullets[i];
  if (checkBulletHit(bullet, player2) && !player2.isDead) {
  player2.health -= 10;
  player1.bullets.splice(i, 1);
  player2.health = Math.max(0, player2.health);
  
    if (player2.health <= 0 && !player2.isDead) {
      player2.isDead = true;
      player2.currentAction = 'idle';
      
      // 設定勝利者
      gameState.winner = "玩家1";
      gameState.gameOver = true;
      gameState.announceTimer = 180;
      
      let centerX = player2.x + sprites.player2.idle.width * 1.5;
      let centerY = player2.y + sprites.player2.idle.height * 1.5;
      createDeathEffect(player2, centerX, centerY);
    }
  }
  }
  
  // 檢查玩家2的子彈是否擊中玩家1
  for (let i = player2.bullets.length - 1; i >= 0; i--) {
  let bullet = player2.bullets[i];
  if (checkBulletHit(bullet, player1) && !player1.isDead) {
  player1.health -= 10;
  player2.bullets.splice(i, 1);
  player1.health = Math.max(0, player1.health);
  
    if (player1.health <= 0 && !player1.isDead) {
      player1.isDead = true;
      player1.currentAction = 'idle';
      
      // 設定勝利者
      gameState.winner = "玩家2";
      gameState.gameOver = true;
      gameState.announceTimer = 180;
      
      let centerX = player1.x + sprites.player1.idle.width * 1.5;
      let centerY = player1.y + sprites.player1.idle.height * 1.5;
      createDeathEffect(player1, centerX, centerY);
    }
  }
  }
  }
  
  // 檢查子彈是否擊中角色
  function checkBulletHit(bullet, player) {
  let scale_factor = 3;
  let playerWidth = sprites.player1.idle.width * scale_factor;
  let playerHeight = sprites.player1.idle.height * scale_factor;
  
  // 簡單的矩形碰撞檢測
  return bullet.x < player.x + playerWidth &&
  bullet.x + sprites.bullet.width * 2 > player.x &&
  bullet.y < player.y + playerHeight &&
  bullet.y + sprites.bullet.height * 2 > player.y;
  }
  
  // 新增粒子建立函數
  function createParticle(x, y, type = 'normal') {
  if (type === 'death') {
  return {
  x: x,
  y: y,
  speedX: random(-8, 8),
  speedY: random(-12, -2),
  size: random(8, 16),
  color: color(
  random([
  color(255, 100, 0), // 橙色
  color(255, 50, 0), // 紅橙色
  color(255, 200, 0), // 黃色
  color(255, 150, 0) // 金色
  ])
  ),
  gravity: 0.3,
  life: 255,
  decay: random(2, 4),
  rotation: random(TWO_PI),
  rotationSpeed: random(-0.1, 0.1)
  };
  }
  return {
  x: x,
  y: y,
  speedX: random(-5, 5),
  speedY: random(-8, -2),
  size: random(3, 8),
  color: color(255, random(0, 100), 0, 255),
  gravity: 0.3,
  life: 255
  };
  }
  
  // 新增爆炸效果建立函數
  function createExplosion(x, y, size = 'normal') {
  return {
  x: x,
  y: y,
  radius: size === 'big' ? 40 : 20,
  maxRadius: size === 'big' ? 80 : 40,
  alpha: 255,
  color: color(255, 200, 0), // 金色
  active: true
  };
  }
  
  // 新增特效更新函數
  function updateEffects(player) {
  // 更新粒子
  for (let i = player.particles.length - 1; i >= 0; i--) {
  let p = player.particles[i];
  p.x += p.speedX;
  p.y += p.speedY;
  p.speedY += p.gravity;
  p.speedX *= 0.98;
  p.life -= p.decay || 5;
  
  if (p.life <= 0) {
    player.particles.splice(i, 1);
  }
  }
  
  // 更新爆炸
  for (let i = player.explosions.length - 1; i >= 0; i--) {
  let exp = player.explosions[i];
  exp.radius += 2;
  exp.alpha -= 10;
  
  if (exp.alpha <= 0 || exp.radius >= exp.maxRadius) {
    player.explosions.splice(i, 1);
  }
  }
  }
  
  // 新增特效繪製函數
  function drawEffects(player) {
  // 繪製爆炸
  for (let exp of player.explosions) {
  if (exp.active) {
  push();
  // 外圈
  noFill();
  strokeWeight(3);
  stroke(red(exp.color), green(exp.color), blue(exp.color), exp.alpha);
  circle(exp.x, exp.y, exp.radius * 2);
  
    // 內圈
    strokeWeight(2);
    stroke(255, exp.alpha);
    circle(exp.x, exp.y, exp.radius);
    
    // 十字光芒
    let rays = 8;
    for (let i = 0; i < rays; i++) {
      let angle = (TWO_PI / rays) * i;
      let x1 = exp.x + cos(angle) * (exp.radius * 0.3);
      let y1 = exp.y + sin(angle) * (exp.radius * 0.3);
      let x2 = exp.x + cos(angle) * exp.radius;
      let y2 = exp.y + sin(angle) * exp.radius;
      
      stroke(255, 255, 0, exp.alpha);
      line(x1, y1, x2, y2);
    }
    pop();
  }
  }
  
  // 繪製粒子
  for (let p of player.particles) {
  push();
  translate(p.x, p.y);
  if (p.rotation !== undefined) {
  rotate(p.rotation);
  p.rotation += p.rotationSpeed;
  }
  
  let alpha = p.life;
  let c = p.color;
  
  // 繪製發光效果
  noStroke();
  for (let i = 3; i > 0; i--) {
    fill(red(c), green(c), blue(c), alpha * 0.3);
    circle(0, 0, p.size * i);
  }
  
  // 繪製核心
  fill(red(c), green(c), blue(c), alpha);
  circle(0, 0, p.size);
  
  pop();
  }
  }
  
  // 新增死亡特效生成函數
  function createDeathEffect(player, x, y) {
  // 中心大爆炸
  player.explosions.push(createExplosion(x, y, 'big'));
  
  // 環形小爆炸
  let numExplosions = 8;
  let radius = 60;
  for (let i = 0; i < numExplosions; i++) {
  let angle = (TWO_PI / numExplosions) * i;
  let explosionX = x + cos(angle) * radius;
  let explosionY = y + sin(angle) * radius;
  
  setTimeout(() => {
    player.explosions.push(createExplosion(explosionX, explosionY, 'normal'));
    
    // 每個爆炸點產生粒子
    for (let j = 0; j < 15; j++) {
      player.particles.push(createParticle(explosionX, explosionY, 'death'));
    }
  }, i * 100);
  }
  
  // 初始粒子爆發
  for (let i = 0; i < 60; i++) {
  let angle = random(TWO_PI);
  let speed = random(2, 8);
  let particle = createParticle(x, y, 'death');
  particle.speedX = cos(angle) * speed;
  particle.speedY = sin(angle) * speed;
  player.particles.push(particle);
  }
  }
  
  // 修改 drawAnnouncement 函數中的重新開始部分
  function drawAnnouncement() {
    push();
    // 半透明黑色背景
    fill(0, 0, 0, 150);
    rect(0, 0, windowWidth, windowHeight);
    
    // 設定文字樣式
    textAlign(CENTER, CENTER);
    textSize(64);
    
    // 繪製發光效果
    for (let i = 3; i > 0; i--) {
      fill(255, 200, 0, 50);
      text(`${gameState.winner} 勝利！`, 
        windowWidth/2 + i, 
        windowHeight/2 + i
      );
    }
    
    // 主要文字
    fill(255);
    text(`${gameState.winner} 勝利！`, 
      windowWidth/2, 
      windowHeight/2
    );
    
    // 修改提示文字為按 ESC 重新開始
    textSize(24);
    fill(255);
    text('按 ESC 鍵重新開始', 
      windowWidth/2, 
      windowHeight/2 + 80
    );
    pop();
    
    // 修改為只檢查 ESC 鍵
    if (keyIsDown(27) && gameState.announceTimer < 150) { // 27 是 ESC 鍵的 keyCode
      resetGame();
    }
  }
  
  // 新增重置遊戲函數
  function resetGame() {
  // 重置玩家1
  player1.health = 100;
  player1.isDead = false;
  player1.currentAction = 'idle';
  player1.bullets = [];
  player1.particles = [];
  player1.explosions = [];
  player1.x = windowWidth * 0.25 - sprites.player1.idle.width * 1.5;
  
  // 重置玩家2
  player2.health = 100;
  player2.isDead = false;
  player2.currentAction = 'idle';
  player2.bullets = [];
  player2.particles = [];
  player2.explosions = [];
  player2.x = windowWidth * 0.75 - sprites.player2.idle.width * 1.5;
  
  // 重置遊戲狀態
  gameState.winner = null;
  gameState.gameOver = false;
  gameState.announceTimer = 180;
  gameState.countDown = 3;
  gameState.isStarting = true;
  gameState.startTimer = 180;
  gameState.waitingForStart = true;
  }
  
  // 新增開始畫面繪製函數
  function drawStartScreen() {
  push();
  // 半透明黑色背景
  fill(0, 0, 0, 150);
  rect(0, 0, windowWidth, windowHeight);
  
  // 設定文字樣式
  textAlign(CENTER, CENTER);
  
  // 遊戲標題
  textSize(64);
  fill(255, 200, 0);
  text("格鬥遊戲", windowWidth/2, windowHeight/3);
  
  // 開始提示
  textSize(32);
  fill(255);
  text("按 ESC 鍵開始遊戲", windowWidth/2, windowHeight/2);
  
  // 控制說明
  textSize(24);
  let y = windowHeight * 0.7;
  text("玩家1: W,A,D 移動, F 攻擊", windowWidth/2, y);
  text("玩家2: ↑,←,→ 移動, 空白鍵攻擊", windowWidth/2, y + 40);
  pop();
  }
  
  function drawCountDown() {
    push();
    // 半透明黑色背景
    fill(0, 0, 0, 100);
    rect(0, 0, windowWidth, windowHeight);
    
    // 設定文字樣式
    textAlign(CENTER, CENTER);
    textSize(128);
    
    // 計算當前應該顯示的數字
    let currentNumber = ceil(gameState.countDown);
    
    // 繪製發光效果
    for (let i = 3; i > 0; i--) {
      fill(255, 200, 0, 50);
      text(currentNumber, 
        windowWidth/2 + i, 
        windowHeight/2 + i
      );
    }
    
    // 主要文字
    fill(255);
    text(currentNumber, 
      windowWidth/2, 
      windowHeight/2
    );
    
    // 更新倒數計時
    gameState.startTimer--;
    gameState.countDown = gameState.startTimer / 60;
    
    // 檢查是否倒數結束
    if (gameState.startTimer <= 0) {
      gameState.isStarting = false;
    }
    pop();
  }
  
  // 新增背景繪製函數
  function drawBackground() {
    // 如果背景圖片已載入
    if (sprites.background.img) {
      // 計算縮放比例以填滿畫面
      let scaleX = windowWidth / sprites.background.width;
      let scaleY = windowHeight / sprites.background.height;
      let scale = Math.max(scaleX, scaleY);  // 選擇較大的縮放比例以確保填滿畫面
      
      // 計算繪製位置，使背景置中
      let x = (windowWidth - sprites.background.width * scale) / 2;
      let y = (windowHeight - sprites.background.height * scale) / 2;
      
      // 繪製背景
      image(sprites.background.img,
        x, y,
        sprites.background.width * scale,
        sprites.background.height * scale
      );
    } else {
      // 如果圖片未載入，使用純色背景
      background(220);
    }
  }
  
  // 新增繪製系名的函數
  function drawDepartmentName() {
    push();
    // 設定文字樣式
    textAlign(CENTER, TOP);
    textSize(48);  // 較大的字體
    
    // 繪製半透明黑色背景條
    fill(0, 0, 0, 200);
    noStroke();
    rect(0, 0, windowWidth, 70);  // 背景條高度
    
    // 繪製文字陰影效果
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(255, 215, 0, 0.5)';  // 金色陰影
    
    // ���製文字外框
    strokeWeight(4);
    stroke(255, 215, 0);  // 金色外框
    fill(255);  // 白色文字
    text('淡江大學 教育科技系', windowWidth/2, 15);
    
    // 重設陰影效果
    drawingContext.shadowBlur = 0;
    pop();
  }
  
  // 修改 keyPressed 函數以防止其他按鍵重新開始
  function keyPressed() {
    // 只有在遊戲結束時才檢查 ESC 鍵
    if (gameState.gameOver && keyCode === 27) {
      resetGame();
    }
    return false;  // 防止默認行為
  }