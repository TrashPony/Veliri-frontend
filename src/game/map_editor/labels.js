import {Scene} from "../create";
import {gameStore} from "../store";
import {GetGlobalPos} from "../map/gep_global_pos";

function CreateMapLabels(map, onlySector) {
  for (let i of map.handlers_coordinates) {
    let pos = GetGlobalPos(i.x, i.y, map.id);
    CreateLabels(i, pos.x, pos.y, onlySector)
  }

  CreateLabelEntry(map.entry_points)
}

function CreateLabels(coordinate, x, y, onlySector) {
  if (coordinate.coordinateText) {
    for (let text in coordinate.coordinateText) {
      coordinate.coordinateText[text].destroy();
    }
  } else {
    coordinate.coordinateText = {};
  }

  if (coordinate.transport && !onlySector) {
    let transportIcon = Scene.make.sprite({
      x: x,
      y: y,
      key: 'transportIcon',
      add: true
    });
    transportIcon.setOrigin(0.5);
    transportIcon.setScale(0.5);
    transportIcon.setDepth(1000);

    gameStore.mapEditorState.labels['transportIcon' + x + ":" + y] = transportIcon;
  }

  if (coordinate.handler === 'sector') {
    let transportIcon = Scene.make.sprite({
      x: x,
      y: y,
      key: 'sectorOutIcon',
      add: true
    });
    transportIcon.setOrigin(0.5);
    transportIcon.setScale(0.5);
    transportIcon.setDepth(1000);

    gameStore.mapEditorState.labels['sectorOutIcon' + x + ":" + y] = transportIcon;
  }

  if (coordinate.handler === 'base' && !onlySector) {
    let transportIcon = Scene.make.sprite({
      x: x,
      y: y,
      key: 'baseInIcon',
      add: true
    });
    transportIcon.setOrigin(0.5);
    transportIcon.setScale(0.3);
    transportIcon.setDepth(1000);

    gameStore.mapEditorState.labels['baseInIcon' + x + ":" + y] = transportIcon;
  }
}

function CreateLabelEntry(entryPoints) {

  for (let position of entryPoints) {

    let pos = GetGlobalPos(position.x, position.y, gameStore.map.id);

    let mapRest = Scene.make.sprite({
      x: pos.x,
      y: pos.y,
      key: 'baseResp',
      add: true
    });

    mapRest.setOrigin(0.5);
    mapRest.setScale(0.05);
    mapRest.setDepth(1000);
    mapRest.angle = position.resp_rotate;

    gameStore.mapEditorState.labels['baseResp' + pos.x + ":" + pos.y] = mapRest;
  }
}

function CreateLabelBase(bases) {
  let style = {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};

  for (let i in bases) {
    if (bases.hasOwnProperty(i)) {

      let pos = GetGlobalPos(bases[i].x, bases[i].y, gameStore.map.id);
      bases[i].x = pos.x;
      bases[i].y = pos.y;

      let base = Scene.make.sprite({
        x: bases[i].x,
        y: bases[i].y,
        key: 'baseIcon',
        add: true
      });
      base.setOrigin(0.5);
      base.setScale(0.1);
      base.setDepth(1000);
      gameStore.mapEditorState.labels['base' + bases[i].x + ":" + bases[i].y] = base;

      let text = Scene.add.text(bases[i].x + 20, bases[i].y - 20, "ID: " + bases[i].id, style);
      text.setShadow(2, 2, 'rgba(0,0,0,0.5)', 2);
      text.setDepth(1000);
      gameStore.mapEditorState.labels['baseID' + bases[i].x + ":" + bases[i].y] = text;

      for (let j in bases[i].respawns) {
        let respPount = bases[i].respawns[j];

        let pos = GetGlobalPos(respPount.x, respPount.y, gameStore.map.id);
        respPount.x = pos.x;
        respPount.y = pos.y;

        let baseResp = Scene.make.sprite({
          x: respPount.x,
          y: respPount.y,
          key: 'baseResp',
          add: true
        });

        baseResp.angle = respPount.resp_rotate;
        baseResp.setOrigin(0.5);
        baseResp.setScale(0.05);
        baseResp.setDepth(1000);
        gameStore.mapEditorState.labels['baseID' + respPount.x + ":" + respPount.y] = baseResp;
      }
    }
  }
}

export {CreateMapLabels, CreateLabelBase}
