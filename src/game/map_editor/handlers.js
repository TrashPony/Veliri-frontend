import {Scene} from "../create";
import {gameStore} from "../store";
import store from "../../store/store";
import {CreateSelectSprite} from "./create_select_sprite";
import {MapSize} from "../map/createMap";

//{"x":0,"y":0,"resp_rotate":0}
let handlersPos = [];

function AddHandler() {

  let transportIcon = Scene.make.sprite({
    x: 9,
    y: 9,
    key: 'baseInIcon',
    add: true
  });

  transportIcon.setOrigin(0.5);
  transportIcon.setScale(0.5);
  transportIcon.setDepth(1000);
  transportIcon.setInteractive();

  setInterval(function () {
    transportIcon.x = Math.round(Scene.input.mousePointer.worldX);
    transportIcon.y = Math.round(Scene.input.mousePointer.worldY);
  }, 10);

  transportIcon.on('pointerdown', function (pointer) {
    if (pointer.leftButtonDown()) {
      let x = Math.round(Scene.input.mousePointer.worldX) - MapSize;
      let y = Math.round(Scene.input.mousePointer.worldY) - MapSize;
      changeHandlerOption(x, y)
    }
    transportIcon.destroy();
  });
}

function changeHandlerOption(x, y) {
  if (document.getElementById("handlerBlockOption")) document.getElementById("handlerBlockOption").remove();

  let handlerBlockOption = document.createElement("div");
  handlerBlockOption.id = "handlerBlockOption";

  let typeSelect = document.createElement("select");
  typeSelect.id = "typeSelect";
  typeSelect.innerHTML = "" +
    "<option value disabled selected> Выберите тип перехода </option>" +
    "<option value='base'>Base</option>" +
    "<option value='sector'>Sector</option>";

  let baseSelect = document.createElement("select");
  baseSelect.id = "baseSelect";
  baseSelect.style.opacity = 0;
  baseSelect.innerHTML = "<option value disabled selected> Выберите базу </option>";
  for (let i in gameStore.bases) {
    baseSelect.innerHTML += "<option value='" + gameStore.bases[i].id + "'> " + gameStore.bases[i].name + "(" + gameStore.bases[i].id + ")" + " </option>"
  }

  let mapOptions = document.getElementById("mapSelector").innerHTML;
  let mapSelect = document.createElement("select");
  mapSelect.style.opacity = 0;
  mapSelect.id = "mapSelect";
  mapSelect.innerHTML = mapOptions;

  let position = document.createElement("div");
  position.style.opacity = 0;
  position.appendChild(PositionsReader(null));

  let apply = document.createElement("input");
  apply.value = "Отменить";
  apply.type = "submit";
  apply.onclick = function () {
    if (document.getElementById('typeSelect').value === 'base') {
      store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: "addHandler",
        id: gameStore.mapEditorState.mpID,
        x: Number(x),
        y: Number(y),
        to_base_id: Number(document.getElementById('baseSelect').value),
        type_handler: document.getElementById('typeSelect').value,
      }));
    } else if (document.getElementById('typeSelect').value === 'sector') {
      store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: "addHandler",
        id: gameStore.mapEditorState.mpID,
        x: Number(x),
        y: Number(y),
        to_pos: JSON.stringify(handlersPos),
        to_map_id: Number(document.getElementById('mapSelect').value),
        type_handler: document.getElementById('typeSelect').value,
      }));
    }
    handlersPos = [];
    handlerBlockOption.remove();
  };

  typeSelect.onchange = function () {
    if (this.value === "base") {
      apply.value = "Применить";
      position.style.opacity = 0;
      mapSelect.style.opacity = 0;
      baseSelect.style.opacity = 1;
    } else if (this.value === "sector") {
      apply.value = "Применить";
      position.style.opacity = 1;
      mapSelect.style.opacity = 1;
      baseSelect.style.opacity = 0;
    } else {
      apply.value = "отменить";
    }
  };

  handlerBlockOption.appendChild(typeSelect);
  handlerBlockOption.appendChild(baseSelect);
  handlerBlockOption.appendChild(mapSelect);
  handlerBlockOption.appendChild(position);
  handlerBlockOption.appendChild(apply);
  document.getElementById("coordinates").appendChild(handlerBlockOption);
}

