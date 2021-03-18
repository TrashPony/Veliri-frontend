import {GrabCamera} from './interface/grabCamera'
import {FocusMS, FocusUnit} from './interface/focus_unit'
import {UpdateFogBack, UpdateObjectFog, UpdateUnitFog} from './interface/fog_of_war'
import {CreateAllMaps, MapSize} from './map/createMap'
import {gameStore} from './store'
import {UpdateShieldObjectPos, UpdateShieldUnitPos} from "./shield/shield";
import store from '../store/store'
import {ClearBars, UpdatePosBars} from "./interface/status_layer"
import {Scene} from "./create";
import {DisableObj} from "./map/structures/no_complete_structure";
import {MoveTo} from "./unit/move";
import {FreeMoveEvacuation} from "./evacuation/move";
import {DroneTo} from "./drone/fly";
import {FlyBullet} from "./bullet/fly";
import {colorName} from "./unit/unit";

let connect = null;
let groupState = null;
let visibleSquad = false;

function gameInit(scene) {
  if (!gameStore.gameDataInit.sendRequest) {
    let ws = store.getters.getWSByService('global')
    if (ws && ws.connect) {
      gameStore.gameDataInit.sendRequest = true;
      ws.socket.send(JSON.stringify({
        event: "InitGame"
      }));
    }
  }

  if (gameStore.reload || !gameStore.gameDataInit.data) return;
  if (!gameStore.gameReady) {

    if (!gameStore.mapEditor) {
      connect = store.getters.getWSByService('global');
      groupState = store.getters.getGroupState;

      store.commit({
        type: 'setVisibleLoader',
        visible: true,
        text: 'Строим карту...'
      });
    }

    // todo ксотыль без которого карта при переходе из сектра в сектор артефачит
    if (!gameStore.mapDrawing) {
      gameStore.mapDrawing = true;
      setTimeout(function () {
        CreateAllMaps(scene);
        gameStore.gameReady = true;
        gameStore.mapDrawing = false;
      })
    }

    if (!gameStore.mapEditor) {
      connect.socket.send(JSON.stringify({
        event: "StartLoad"
      }));

      store.commit({
        type: 'setVisibleLoader',
        visible: true,
        text: 'Ищем транспорт...'
      });
    }
  }
}

