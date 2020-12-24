import {gameStore} from "../store";
import {Scene} from "../create";
import {deleteBullet} from "../bullet/remove";
import {GetGlobalPos} from "../map/gep_global_pos";
import {PlayPositionSound} from "../sound/play_sound";

function ExplosionBullet(jsonData) {

  let bulletState = jsonData;
  let bullet = gameStore.bullets[bulletState.id];

  let pos = GetGlobalPos(bulletState.x, bulletState.y, bulletState.m);
  bulletState.x = pos.x;
  bulletState.y = pos.y;

  if (bulletState.t === "digger") {
    ExplosionRing(bulletState.x, bulletState.y, 250, bulletState.area_covers, bulletState.z);
    BlueExplosion(bulletState.x, bulletState.y, 500, 30, 50, 50, 0, 360, bulletState.z);
    SmokeExplosion(bulletState.x, bulletState.y, 1000, 20, 50, 50, 0, 360, bulletState.z);
    return
  }

  if (bullet) {
    deleteBullet(bullet, bulletState.id);
  }

  if (bulletState.t === "meteorite") {
    //PlayPositionSound(['explosion_1', 'explosion_2', 'explosion_3'], null, pos.x, pos.y);
    ExplosionRing(bulletState.x, bulletState.y, 250, bulletState.area_covers, bulletState.z);
    FireExplosion(bulletState.x, bulletState.y, 500, 15, 35, 125, 0, 360, bulletState.z);
    SmokeExplosion(bulletState.x, bulletState.y, 1000, 15, 20, 50, 0, 360, bulletState.z);
    return
  }

  if (bulletState.n === "big_missile_bullet" || bulletState.n === "aim_big_missile_bullet") {
    //PlayPositionSound(['explosion_1', 'explosion_2', 'explosion_3'], null, pos.x, pos.y);
    ExplosionRing(bulletState.x, bulletState.y, 250, bulletState.area_covers, bulletState.z);
    FireExplosion(bulletState.x, bulletState.y, 500, 4, 40, 25, 0, 360, bulletState.z);
    SmokeExplosion(bulletState.x, bulletState.y, 500, 4, 40, 25, 0, 360, bulletState.z);
    return
  }

  if (bulletState.n === "small_missile_bullet" || bulletState.n === "aim_small_missile_bullet") {
    //PlayPositionSound(['explosion_1', 'explosion_2', 'explosion_3'], null, pos.x, pos.y);
    ExplosionRing(bulletState.x, bulletState.y, 250, bulletState.area_covers, bulletState.z);
    FireExplosion(bulletState.x, bulletState.y, 500, 4, 25, 25, 0, 360, bulletState.z);
    SmokeExplosion(bulletState.x, bulletState.y, 500, 4, 25, 25, 0, 360, bulletState.z);
    return
  }

  if (bulletState.n === "piu-piu") {
    FireExplosion(bulletState.x, bulletState.y, 250, 15, 20, 10, 0, 360, bulletState.z);
    SmokeExplosion(bulletState.x, bulletState.y, 250, 15, 20, 10, 0, 360, bulletState.z);
    return;
  }

  if (bulletState.n === "piu-piu_2") {
    FireExplosion(bulletState.x, bulletState.y, 75, 2, 10, 1, 0, 360, bulletState.z);
    SmokeExplosion(bulletState.x, bulletState.y, 75, 1, 10, 1, 0, 360, bulletState.z);
    return;
  }

  if (bulletState.n === "ballistics_artillery_bullet") {
    //PlayPositionSound(['explosion_1', 'explosion_2', 'explosion_3'], null, pos.x, pos.y);
    ExplosionRing(bulletState.x, bulletState.y, 150, bulletState.area_covers, bulletState.z);
    FireExplosion(bulletState.x, bulletState.y, 500, 10, 30, 55, 0, 360, bulletState.z);
    SmokeExplosion(bulletState.x, bulletState.y, 1000, 10, 30, 35, 0, 360, bulletState.z);
    return
  }

  if (bulletState.n === "ballistics_artillery_bullet_2") {
    //PlayPositionSound(['explosion_1', 'explosion_2', 'explosion_3'], null, pos.x, pos.y);
    ExplosionRing(bulletState.x, bulletState.y, 250, bulletState.area_covers, bulletState.z);
    BlueExplosion(bulletState.x, bulletState.y, 500, 45, 50, 150, 0, 360, bulletState.z);
    SmokeExplosion(bulletState.x, bulletState.y, 1000, 30, 50, 150, 0, 360, bulletState.z);
  }

  SmokeExplosion(bulletState.x, bulletState.y, 1000, 20, 15, 15, 0, 360, bulletState.z);
}

function FireExplosion(x, y, time, count, scale, speed, minAngle, maxAngle, z) {
  Explosion(x, y, time, count, scale, ["yellow"], speed, minAngle, maxAngle, z, 'ADD')
}

function RedExplosion(x, y, time, count, scale, speed, minAngle, maxAngle, z) {
  Explosion(x, y, time, count, scale, ["red"], speed, minAngle, maxAngle, z, 'ADD')
}

function BlueExplosion(x, y, time, count, scale, speed, minAngle, maxAngle, z) {
  Explosion(x, y, time, count, scale, ["blue"], speed, minAngle, maxAngle, z, 'ADD')
}

function SmokeExplosion(x, y, time, count, scale, speed, minAngle, maxAngle, z) {
  Explosion(x, y, time, count, scale, ["smoke_puff"], speed, minAngle, maxAngle, z, 'SCREEN')
}

function ExplosionRing(x, y, time, radius, z) {

  let border = Scene.make.sprite({
    x: x,
    y: y,
    key: 'explosion_border',
    add: true
  });
  border.setOrigin(0.5);
  border.setDisplaySize(0, 0);
  border.setDepth(z);

  Scene.tweens.add({
    targets: border,
    props: {
      displayHeight: {value: radius * 3, duration: time, ease: 'Linear'},
      displayWidth: {value: radius * 3, duration: time, ease: 'Linear'},
    },
    repeat: 0,
  });

  Scene.tweens.add({
    targets: border,
    props: {
      alpha: {value: 0, duration: time, ease: 'Linear'},
    },
    delayTime: time,
    repeat: 0,
  });

  setInterval(function () {
    border.destroy()
  }, time)
}

function Explosion(x, y, time, count, scale, type, speed, minAngle, maxAngle, z, blendMode) {

  let explosion = Scene.add.particles('flares');
  let emitter = explosion.createEmitter({
    frame: type,
    x: x,
    y: y,
    gravityY: 0,
    speed: {min: 0, max: speed},
    scale: {start: scale / 50, end: scale / 100},
    angle: {min: minAngle, max: maxAngle},
    alpha: {start: 1, end: 0, ease: 'Quad.easeIn'},
    lifespan: {min: time / 2, max: time},
  });

  if (z < 0) z = 1;
  explosion.setDepth(z);

  if (blendMode) emitter.setBlendMode(blendMode);

  emitter.setQuantity(count);
  emitter.explode();

  setTimeout(function () {
    explosion.destroy();
  }, time)
}

export {ExplosionBullet, FireExplosion, RedExplosion, BlueExplosion, SmokeExplosion, ExplosionRing, Explosion}