function EditPos() {
  let callBack = function (x, y) {
    let handlerBlockOption = document.createElement("div");
    handlerBlockOption.id = "handlerBlockOption";

    let mapOptions = document.getElementById("mapSelector").innerHTML;
    let mapSelect = document.createElement("select");
    mapSelect.id = "mapSelect";
    mapSelect.innerHTML = mapOptions;
    mapSelect.value = gameStore.map.OneLayerMap[x][y].to_map_id;

    let position = document.createElement("div");
    position.appendChild(PositionsReader(gameStore.map.OneLayerMap[x][y].positions));

    let apply = document.createElement("input");
    apply.value = "Применить";
    apply.type = "submit";
    apply.onclick = function () {
      store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
        event: "addHandler",
        id: gameStore.mapEditorState.mpID,
        x: Number(x),
        y: Number(y),
        to_pos: JSON.stringify(handlersPos),
        to_map_id: Number(document.getElementById('mapSelect').value),
        type_handler: "sector",
      }));
      handlersPos = [];
      handlerBlockOption.remove();
    };

    handlerBlockOption.appendChild(mapSelect);
    handlerBlockOption.appendChild(position);
    handlerBlockOption.appendChild(apply);
    document.getElementById("coordinates").appendChild(handlerBlockOption);
  };
  SelectedHandlers(callBack, "sector")
}

function PositionsReader(old) {

  let pos = document.getElementById("posTable");
  if (!pos) {
    pos = document.createElement("table");
    pos.id = "posTable";
  }

  pos.innerHTML = `
        <tr>
            <td>X</td>
            <td>Y</td>
            <td>Angle</td>
            <td></td>
        </tr>
    `;
  if (old) {
    handlersPos = old;

    for (let i in old) {
      pos.innerHTML += `
            <tr>
                <td>${old[i].x}</td>
                <td>${old[i].y}</td>
                <td>${old[i].resp_rotate}</td>
                <td><input id="pos${i}" type="button" value="X"></td>
            </tr>
            `;

      setTimeout(function () {
        $('#pos' + i).click(function () {
          removePosByID(i)
        })
      })
    }
  }

  pos.innerHTML += `
        <tr>
            <td><input id="posX" type="number" value="0" placeholder="X"></td>
            <td><input id="posY" type="number" value="0" placeholder="Y"></td>
            <td><input id="posA" type="number" value="0" placeholder="A"></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td><input id="AddPosButton" type="button" value="Добавить"></td>
            <td></td>
        </tr>
    `;

  setTimeout(function () {
    $('#AddPosButton').click(function () {
      handlersPos.push({
        x: Number($('#posX').val()),
        y: Number($('#posY').val()),
        resp_rotate: Number($('#posA').val()),
      });
      PositionsReader(handlersPos);
    });
  }, 300);

  return pos;
}

function removePosByID(i) {
  handlersPos.splice(Number(i), 1);
  PositionsReader(handlersPos);
}

function RemoveHandler() {
  let callBack = function (x, y) {
    store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
      event: "removeHandler",
      id: gameStore.mapEditorState.mpID,
      x: Number(x),
      y: Number(y)
    }));
  };
  SelectedHandlers(callBack)
}

function SelectedHandlers(callBack, type) {
  if (gameStore.gameReady) {
    let map = gameStore.map;
    for (let x in map.OneLayerMap) {
      for (let y in map.OneLayerMap[x]) {
        if (map.OneLayerMap[x][y].handler !== "") {
          if ((type && map.OneLayerMap[x][y].handler === type) || !type) {
            CreateSelectSprite(x, y, callBack, true);
          }
        }
      }
    }
  }
}

export {AddHandler, RemoveHandler, EditPos}
