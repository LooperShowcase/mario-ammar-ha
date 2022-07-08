kaboom({
  global: true,
  scale: 2,
  fullscreen: true,
  clearColor: [0.8, 1, 1, 1],
});
loadRoot("./sprites/");
loadSprite("mushroom", "mushroom.png");
loadSprite("block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("surprise", "surprise.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("emushroom", "evil_mushroom.png  ");
loadSound("jump", "jumpSound.mp3");
loadSound("games", "gameSound.mp3");
loadSprite("unboxed", "unboxed.png");
loadSprite("star", "star.png");
loadSprite("dino", "dino.png");
loadSprite("princes", "princes.png");
loadSprite("heart", "heart.png");
let score = 0;
let hearts = 3;
scene("game", () => {
  play("games");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                     =                                                     ",
    "                                          =     =                                  =    =                                                  ",
    "                                         ==     =                                 =       =                                                ",
    "    =t                                  ===     =                                =           =                 = = = =                     ",
    "w          e   e           c      w    ====     we                          ew ===             ===           =             ==              ",
    "=============================================   ==============================                    ===========              ============    ",
    "                                                                                                                                        p  ",
    "                                                                                                                                w==========w",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    w: [sprite("block"), solid(), "wall"],
    t: [sprite("surprise"), solid(), "surprise_star"],
    1: [sprite("surprise"), solid(), "surprise_coin"],
    p: [sprite("pipe"), solid(), "pipe"],
    c: [sprite("coin"), "coin"],
    m: [sprite("mushroom"), "mushroom"],
    e: [sprite("emushroom"), body(), solid(), "emushroom"],
    d: [sprite("dino"), body(), solid(), "dino"],
    u: [sprite("unboxed"), solid(), "unboxed"],
    s: [sprite("star"), "star", body(), solid()],
    8: [sprite("surprise"), solid(), "surprise_mushroom"],
    a: [sprite("princes"), "princes", body(), solid()],
  };

  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);
  const heart = add([
    sprite("heart"),
    text("     x3"),
    origin("center"),
    color(0, 0, 0),
  ]);

  const scoreLabel = add([text("score : 0"), color(0, 0, 0)]);
  keyDown("d", () => {
    player.move(200, 0);
  });
  keyDown("a", () => {
    player.move(-200, 0);
  });
  keyDown("w", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(400);
      player.jump(CURRENT_JUMP_FORCE);
    }
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    heart.pos = player.pos.sub(390, 180);
    heart.text = "     x" + hearts;
    if (player) scoreLabel.text = "score: " + score;
    if (player.pos.y > 1000) {
      go("lose");
    }
    if (hearts <= 0) {
      go("lose");
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise_coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("c", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise_star")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("s", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise_mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });
  action("star", (obj) => {
    obj.move(20, 0);
  });
  let evil_speed = -20;
  action("emushroom", (obj) => {
    obj.collides("wall", () => {
      evil_speed *= -1;
    });
    obj.move(evil_speed, 0);
  });
  player.collides("coin", (obj) => {
    destroy(obj);
    score += 2;
  });
  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(5);
  });
  player.collides("pipe", (obj) => {
    keyDown("s", () => {
      go("game2");
    });
  });
  player.collides("mushroom", (obj) => {
    destroy(obj);
  });
  let lastGrounded = true;
  player.collides("emushroom", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });
  player.action(() => {
    lastGrounded = player.grounded();
  });
  // scene ends
});
scene("lose", () => {
  add([
    text("game over\n you lost", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    hearts = 3;
    go("game");
  });
});
scene("win", () => {
  add([
    text("you win\n ", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    go("game");
  });
});

scene("game2", () => {
  play("games");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                    ",
    "                                                                                                                                          ",
    "                                                                                                                                             ",
    "                                                                                                         ",
    "                                                                                                         ",
    "                                                                                                         ",
    "                                                                                                         ",
    "======================================================================================              ============     ",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    w: [sprite("block"), solid(), "wall"],
    t: [sprite("surprise"), solid(), "surprise_star"],
    1: [sprite("surprise"), solid(), "surprise_coin"],
    p: [sprite("pipe"), solid(), "pipe"],
    c: [sprite("coin"), "coin"],
    m: [sprite("mushroom"), "mushroom"],
    e: [sprite("emushroom"), body(), solid(), "emushroom"],
    d: [sprite("dino"), body(), solid(), "dino"],
    u: [sprite("unboxed"), solid(), "unboxed"],
    s: [sprite("star"), "star", body(), solid()],
    8: [sprite("surprise"), solid(), "surprise_mushroom"],
    a: [sprite("princes"), "princes", body(), solid()],
  };

  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  const scoreLabel = add([text("score : 0"), color(0, 0, 0)]);
  keyDown("d", () => {
    player.move(200, 0);
  });
  keyDown("a", () => {
    player.move(-200, 0);
  });
  keyDown("w", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(400);
      player.jump(CURRENT_JUMP_FORCE);
    }
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    if (player) scoreLabel.text = "score: " + score;
    if (player.pos.y > 1000) {
      go("lose");
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise_coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("c", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise_star")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("s", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise_mushroom")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
    }
  });
  action("star", (obj) => {
    obj.move(20, 0);
  });
  let evil_speed = -20;
  action("emushroom", (obj) => {
    obj.collides("wall", () => {
      evil_speed *= -1;
    });
    obj.move(evil_speed, 0);
  });
  player.collides("coin", (obj) => {
    destroy(obj);
    score += 2;
  });
  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(5);
  });
  player.collides("pipe", (obj) => {
    keyDown("s", () => {
      go("game2");
    });
  });
  player.collides("mushroom", (obj) => {
    destroy(obj);
  });
  let lastGrounded = true;
  player.collides("emushroom", (obj) => {
    if (lastGrounded) {
      go("lose");
    } else {
      destroy(obj);
    }
  });
  player.action(() => {
    lastGrounded = player.grounded();
  });
  // scene ends
});
start("game");
