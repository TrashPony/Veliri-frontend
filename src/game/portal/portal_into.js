import {GetGlobalPos} from "../map/gep_global_pos";
import {gameStore} from "../store";
import {Scene} from "../create";

function PortalOut(data) {

  let radius = 128;

  let pos = GetGlobalPos(data.x, data.y, gameStore.map.id);
  let light = Scene.add.pointlight(pos.x, pos.y, 0, radius, 0.75);
  light.attenuation = 0.01
  light.setDepth(45)
  light.color.setTo(0, 255, 100);

  let lights = otherLight(pos.x, pos.y, radius, radius);
  let time = 0
  let timeInterval = 16;
  let allTime = 1000;

  let lightUpdate = setInterval(function () {

    time += timeInterval
    if (time < allTime / 2 + allTime / 4) {
      light.attenuation += 0.001;
      light.intensity += 0.02;
    }

    for (let l of lights) {
      Scene.tweens.add({
        targets: l,
        x: pos.x,
        y: pos.y,
        ease: 'Quad.easeOut',
        duration: allTime,
      });
    }

    if (time >= allTime / 2 + allTime / 4) {

      for (let l of lights) {
        Scene.tweens.add({
          targets: l,
          attenuation: 0,
          intensity: 0,
          ease: 'Quad.easeOut',
          duration: allTime - time,
        });
      }

      light.attenuation -= 0.004;
      light.intensity -= 0.04;
    }
  }, timeInterval)

  setTimeout(function () {

    for (let l of lights) {
      l.destroy();
    }

    clearInterval(lightUpdate)
    light.destroy()
  }, allTime)
}

function PortalInto(data) {

  let radius = 128;
  let unit = gameStore.units[data.id]
  if (unit) {
    radius = (unit.body.width + unit.body.height) * 1.5
  }

  let pos = GetGlobalPos(data.x, data.y, gameStore.map.id);
  let light = Scene.add.pointlight(pos.x, pos.y, 0, radius, 0.75);
  light.attenuation = 0.01
  light.setDepth(45)
  light.color.setTo(0, 255, 100);

  let lights = otherLight(pos.x, pos.y, radius, 0);
  let time = 0
  let timeInterval = 16;
  let allTime = 1000;

  let lightUpdate = setInterval(function () {

    time += timeInterval
    if (time < allTime / 2 - allTime / 4) {
      light.attenuation += 0.004;
      light.intensity += 0.035;
    }

    for (let l of lights) {
      if (!l.tween) l.tween = Scene.tweens.add({
        targets: l,
        x: pos.x + (Math.random() * radius * 2) - (Math.random() * radius * 2),
        y: pos.y + (Math.random() * radius * 2) - (Math.random() * radius * 2),
        ease: 'Quad.easeOut',
        duration: allTime,
      });
    }

    if (time >= allTime / 2 - allTime / 4) {

      for (let l of lights) {
        Scene.tweens.add({
          targets: l,
          attenuation: 0,
          intensity: 0,
          ease: 'Quad.easeOut',
          duration: allTime - time,
        });
      }

      light.attenuation -= 0.001;
      light.intensity -= 0.02;
    }
  }, timeInterval)

  setTimeout(function () {

    for (let l of lights) {
      l.destroy();
    }

    clearInterval(lightUpdate)
    light.destroy()
  }, allTime)
}

function otherLight(x, y, radius, maxDist) {

  let lights = [];

  for (let i = 0; i < 15; i++) {

    let lX = x + (Math.random() * maxDist) - (Math.random() * maxDist)
    let lY = y + (Math.random() * maxDist) - (Math.random() * maxDist)

    let light = Scene.add.pointlight(lX, lY, 0, radius / 10, 0.3)
    light.setDepth(45);
    light.attenuation = 0.1;
    light.color.setTo(0, 255, 100);
    lights.push(light)
  }

  return lights
}

export {PortalInto, PortalOut}
