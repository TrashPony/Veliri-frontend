import store from "../../store/store";
import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";

function HitItem(count, item, x, y, uuid, mapID) {

  function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
  }

  let pos = GetGlobalPos(x, y, mapID);
  x = pos.x;
  y = pos.y;

  x += randomInt(-15, 15);
  y += randomInt(-15, 15);

  let meta = {
    item: item,
    count: count,
    pos: {
      left: Scene.cameras.main.zoom * (x - Scene.cameras.main.worldView.x),
      top: Scene.cameras.main.zoom * (y - Scene.cameras.main.worldView.y),
      alpha: 1,
    }
  };

  store.commit({
    type: 'toggleWindow',
    id: uuid,
    component: 'HitItem',
    meta: meta,
    forceOpen: true,
  });

  let time = 1;
  let timeInterval = 10;

  let posUpdater = setInterval(function () {
    time += timeInterval;

    if (time < 1000) {
      meta.pos.left = Scene.cameras.main.zoom * (x - Scene.cameras.main.worldView.x);
      meta.pos.top = (Scene.cameras.main.zoom * (y - Scene.cameras.main.worldView.y)) - ((time / 1000) * 100);
    }

    if (time > 500) {
      meta.pos.alpha = 1 - ((time - 500) / 750);
    }

    if (time > 1250) {
      store.commit({
        type: 'toggleWindow',
        id: uuid,
        forceClose: true,
      });
      clearInterval(posUpdater);
    }

  }, timeInterval);
}

export {HitItem}
