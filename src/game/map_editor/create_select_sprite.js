import {Scene} from "../create";
import {gameStore} from "../store";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MapSize} from "../map/createMap";

function CreateSelectSprite(x, y, callBack, notDestroyOnClick) {

  let pos = GetGlobalPos(Number(x), Number(y), gameStore.map.id);
  x = pos.x;
  y = pos.y;

  let selectedSprite = Scene.make.sprite({
    x: x,
    y: y,
    key: 'mapEditor',
    add: true
  });

  selectedSprite.setOrigin(0.5);
  selectedSprite.setScale(0.5);
  selectedSprite.setDepth(1000);
  selectedSprite.setAlpha(0.6);
  selectedSprite.setInteractive({
    pixelPerfect: true,
    alphaTolerance: 1
  });

  selectedSprite.on('pointerdown', function (pointer) {
    if (pointer.leftButtonDown()) {
      callBack(x - MapSize, y - MapSize);
    }
    if (!notDestroyOnClick || pointer.rightButtonDown()) {
      destroyAllSelectedSprite();
    }
  });

  gameStore.mapEditorState.selectSprites[x + ":" + y] = selectedSprite;
}

function destroyAllSelectedSprite() {
  for (let i in gameStore.mapEditorState.selectSprites) {
    if (gameStore.mapEditorState.selectSprites.hasOwnProperty(i)) {
      gameStore.mapEditorState.selectSprites[i].destroy();
      delete gameStore.mapEditorState.selectSprites[i];
    }
  }

  for (let i in gameStore.mapEditorState.metaText) {
    if (gameStore.mapEditorState.metaText.hasOwnProperty(i)) {
      gameStore.mapEditorState.metaText[i].destroy();
      delete gameStore.mapEditorState.metaText[i];
    }
  }
}

export {CreateSelectSprite, destroyAllSelectedSprite}
