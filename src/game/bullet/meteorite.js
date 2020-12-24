import {Scene} from "../create";
import {gameStore} from "../store";
import {GetOffsetShadowByMapLvl, GetSpriteSizeByMapLvl} from "../map/height_offset";
import {checkTTL} from "./fly";
import {MoveSprite} from "../utils/move_sprite";

function FlyMeteorites(data, bullet, mpID) {
  if (!bullet.sprite) {
    bullet = CreateFireBullet(data, mpID);
    checkTTL(bullet, data);
    bullet.sprite.x = data.x;
    bullet.sprite.y = data.y;
  }

  bullet.ttl.time = data.ms * 4;

  MoveSprite(bullet.sprite, data.x, data.y, data.ms, null);
  bullet.emitter.setEmitterAngle({min: 180 + data.r, max: 180 + data.r});

  let shadowPos = GetOffsetShadowByMapLvl(data.z, data.x, data.y, 0, 2.5, mpID);
  MoveSprite(bullet.shadow, shadowPos.x, shadowPos.y, data.ms, null);

  bullet.shadow.emitter.setEmitterAngle({min: 180 + data.r, max: 180 + data.r});
  bullet.shadow.emitter.setScale({start: GetSpriteSizeByMapLvl(data.z, 1 / 5, 0.05).x, end: 0});
}

function CreateFireBullet(data, mpID) {

  if (data.n === "ballistics_artillery_bullet_2") {
    return createFireBullet(data, mpID)
  }

  if (data.t === "meteorite") {
    return createMeteorites(data, mpID)
  }
}

function createMeteorites(data, mpID) {

  let meteorite = gameStore.bullets[data.id]
  meteorite.sprite = Scene.add.particles('flares');

  meteorite.emitter = meteorite.sprite.createEmitter({
    frame: 'yellow',
    x: 0,
    y: 0,
    lifespan: 750,
    speed: {min: 100, max: 300},
    angle: {min: data.r - 5, max: data.r + 5},
    gravityY: 0,
    scale: {start: 0.4, end: 0},
    quantity: 2,
    blendMode: 'SCREEN',
    alpha: {start: 1, end: 0, ease: 'Quad.easeIn'},
  });

  meteorite.sprite.setDepth(data.z);

  meteorite.shadow = Scene.add.particles('flares');
  meteorite.shadow.emitter = meteorite.shadow.createEmitter({
    frame: 'yellow',
    x: 0,
    y: 0,
    lifespan: 750,
    speed: {min: 50, max: 150},
    angle: {min: data.r - 5, max: data.r + 5},
    gravityY: 0,
    scale: {start: 0.4, end: 0},
    quantity: 1,
    alpha: {start: 0.1, end: 0, ease: 'Quad.easeIn'},
  });

  meteorite.shadow.setDepth(data.z - 1);
  meteorite.shadow.emitter.setTint(0x000000);

  return meteorite
}

function createFireBullet(data, mpID) {

  let bullet = gameStore.bullets[data.id]
  bullet.sprite = Scene.add.particles('flares');

  bullet.emitter = bullet.sprite.createEmitter({
    frame: 'blue',
    x: 0,
    y: 0,
    lifespan: 750,
    speed: {min: 100, max: 500},
    angle: {min: data.r - 5, max: data.r + 5},
    gravityY: 0,
    scale: {start: 0.2, end: 0},
    quantity: 4,
    blendMode: 'SCREEN',
    alpha: {start: 1, end: 0, ease: 'Quad.easeIn'},
  });

  bullet.sprite.setDepth(data.z);

  bullet.shadow = Scene.add.particles('flares');
  bullet.shadow.emitter = bullet.shadow.createEmitter({
    frame: 'blue',
    x: 0,
    y: 0,
    lifespan: 750,
    speed: {min: 50, max: 250},
    angle: {min: data.r - 5, max: data.r + 5},
    gravityY: 0,
    scale: {start: 0.2, end: 0},
    quantity: 2,
    alpha: {start: 0.1, end: 0, ease: 'Quad.easeIn'},
  });

  bullet.shadow.setDepth(data.z - 1);
  bullet.shadow.emitter.setTint(0x000000);

  bullet.x = data.x;
  bullet.y = data.y;

  bullet.shadow.x = GetOffsetShadowByMapLvl(data.z, data.x, data.y, 0, 2.5, mpID).x;
  bullet.shadow.y = GetOffsetShadowByMapLvl(data.z, data.x, data.y, 0, 2.5, mpID).y;

  return bullet
}

export {FlyMeteorites}
