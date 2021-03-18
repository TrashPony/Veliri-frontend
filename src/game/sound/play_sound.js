import {Scene} from "../create";
import store from "../../store/store";

function PlayPositionSound(sounds, params, x, y) {
  let dist = Phaser.Math.Distance.Between(Scene.cameras.main.worldView.x + Scene.cameras.main.worldView.width / 2, Scene.cameras.main.worldView.y + Scene.cameras.main.worldView.height / 2, x, y);
  let percent = 100 - ((dist / (Scene.cameras.main.worldView.width / 2)) * 100);

  if (percent < 0) {
    return;
  }

  if (percent + 30 > 100) {
    percent = 100;
  } else {
    percent = percent + 30;
  }
  if (!params) params = {};
  params.volume = percent / 100 * store.getters.getSettings.SFXVolume;

  let sound = Scene.sound.add(sounds[getRandomInt(sounds.length)]);
  sound.on('complete', function () {
    sound.destroy();
  });
  sound.play(params);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export {PlayPositionSound}
