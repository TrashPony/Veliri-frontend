import {selectObjects} from "./place_coordinate";
import store from "../../store/store";
import {gameStore} from "../store";
import {GetGlobalPos} from "../map/gep_global_pos";
import {MapSize} from "../map/createMap";
import {Scene} from "../create";

function OptionSprite() {
  let callBack = function (x, y) {
    ChangeOptionSprite(x, y)
  };
  selectObjects(callBack)
}

function ChangeOptionSprite(x, y) {
  let coordinate;

  for (let id in gameStore.mapsState[gameStore.map.id].staticObjects) {

    // let pos = GetGlobalPos(gameStore.mapsState[gameStore.map.id].staticObjects[id].x, gameStore.mapsState[gameStore.map.id].staticObjects[id].y, gameStore.map.id);
    // console.log(pos, x, y)
    if (gameStore.mapsState[gameStore.map.id].staticObjects[id].x === x && gameStore.mapsState[gameStore.map.id].staticObjects[id].y === y) {
      coordinate = gameStore.mapsState[gameStore.map.id].staticObjects[id]
    }
  }

  x = Number(x);
  y = Number(y);

  let block = document.getElementById("coordinates");
  if (document.getElementById("rotateBlock")) document.getElementById("rotateBlock").remove();
  let rotate = document.createElement("div");
  block.appendChild(rotate);

  let rotateSprite = coordinate.rotate;
  if (rotateSprite < 0) rotateSprite += 360;

  rotate.style.height = "420px";
  rotate.id = "rotateBlock";
  rotate.innerHTML = `
            <div><span> Кадров в сек: </span> <span id="speedOutput"> ${coordinate.animation_speed} </span></div>
            <input id="speedRange" value="${coordinate.animation_speed}" type="range" min="0" max="300" step="1">
            <div><span> Смещение Тени по Y: </span> <span id="YShadowOutput"> ${coordinate.y_shadow_offset} </span></div>
            <input id="rangeShadowYOffset"  value="${coordinate.y_shadow_offset}" type="range" min="-100" max="200" step="1">
            <div><span> Смещение Тени по Х: </span> <span id="XShadowOutput"> ${coordinate.x_shadow_offset} </span></div>
            <input id="rangeShadowXOffset" value="${coordinate.x_shadow_offset}" type="range" min="-100" max="200" step="1">
            <div><span> Интенсивность тени: </span> <span id="YShadowIOutput"> ${coordinate.shadow_intensity} </span></div>
            <input id="rangeShadowIntensity" value="${coordinate.shadow_intensity}" type="range" min="0" max="100" step="1">
            <div><span> Смещение по Y: </span> <span id="YOutput"> 0 </span></div>
            <input id="rangeYOffset" value="${coordinate.y_offset}" type="range" min="-100" max="100" step="1">
            <div><span> Смещение по Х: </span> <span id="XOutput"> 0 </span></div>
            <input id="rangeXOffset" value="${coordinate.x_offset}" type="range" min="-100" max="100" step="1">
            <div><span> Градусы: </span> <span id="rotateOutput"> ${rotateSprite} </span></div>
            <input id="rotateRange" value="${rotateSprite}" type="range" min="0" max="360" step="1">

            <div><span> Размер: </span> <span id="scaleOutput"> ${coordinate.scale} </span></div>
            <input id="scaleRange" value="${coordinate.scale}" type="range" min="0" max="200" step="1">

            <div><span> Тень: </span> <input type="checkbox" id="needShadow"></div>

            <input type="submit" value="Вперед" id="frontSprite">
            <input type="submit" value="Назад" id="backSprite">

            <br>
            <input type="submit" value="Применить" id="applyRotate">
            <input type="submit" value="Отменить" id="cancelRotate">

`;

  // TODO включение и отключение теней при изменение состояние чекбокса для теней

  // отправить спрайт на задний план
  $('#backSprite').click(function () {
    store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
      event: "toBack",
      id: gameStore.mapEditorState.mpID,
      x: Number(coordinate.x),
      y: Number(coordinate.y),
    }));

    rotate.remove();
  });

  $('#frontSprite').click(function () {
    store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
      event: "toFront",
      id: gameStore.mapEditorState.mpID,
      x: Number(coordinate.x),
      y: Number(coordinate.y),
    }));

    rotate.remove();
  });

  // Угол поворота
  $('#rotateRange').on('input', function () {
    $('#rotateOutput').text(this.value);
    coordinate.objectSprite.angle = this.value;
    if (coordinate.objectSprite.shadow) {
      coordinate.objectSprite.shadow.angle = this.value;
    }
  });

  // Размер
  $('#scaleRange').on('input', function () {
    $('#scaleOutput').text(this.value);
    coordinate.objectSprite.setScale(this.value / 100);
    if (coordinate.objectSprite.shadow) {
      coordinate.objectSprite.shadow.setScale(this.value / 100);
    }
  });

  // Скорость анимации
  $('#speedRange').on('input', function () {
    $('#speedOutput').text(this.value);
    coordinate.objectSprite.animations.getAnimation('objAnimate').stop();
    coordinate.objectSprite.animations.play('objAnimate', Number(this.value), true);
    if (coordinate.objectSprite.shadow) {
      coordinate.objectSprite.shadow.animations.getAnimation('objAnimate').stop();
      coordinate.objectSprite.shadow.animations.play('objAnimate', Number(this.value), true);
    }
  });

  // Сдвиг по Х
  $('#rangeXOffset').on('input', function () {
    $('#XOutput').text(this.value);

    let pos = GetGlobalPos(Number(x), Number(y), gameStore.map.id);

    coordinate.objectSprite.x = pos.x + Number(this.value);
    if (coordinate.objectSprite.shadow) {
      coordinate.objectSprite.shadow.x = pos.x + Scene.shadowXOffset + Number($('#rangeShadowXOffset').val()) + Number($('#rangeXOffset').val());
    }
  });

  // Сдвиг по У
  $('#rangeYOffset').on('input', function () {
    $('#YOutput').text(this.value);

    let pos = GetGlobalPos(Number(x), Number(y), gameStore.map.id);
    coordinate.objectSprite.y = pos.y + Number(this.value);

    if (coordinate.objectSprite.shadow) {
      coordinate.objectSprite.shadow.y = pos.y + Scene.shadowYOffset + Number($('#rangeShadowYOffset').val()) + Number($('#rangeYOffset').val());
    }
  });


  // Тень
  $('#needShadow').prop('checked', coordinate.shadow);
  // Сдвиг тени по Х
  $('#rangeShadowXOffset').on('input', function () {

    let pos = GetGlobalPos(Number(x), Number(y), gameStore.map.id);
    $('#XShadowOutput').text(this.value);
    coordinate.objectSprite.shadow.x = pos.x + Scene.shadowXOffset + Number($('#rangeShadowXOffset').val()) + Number($('#rangeXOffset').val());
  });

  // Сдвиг тени по Y
  $('#rangeShadowYOffset').on('input', function () {

    let pos = GetGlobalPos(Number(x), Number(y), gameStore.map.id);
    $('#YShadowOutput').text(this.value);
    coordinate.objectSprite.shadow.y = pos.y + Scene.shadowYOffset + Number($('#rangeShadowYOffset').val()) + Number($('#rangeYOffset').val());
  });

  // Интенсивность тени
  $('#rangeShadowIntensity').on('input', function () {
    $('#YShadowIOutput').text(this.value);
    coordinate.objectSprite.shadow.alpha = Number(rangeShadowIntensity.value) / 100;
  });

  $('#applyRotate').click(function () {
    let speed = 0;
    if (document.getElementById("speedRange")) {
      speed = Number(document.getElementById("speedRange").value);
    }

    store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
      event: "rotateObject",
      id: gameStore.mapEditorState.mpID,
      x: Number(coordinate.x),
      y: Number(coordinate.y),
      rotate: Number(document.getElementById("rotateRange").value),
      speed: speed,
      x_offset: Number(document.getElementById("rangeXOffset").value),
      y_offset: Number(document.getElementById("rangeYOffset").value),
      x_shadow_offset: Number(document.getElementById("rangeShadowXOffset").value),
      y_shadow_offset: Number(document.getElementById("rangeShadowYOffset").value),
      shadow_intensity: Number(document.getElementById("rangeShadowIntensity").value),
      scale: Number(document.getElementById("scaleRange").value),
      shadow: $('#needShadow').prop('checked'),
    }));

    rotate.remove();

    store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
      event: "SelectMap",
      id: gameStore.mapEditorState.mpID,
    }));
  });

  $('#cancelRotate').click(function () {
    store.getters.getWSByService('map_editor').socket.send(JSON.stringify({
      event: "SelectMap",
      id: gameStore.mapEditorState.mpID,
    }));
    rotate.remove();
  });
}

export {OptionSprite}
