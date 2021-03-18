import {gameStore} from "../store";
import {GetGlobalPos} from "../map/gep_global_pos";
import {Scene} from "../create";
import {MoveSprite} from "../utils/move_sprite";
import {ShortDirectionRotateTween} from "../utils/utils";
import store from "../../store/store";

function CreateMapItems(data) {

  if (!gameStore.gameReady) return;

  let oldItem = gameStore.mapItems[data.id];
  if (oldItem) return;

  let pos = GetGlobalPos(data.x, data.y, data.map_id);
  data.x = pos.x;
  data.y = pos.y;

  let spriteName = data.slot.item.name;
  if (data.slot.type === "blueprints") {
    if (data.slot.item.in_map) {
      spriteName = "blueprint_in_map"
    } else {
      spriteName = "blueprint"
    }
  }

  let shadow = Scene.make.sprite({
    x: data.x + 1,
    y: data.y + 1,
    key: "items",
    frame: spriteName,
    add: true
  });

  shadow.setOrigin(0.5);

  if (data.slot.type === "body" || data.slot.type === "equip") {
    shadow.setDisplaySize(data.radius * 4, data.radius * 4)
  } else {
    shadow.setDisplaySize(data.radius * 2, data.radius * 2)
  }

  shadow.setAngle(data.rotate);
  shadow.setAlpha(0.4);
  shadow.setTint(0x000000);
  data.shadow = shadow;
  shadow.setDepth(2);

  let item = Scene.make.sprite({
    x: data.x,
    y: data.y,
    key: "items",
    frame: spriteName,
    add: true
  });

  item.setOrigin(0.5);

  if (data.slot.type === "body" || data.slot.type === "equip") {
    item.setDisplaySize(data.radius * 4, data.radius * 4)
  } else {
    item.setDisplaySize(data.radius * 2, data.radius * 2)
  }

  item.setAngle(data.rotate);
  item.setDepth(3);
  item.shadow = shadow;
  data.sprite = item;

  item.setInteractive({
    pixelPerfect: true,
    alphaTolerance: 1
  });

  item.on('pointerover', function (event) {
    store.commit({
      type: 'toggleWindow',
      id: 'reservoirTipMapItem' + data.id,
      component: 'reservoirTip',
      meta: {
        name: data.slot.item.name,
        description: `${data.slot.item.name}.`,
        count: data.slot.quantity,
        item: data.slot,
        pos: {
          left: Scene.cameras.main.zoom * (item.x - Scene.cameras.main.worldView.x + item.displayWidth * item.scale) + "px",
          top: Scene.cameras.main.zoom * (item.y - Scene.cameras.main.worldView.y - item.displayHeight * item.scale) + "px",
        }
      },
      forceOpen: true,
    });
  });

  item.on('pointerout', function (event) {
    store.commit({
      type: 'toggleWindow',
      id: 'reservoirTipMapItem' + data.id,
      component: 'reservoirTip',
      forceClose: true,
    });
  });

  item.on('pointerdown', function (pointer, gameObject) {
    store.getters.getWSByService('global').socket.send(JSON.stringify({
      event: "get_map_item",
      id: Number(data.id),
    }));
  });

  gameStore.mapItems[data.id] = data;
}

function ItemMove(path, id, mapID) {
  let item = gameStore.mapItems[id];
  if (item) {

    let pos = GetGlobalPos(path.x, path.y, mapID);
    path.x = pos.x;
    path.y = pos.y;

    MoveSprite(item.sprite, path.x, path.y, path.millisecond, null);
    MoveSprite(item.sprite.shadow, path.x + 1, path.y + 1,
      path.millisecond, null);

    ShortDirectionRotateTween(item.sprite, path.rotate, path.millisecond);
    ShortDirectionRotateTween(item.sprite.shadow, path.rotate, path.millisecond);
  }
}

function DestroyItem(id) {
  let item = gameStore.mapItems[id];
  if (item) {
    item.sprite.destroy();
    if (item.shadow) {
      item.shadow.destroy();
    }

    store.commit({
      type: 'toggleWindow',
      id: 'reservoirTipMapItem' + id,
      component: 'reservoirTip',
      forceClose: true,
    });

    delete gameStore.mapItems[id]
  }
}

export {CreateMapItems, ItemMove, DestroyItem}
