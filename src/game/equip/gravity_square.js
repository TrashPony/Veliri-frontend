import {Scene} from "../create";
import {GetGlobalPos} from "../map/gep_global_pos";
import {gameStore} from "../store";

function GravitySquareWork(data) {
  let pos = GetGlobalPos(data.x, data.y, gameStore.map.id);

  let shape1 = new Phaser.Geom.Circle(0, 0, data.r);

  let particles = Scene.add.particles('flares');
  particles.setPosition(pos.x, pos.y);
  particles.setDepth(50);
  particles.emitter = particles.createEmitter({
    frame: 'blue',
    speed: 20,
    lifespan: 2000,
    quantity: 1,
    scale: {start: 0.5, end: 2},
    alpha: {start: 0.15, end: 0},
    blendMode: 'SCREEN',
    moveToX: {min: 0, max: 0},
    moveToY: {min: 0, max: 0},
    emitZone: {type: 'random', source: shape1}
  });

  setTimeout(function () {
    particles.emitter.stop();
    setTimeout(function () {
      particles.destroy();
    }, 2000)
  }, 64)
}

export {GravitySquareWork}
