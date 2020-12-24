import {Scene} from "../create";
import {gameStore} from "../store";
import {GetOffsetShadowByMapLvl, GetSpriteSizeByMapLvl} from "../map/height_offset";

function CreateBullet(data, mpID) {

  let group = Scene.artilleryLayer;
  let bullet = gameStore.bullets[data.id];

  let shadowBullet = Scene.make.image({
    x: GetOffsetShadowByMapLvl(data.z, data.x, data.y, 0, 2.5, mpID).x,
    y: GetOffsetShadowByMapLvl(data.z, data.x, data.y, 0, 2.5, mpID).y,
    key: 'bullets',
    add: true,
    frame: data.n,
  });
  group.add(shadowBullet);

  shadowBullet.setOrigin(0.5);
  shadowBullet.setScale(GetSpriteSizeByMapLvl(data.z, 1 / 5, 0.05).x);
  shadowBullet.setAngle(data.r);
  shadowBullet.setAlpha(0.3);
  shadowBullet.setTint(0x000000);

  bullet.sprite = Scene.make.image({
    x: data.x,
    y: data.y,
    key: 'bullets',
    add: true,
    frame: data.n,
  });
  bullet.sprite.setOrigin(0.5);
  bullet.sprite.setScale(GetSpriteSizeByMapLvl(data.z, 1 / 5, 0.05).x);
  bullet.sprite.setAngle(data.r);
  group.add(bullet.sprite);

  bullet.shadow = shadowBullet;
  // gameStore.bullets[data.id] = bullet;

  bullet.sprite.setDepth(data.z);
  shadowBullet.setDepth(data.z - 1);

  if (data.t === "missile") {
    bullet.fairy = Fairy(data, 500, 'yellow', {min: 100, max: 300}, {start: 0.1, end: 0}, 2, {
      start: 1,
      end: 0,
      ease: 'Quad.easeIn'
    })
  }

  if (data.t === "firearms") {

    let frame = 'smoke_puff';
    let scale = {start: 0.1, end: 0};
    let quantity = 2;
    let alpha = {start: 1, end: 0, ease: 'Quad.easeIn'};
    let speed = {min: 100, max: 200};

    if (data.n === "ballistics_artillery_bullet") {
      frame = ['smoke_puff', 'yellow']
    }

    if (data.n === "piu-piu_2") {
      scale = {start: 0.05, end: 0};
      quantity = 4;
      alpha = {start: 0.5, end: 0, ease: 'Quad.easeIn'};
      speed = {min: 50, max: 100};
    }

    bullet.fairy = Fairy(data, 500, frame, speed, scale, quantity, alpha)
  }

  return bullet
}

function Fairy(data, lifespan, frame, speed, scale, quantity, alpha) {
  let rocketFairy = Scene.add.particles('flares');
  let emitter = rocketFairy.createEmitter({
    frame: frame,
    x: 0,
    y: 0,
    lifespan: lifespan,
    speed: speed,
    angle: {min: data.r - 5, max: data.r + 5},
    gravityY: 0,
    scale: scale,
    quantity: quantity,
    blendMode: 'SCREEN',
    alpha: alpha,
  });

  rocketFairy.x = data.x;
  rocketFairy.y = data.y;
  rocketFairy.setDepth(data.z);
  rocketFairy.emitter = emitter;

  return rocketFairy
}

function GetCacheBulletSprite(data, mpID) {
  if (gameStore.cacheSpriteBullets.hasOwnProperty(data.n) && gameStore.cacheSpriteBullets[data.n].length > 0) {

    let bullet = gameStore.cacheSpriteBullets[data.n].shift();

    bullet.sprite.x = data.x;
    bullet.sprite.y = data.y;
    bullet.sprite.setScale(GetSpriteSizeByMapLvl(data.z, 1 / 5, 0.05).x);
    bullet.sprite.setAngle(data.r);
    bullet.sprite.setDepth(data.z);

    if (bullet.shadow) {
      bullet.shadow.x = GetOffsetShadowByMapLvl(data.z, data.x, data.y, 0, 2.5, mpID).x;
      bullet.shadow.y = GetOffsetShadowByMapLvl(data.z, data.x, data.y, 0, 2.5, mpID).y;
      bullet.shadow.setScale(GetSpriteSizeByMapLvl(data.z, 1 / 5, 0.05).x);
      bullet.shadow.setAngle(data.r);
      bullet.shadow.setDepth(data.z - 1);
    }

    if (bullet.fairy) {
      bullet.fairy.x = data.x;
      bullet.fairy.y = data.y;
      bullet.fairy.emitter.setEmitterAngle({min: 180 + data.r, max: 180 + data.r});
      bullet.fairy.emitter.start();
      bullet.fairy.setDepth(data.z);
    }

    bullet.bufferMoveTick = [];
    gameStore.bullets[data.id] = bullet;
    uncoverBullet(bullet);

    return bullet;
  } else {
    return CreateBullet(data, mpID)
  }
}

function uncoverBullet(bullet) {
  if (bullet.debugText) {
    bullet.debugText.setVisible(true);
  }

  if (bullet.shadow) {
    bullet.shadow.setVisible(true);
  }

  if (bullet.fairy) {
    bullet.fairy.setVisible(true);
  }

  bullet.sprite.setVisible(true);
}

export {CreateBullet, GetCacheBulletSprite}
