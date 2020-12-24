import {gameStore} from "../store";
import {Scene} from "../create";
import {GetOffsetShadowByMapLvl, GetSpriteSizeByMapLvl} from "../map/height_offset";
import {ShortDirectionRotateTween} from "../utils/utils";
import {SmokeExplosion} from "../weapon/explosion";
import {GetCacheBulletSprite} from "./create";
import {deleteBullet} from "./remove";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MoveSprite} from "../utils/move_sprite";
import {FlyMeteorites} from "./meteorite";

function AddBulletMoveBufferData(data) {
  if (!gameStore.unitReady) return;

  let bullet = gameStore.bullets[data.id];

  if (!bullet) {
    bullet = {}
    gameStore.bullets[data.id] = bullet;
  }

  let pos = GetGlobalPos(data.x, data.y, data.m);
  data.x = pos.x;
  data.y = pos.y;

  if (!bullet.bufferMoveTick) {
    bullet.bufferMoveTick = [];
  }
  bullet.bufferMoveTick.push(data);

  // показываем прошлый тик что бы компенсировать сетевые лаги
  if (!bullet.updaterPos && bullet.bufferMoveTick.length >= 0) {
    bullet.updaterPos = true;
  }
}

function FlyBullet(bullet) {

  let data = bullet.bufferMoveTick.shift();
  if (!data) {
    return;
  }

  if (data.t === "meteorite" || data.n === "ballistics_artillery_bullet_2") {
    FlyMeteorites(data, bullet, data.m);
    return
  }

  if (!bullet.sprite) {
    bullet = GetCacheBulletSprite(data, data.m);
    checkTTL(bullet, data)
  }
  bullet.ttl.time = data.ms * 4;

  let scale = GetSpriteSizeByMapLvl(data.z, 1 / 5, 0.05);
  MoveSprite(bullet.sprite, data.x, data.y, data.ms, scale.x);

  let shadowPos = GetOffsetShadowByMapLvl(data.z, data.x, data.y, 0, 2.5, data.m);
  MoveSprite(bullet.shadow, shadowPos.x, shadowPos.y, data.ms, scale.x);

  ShortDirectionRotateTween(bullet.sprite, data.r, data.ms);
  ShortDirectionRotateTween(bullet.shadow, data.r, data.ms);

  if (bullet.fairy) {
    MoveSprite(bullet.fairy, data.x, data.y, data.ms, null);
    bullet.fairy.emitter.setEmitterAngle({min: 180 + data.r, max: 180 + data.r});
  }
}

function FlyLaser(jsonData) {

  // TODO адаптировать под этот тип данных все методы
  if (!jsonData.msg) return;

  let laserName = jsonData.msg.name;
  let path = jsonData.msg.path_unit;
  // если игрок видит не весь путь луча
  path.x = jsonData.x;
  path.y = jsonData.y;

  let target = jsonData.msg.target;

  let pos = GetGlobalPos(path.x, path.y, jsonData.msg.map_id);
  path.x = pos.x;
  path.y = pos.y;

  let targetPos = GetGlobalPos(target.x, target.y, jsonData.msg.map_id);
  target.x = targetPos.x;
  target.y = targetPos.y;

  let color = ["blue"];
  let scale = 0.1;
  let quantity = 128;

  if (laserName === "small_lens") {
    color = ['red'];
  }
  if (laserName === "build") {
    color = ['yellow'];
    scale = 0.03;
    quantity = 32;
  }
  if (laserName === "missile_defense") {
    color = ['red'];
    scale = 0.03;
    quantity = 32;
  }
  if (laserName === "heal") {
    color = ['green'];
    scale = 0.03;
    quantity = 32;
  }
  if (laserName === "transport_block") {
    color = ['red', 'blue'];
  }

  let line = new Phaser.Geom.Line(path.x, path.y, target.x, target.y);
  let particles = Scene.add.particles('flares');
  let emiter = particles.createEmitter({
    frame: color,
    x: 0, y: 0,
    scale: {start: scale, end: 0},
    alpha: {start: 1, end: 0},
    speed: {min: -5, max: 5},
    quantity: quantity,
    emitZone: {source: line},
    blendMode: 'SCREEN',
    lifespan: 500,
  });
  particles.setDepth(40);

  SmokeExplosion(target.x, target.y, 500, 15, 5, 10, null, null, 40);
  setTimeout(function () {
    emiter.stop();
  }, 100);

  setTimeout(function () {
    particles.destroy();
  }, 600);
}

function checkTTL(bullet, data) {
  let timeCheck = data.ms;
  bullet.ttl = {
    inspector: setInterval(function () {

      if (bullet.ttl) {
        bullet.ttl.time -= timeCheck;
      }

      if (!bullet.ttl || bullet.ttl.time < 0 || !gameStore.bullets[data.id]) {
        deleteBullet(bullet, data.id)
      }

    }, timeCheck),
    time: data.ms * 4,
  };
}

export {FlyBullet, FlyLaser, checkTTL, AddBulletMoveBufferData}
