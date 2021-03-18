import {CreateMark, HideMark, RemoveMark, UnhideMark} from './marks'
import {CreateRadarObject, RemoveRadarObject} from './object'
import {UpdateObject} from "./update_objects";

function RadarWork(events) {
  // если обьект создается то метка не нужна
  for (let event of events) {

    if (event.am === "createRadarMark" && event.ao !== "createObj") {
      CreateMark(event.rm.uuid, event.rm.type, event.x, event.y)
    }

    if (event.am === "removeRadarMark") {
      RemoveMark(event.rm.uuid)
    }

    if (event.am === "hideRadarMark") {
      HideMark(event.rm.uuid)
    }

    if (event.am === "unhideRadarMark") {
      UnhideMark(event.rm.uuid, event.rm.type, event.x, event.y)
    }

    if (event.ao === "createObj") {
      CreateRadarObject(event.rm, event.o)
    }

    if (event.ao === "updateObj") {
      UpdateObject(event.rm, event.o)
    }

    if (event.ao === "removeObj") {
      RemoveRadarObject(event.rm)
    }
  }
}

export {RadarWork}
