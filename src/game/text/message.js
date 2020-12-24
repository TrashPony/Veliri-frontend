import {gameStore} from "../store";
import {Scene} from "../create";
import store from "../../store/store";

// [id] {time, posObj}
let msgTimes = {};

function showMessage(msg) {

  if (!gameStore.unitReady) {
    return
  }

  let unit;
  for (let i in gameStore.units) {
    if (gameStore.units[i].owner_id === Number(msg.user_id)) {
      unit = gameStore.units[i];
    }
  }

  if (!unit) {
    return;
  }

  if (!msgTimes[msg.user_id]) {
    msgTimes[msg.user_id] = {
      time: 0,
      pos: {},
    }
  }

  updatePos(msgTimes[msg.user_id].pos, unit);

  store.commit({
    type: 'toggleWindow',
    id: "UserMsg" + msg.user_id,
    component: 'UserMsg',
    meta: {
      text: msg.message,
      pos: msgTimes[msg.user_id].pos,
    },
    forceOpen: true,
  });

  let timeInterval = 10;

  if (msgTimes[msg.user_id].time <= 0) {

    let posUpdater = setInterval(function () {
      msgTimes[msg.user_id].time -= timeInterval;

      updatePos(msgTimes[msg.user_id].pos, unit);

      if (msgTimes[msg.user_id].time <= 0 || !gameStore.units[unit.id]) {
        msgTimes[msg.user_id].time = 0;
        store.commit({
          type: 'toggleWindow',
          id: "UserMsg" + msg.user_id,
          component: 'UserMsg',
          forceClose: true,
        });
        clearInterval(posUpdater);
      }

    }, timeInterval);
  }

  msgTimes[msg.user_id].time = 2500;
}

function updatePos(pos, unit) {
  pos.left = Scene.cameras.main.zoom * (unit.sprite.x - Scene.cameras.main.worldView.x);
  pos.top = Scene.cameras.main.zoom * (unit.sprite.y - Scene.cameras.main.worldView.y - 35);
}

export {showMessage}
