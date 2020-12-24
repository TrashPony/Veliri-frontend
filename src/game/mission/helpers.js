import {gameStore} from "../store";
import {Scene} from "../create";

function MissionHelpers(actionAction) {
  if (!gameStore.unitReady || !actionAction) return;

  if (!gameStore.missionHelpersCanvas) {
    gameStore.missionHelpersCanvas = Scene.add.graphics(0, 0);
    gameStore.missionHelpersCanvas.setDepth(2);
  }
  gameStore.missionHelpersCanvas.clear();

  if (actionAction.type_func_monitor === "build_or_time" || actionAction.type_func_monitor === "to_anomaly") {
    let circle = {x: actionAction.x, y: actionAction.y, radius: actionAction.radius};
    gameStore.missionHelpersCanvas.lineStyle(3, 0x00ff00, 0.5);
    gameStore.missionHelpersCanvas.fillStyle(0x00ff00, 0.01);
    gameStore.missionHelpersCanvas.strokeCircleShape(circle);
    gameStore.missionHelpersCanvas.fillCircleShape(circle);
  }
}

export {MissionHelpers}
