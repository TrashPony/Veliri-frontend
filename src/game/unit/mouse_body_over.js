import {Scene} from "../create";
import store from "../../store/store";
import {gameStore} from "../store";

let positionsInterval = {};
let checksTimeOut = {};

function mouseBodyOver(body, unit, unitBox) {
  let state = store.getters.getBattleState;
  if (state) {
    unitInfo(unit, unitBox, body);
  } else {
    body.on('pointerover', function () {
      unitInfo(unit, unitBox, body)
    }, this);

    body.on('pointerout', function () {
      unitRemoveInfo(unit, unitBox)
    }, this);
  }
}

function unitInfo(unit, unitBox, body) {
  // TODO сильное падение производительности из за того что позиция окна обновляется
  if (store.getters.getUser && store.getters.getUser.game_mode !== 'open_world') {
    return;
  }

  clearTimeout(checksTimeOut[unit.id]);
  checksTimeOut[unit.id] = null;

  if (document.getElementById("UserLabel" + unit.owner + unit.id) && positionsInterval[unit.id]) {
    return;
  }

  let pos = {
    left: Scene.cameras.main.zoom * (unitBox.x - Scene.cameras.main.worldView.x),
    top: Scene.cameras.main.zoom * (unitBox.y - Scene.cameras.main.worldView.y - 65),
  };

  store.commit({
    type: 'toggleWindow',
    id: "UserLabel" + unit.owner + unit.id,
    component: 'userLabel',
    meta: {
      ownerName: unit.owner,
      ownerID: unit.owner_id,
      unitID: unit.id,
      pos: pos,
    },
    forceOpen: true,
  });

  positionsInterval[unit.id] = setInterval(function () {

    if (!gameStore.units.hasOwnProperty(unit.id)) {
      clearInterval(positionsInterval[unit.id]);
    }

    pos.left = Scene.cameras.main.zoom * (unitBox.x - Scene.cameras.main.worldView.x);
    pos.top = Scene.cameras.main.zoom * (unitBox.y - Scene.cameras.main.worldView.y);
    if (!gameStore.units[unit.id]) {
      unitRemoveInfo(unit, unitBox, true);
    }
  }, 10);
}

function unitRemoveInfo(unit, unitBox, force) {

  function removeLabel() {
    store.commit({
      type: 'toggleWindow',
      id: "UserLabel" + unit.owner + unit.id,
      component: 'userLabel',
      forceClose: true,
    });

    clearInterval(positionsInterval[unit.id]);
    clearTimeout(checksTimeOut[unit.id]);
    checksTimeOut[unit.id] = null;
    positionsInterval[unit.id] = null;
  }

  if (force) {
    removeLabel()
  } else {
    if (!checksTimeOut[unit.id]) {
      checksTimeOut[unit.id] = setTimeout(function () {
        removeLabel()
      }, 2000);
    }
  }
}

export {mouseBodyOver, unitInfo, unitRemoveInfo}