function update() {

  gameInit(this)

  if (!gameStore.gameReady) return;

  GrabCamera(this); // функцуия для перетаскивания карты мышкой /* Магия */

  if (gameStore.mapEditor) {
    if (gameStore.mapEditorState.placeObj) {
      if (this.wasd.left.isDown) {
        gameStore.mapEditorState.placeObj.angle++;
      } else if (this.wasd.right.isDown) {
        gameStore.mapEditorState.placeObj.angle--;
      }
    }
  }

  if (!connect || !connect.connect) return;

  if (!gameStore.unitReady) {
    let unit = gameStore.units[gameStore.user_squad_id];
    if (unit) {
      setUnitReady(unit.id)
    }
  }

  if (!gameStore.unitReady && store.getters.getGameRole === "Spectrum") {
    if (document.getElementById("end_status")) {
      setUnitReady(gameStore.units[i].id)
    }

    for (let i in gameStore.units) {
      if (groupState.members.hasOwnProperty(gameStore.units[i].owner_id)) {
        setUnitReady(gameStore.units[i].id)
      }
    }
  }

  if (gameStore.unitReady) {
    connect.socket.send(JSON.stringify({
      event: "WASDMove",
      w: this.wasd.up.isDown,
      a: this.wasd.left.isDown,
      s: this.wasd.down.isDown,
      d: this.wasd.right.isDown,
    }));

    connect.socket.send(JSON.stringify({
      event: "MouseTarget",
      x: Math.round(this.game.input.mousePointer.worldX - MapSize),
      y: Math.round(this.game.input.mousePointer.worldY - MapSize),
      fire: this.game.input.activePointer.leftButtonDown() && !gameStore.HoldAttackMouse,
    }));
  }

  UpdateFogBack(this);

  if (!gameStore.units[gameStore.user_squad_id]) {
    visibleSquad = false;
  }

  if (!visibleSquad && gameStore.units[gameStore.user_squad_id]) {
    visibleSquad = true;
    FocusMS();
  }

  if (store.getters.getGameRole !== "Spectrum" || gameStore.units[gameStore.user_squad_id]) {
    UpdateUnitFog(this);
  } else {
    gameStore.FogOfWar.brush.setVisible(false);
  }

  moveObjects()

  for (let i in gameStore.units) {
    let unit = gameStore.units[i];

    if (!unit.sprite.moveTween || !unit.sprite.moveTween.isPlaying() || unit.bufferMoveTick.length > 1) {
      if (unit.updaterPos) MoveTo(unit, 64);
    }

    if (unit.sprite.userName) {
      if (unit.sprite.userName.login) unit.sprite.userName.login.setPosition(unit.sprite.x, unit.sprite.y - 27);
      if (unit.sprite.userName.pointer) unit.sprite.userName.pointer.setPosition(unit.sprite.x, unit.sprite.y - 20);
      if (unit.sprite.userName.detail) unit.sprite.userName.detail.setPosition(unit.sprite.x, unit.sprite.y - 35);
      if (unit.sprite.userName.pk) unit.sprite.userName.pk.setPosition(unit.sprite.x, unit.sprite.y - 35);
      colorName(unit)
    }

    if (unit.sprite.userMessage) {
      if (unit.sprite.userMessage.text) unit.sprite.userMessage.text.setPosition(unit.sprite.x, unit.sprite.y - 45);
    }

    if (unit.id !== gameStore.user_squad_id && groupState.members.hasOwnProperty(unit.owner_id) && groupState.state[unit.owner_id]) {
      UpdateObjectFog(this, unit, unit.sprite, "unit", groupState.state[unit.owner_id].rv);
    } else if (gameStore.FogOfWar.objBrush.unit[i]) {
      gameStore.FogOfWar.objBrush.unit[i].destroy();
      delete gameStore.FogOfWar.objBrush.unit[i];
    }


    if (unit.speed > 0) {
      UpdatePosBars(unit.sprite, unit.body.max_hp, unit.hp, 10, null, Scene, 'unit', unit.id, 'hp', 50);
    }

    UpdateShieldUnitPos(unit);

    if (unit.sprite.passUnitSelectSprite) {
      unit.sprite.passUnitSelectSprite.setPosition(unit.sprite.x, unit.sprite.y)
    }

    if (unit.sprite.noPassUnitSelectSprite) {
      unit.sprite.noPassUnitSelectSprite.setPosition(unit.sprite.x, unit.sprite.y)
    }
  }


  for (let i in gameStore.objects) {

    let obj = gameStore.objects[i];

    if (obj && obj.objectSprite && obj.hp > -2) {

      if (obj.owner_id === gameStore.user.id || (groupState.members.hasOwnProperty(obj.owner_id))) {

        if (obj.work) {
          UpdateObjectFog(this, obj, obj.objectSprite, "object", obj.range_view)
        }

      } else {
        if (obj.build) {

          if (gameStore.FogOfWar.objBrush.object[i]) {
            gameStore.FogOfWar.objBrush.object[i].destroy();
            delete gameStore.FogOfWar.objBrush.object[i];
          }

          let UserUnit = gameStore.units[gameStore.user_squad_id];
          if (UserUnit) {
            let dist = Phaser.Math.Distance.Between(UserUnit.sprite.x, UserUnit.sprite.y, obj.objectSprite.x, obj.objectSprite.y);
            if (dist > UserUnit.body.range_view) {
              DisableObj(obj)
            }
          }
        }
      }

      let shield = UpdateShieldObjectPos(obj);
      if (!shield) ClearBars('object', obj.id, 'shield');
    }
  }
}

function setUnitReady(focusUnit) {
  gameStore.unitReady = true;
  if (focusUnit) FocusUnit(focusUnit);
  store.commit({
    type: 'setVisibleLoader',
    visible: false,
  });

  setTimeout(function () {
    connect.socket.send(JSON.stringify({
      event: "loadComplete"
    }));
  }, 1000)
}

function moveObjects() {
  for (let i in gameStore.bullets) {
    let bullet = gameStore.bullets[i];
    if (bullet.bufferMoveTick.length > 0) {
      if (bullet.updaterPos) FlyBullet(bullet)
    }
  }

  for (let i in gameStore.drones) {
    let drone = gameStore.drones[i];
    if (!drone.moveTween || !drone.moveTween.isPlaying() || drone.bufferMoveTick.length > 1) {
      if (drone.updaterPos) DroneTo(drone, 64, i)
    }
  }

  for (let i in gameStore.evacuations) {
    let transport = gameStore.evacuations[i];
    if (!transport.moveTween || !transport.moveTween.isPlaying() || transport.bufferMoveTick.length > 1) {
      if (transport.updaterPos) FreeMoveEvacuation(transport, 64, i)
    }
  }
}

// function alphaObject(obj) {
//   // если под обьектом чето есть то делаем его прозрачным
//   console.log(obj)
//   if (UnitHeight > obj.depth) {
//     return
//   }
//
//   for (let i in gameStore.units) {
//     let unit = gameStore.units[i];
//   }
//
//   for (let i in gameStore.drones) {
//     let drone = gameStore.drones[i];
//   }
//
//   for (let i in gameStore.reservoirs) {
//     let reservoir = gameStore.reservoirs[i];
//   }
//
//   for (let i in gameStore.boxes) {
//     let box = gameStore.boxes[i];
//   }
// }

export {update}
