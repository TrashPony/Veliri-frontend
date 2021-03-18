import {gameObjectCreate} from "./objects";
import {Scene} from "../create";
import {gameStore} from "../store";
import store from "../../store/store";

function CreateReservoir(reservoir) {

  reservoir.sprite = gameObjectCreate(reservoir.x, reservoir.y, reservoir.texture, reservoir.scale * 4,
    reservoir.shadow, reservoir.rotate, Scene.floorObjectLayer, Scene.shadowXOffset / 2, Scene.shadowYOffset / 2,
    40, true, null, 'resource', Scene, reservoir.map_id);

  gameStore.reservoirs[reservoir.id] = reservoir;

  if (reservoir.sprite) {
    reservoir.sprite.setDepth(reservoir.height);
    if (reservoir.sprite.shadow) reservoir.sprite.setDepth(reservoir.height - 1);
  }

  reservoir.sprite.setInteractive({
    pixelPerfect: true,
    alphaTolerance: 1
  });

  reservoir.sprite.on('pointerover', function () {

    store.commit({
      type: 'toggleWindow',
      id: 'reservoirTip' + reservoir.x + "" + reservoir.y,
      component: 'reservoirTip',
      meta: {
        name: reservoir.name,
        description: `Залежи минерала ${reservoir.name}. Лежат тут, никто их не трогает...`,
        count: reservoir.count,
        item: {type: 'resource', item: {name: reservoir.name}},
        pos: {
          left: Scene.cameras.main.zoom * (reservoir.sprite.x - Scene.cameras.main.worldView.x + reservoir.sprite.displayWidth * reservoir.sprite.scale) + "px",
          top: Scene.cameras.main.zoom * (reservoir.sprite.y - Scene.cameras.main.worldView.y - reservoir.sprite.displayHeight * reservoir.sprite.scale) + "px",
        }
      },
      forceOpen: true,
    });
  });

  reservoir.sprite.on('pointerout', function () {
    store.commit({
      type: 'toggleWindow',
      id: 'reservoirTip' + reservoir.x + "" + reservoir.y,
      component: 'reservoirTip',
      forceClose: true,
    });
  });
}

export {CreateReservoir}
