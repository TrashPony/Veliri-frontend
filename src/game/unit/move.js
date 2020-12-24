import {gameStore} from "../store";
import {HideMarkByTypeAndID} from "../radar/marks";
import {GetOffsetShadowByMapLvl, GetSpriteSizeByMapLvl} from "../map/height_offset";
import store from "../../store/store";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MoveSprite} from "../utils/move_sprite";
import {SetBodyAngle} from "./rotate";
import {Scene} from "../create";

//let oldTime = 0;

function AddUnitMoveBufferData(data) {
  if (!gameStore.unitReady) return;
  let unit = gameStore.units[data.id];

  if (unit) {
    if (!unit.bufferMoveTick) {
      unit.bufferMoveTick = [];
    }

    while (unit.bufferMoveTick.length > 5) {
      unit.bufferMoveTick.shift();
    }

    unit.bufferMoveTick.push(data);

    // показываем прошлый тик что бы компенсировать сетевые лаги
    if (!unit.updaterPos && unit.bufferMoveTick.length > 0) {
      unit.updaterPos = true;
    }
  }
}

function MoveTo(unit, ms) {

  if (!gameStore.units.hasOwnProperty(unit.id)) return;

  let path = unit.bufferMoveTick.shift();
  if (!path) {
    return;
  }

  unit.x = path.x;
  unit.y = path.y;

  let pos = GetGlobalPos(path.x, path.y, path.m);

  HideMarkByTypeAndID("unit", path.id);

  if (path.s !== 0 || path.av * 1000 !== 0) {

    if (path.id === gameStore.user_squad_id) {
      store.commit({
        type: 'setUnitSpeed',
        speed: path.s,
      });
    }

    let size = GetSpriteSizeByMapLvl(path.z, unit.body.scale / 100, 0.02).x;
    MoveSprite(unit.sprite, pos.x, pos.y, ms, size);

    if (path.sky) {
      if (path.z !== unit.sprite.depth) {
        unit.sprite.setDepth(path.z);
      }

      let shadowPos = GetOffsetShadowByMapLvl(path.z, pos.x, pos.y, 0, 2.5, path.m);
      let dist = Phaser.Math.Distance.Between(pos.x, pos.y, shadowPos.x, shadowPos.y);

      SetBodyAngle(unit, path.r, ms, true, dist * (1 / unit.sprite.scale));
    } else {
      if (35 !== unit.sprite.depth) {
        unit.sprite.setDepth(35);
      }
      SetBodyAngle(unit, path.r, ms, true, Scene.shadowXOffset * 3);
    }
  } else {
    if (path.id === gameStore.user_squad_id) {
      store.commit({
        type: 'setUnitSpeed',
        speed: 0,
      });
    }
  }

  unit.speedDirection = path.d;
  unit.speed = path.s;
  unit.angularVelocity = path.av * 1000;
  unit.animateSpeed = path.a;
  unit.rotate = path.r;

  AnimationMove(unit);
}

function AnimationMove(unit) {
  if (unit.speed && unit.speed > 0 && unit.animateSpeed) {

    unit.sprite.bodyBottomLeft.anims.resume();
    unit.sprite.bodyBottomRight.anims.resume();

    // направление гусей
    if (unit.speedDirection && !unit.sprite.bodyBottomLeft.anims.forward) {
      unit.sprite.bodyBottomLeft.anims.reverse()
    }
    if (!unit.speedDirection && unit.sprite.bodyBottomLeft.anims.forward) {
      unit.sprite.bodyBottomLeft.anims.reverse()
    }

    if (unit.speedDirection && !unit.sprite.bodyBottomRight.anims.forward) {
      unit.sprite.bodyBottomRight.anims.reverse()
    }
    if (!unit.speedDirection && unit.sprite.bodyBottomRight.anims.forward) {
      unit.sprite.bodyBottomRight.anims.reverse()
    }

    speedBody(unit.speed, unit.sprite.bodyBottomLeft.anims);
    speedBody(unit.speed, unit.sprite.bodyBottomRight.anims);

  } else {
    if (unit.angularVelocity !== 0) {

      unit.sprite.bodyBottomLeft.anims.resume();
      unit.sprite.bodyBottomRight.anims.resume();

      if (unit.angularVelocity > 0) {
        if (!unit.sprite.bodyBottomLeft.anims.forward) {
          unit.sprite.bodyBottomLeft.anims.reverse()
        }
        if (unit.sprite.bodyBottomRight.anims.forward) {
          unit.sprite.bodyBottomRight.anims.reverse()
        }
      } else {
        if (unit.sprite.bodyBottomLeft.anims.forward) {
          unit.sprite.bodyBottomLeft.anims.reverse()
        }
        if (!unit.sprite.bodyBottomRight.anims.forward) {
          unit.sprite.bodyBottomRight.anims.reverse()
        }
      }

      speedBody(unit.angularVelocity, unit.sprite.bodyBottomLeft.anims);
      speedBody(unit.angularVelocity, unit.sprite.bodyBottomRight.anims);
    } else {
      unit.sprite.bodyBottomLeft.anims.pause();
      unit.sprite.bodyBottomRight.anims.pause();
    }
  }
}

function speedBody(speed, anim) {

  if (speed < 10) {
    anim.msPerFrame = 110
  } else if (speed >= 10 && speed < 15) {
    anim.msPerFrame = 105
  } else if (speed >= 15 && speed < 20) {
    anim.msPerFrame = 100
  } else if (speed >= 20 && speed < 25) {
    anim.msPerFrame = 95
  } else if (speed >= 25 && speed < 30) {
    anim.msPerFrame = 90
  } else if (speed >= 30 && speed < 40) {
    anim.msPerFrame = 85
  } else if (speed >= 40 && speed < 50) {
    anim.msPerFrame = 80
  } else if (speed >= 50 && speed < 60) {
    anim.msPerFrame = 75
  } else if (speed >= 60 && speed < 70) {
    anim.msPerFrame = 70
  } else if (speed >= 70 && speed < 80) {
    anim.msPerFrame = 65
  } else if (speed >= 80 && speed < 90) {
    anim.msPerFrame = 40
  } else if (speed >= 90 && speed < 100) {
    anim.msPerFrame = 35
  } else if (speed >= 100 && speed < 110) {
    anim.msPerFrame = 30
  } else if (speed >= 110 && speed < 120) {
    anim.msPerFrame = 25
  } else if (speed >= 120 && speed < 130) {
    anim.msPerFrame = 20
  } else if (speed >= 130 && speed < 140) {
    anim.msPerFrame = 15
  } else if (speed >= 140) {
    anim.msPerFrame = 10
  }
}

export {MoveTo, MoveStop, AnimationMove, AddUnitMoveBufferData}
