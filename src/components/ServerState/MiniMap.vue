<template>
  <div class="can">
    <div class="back"></div>
    <canvas width="400" height="400" id="canvasMapStatic" ref="canvasMapStatic"/>
    <canvas width="400" height="400" id="canvasMap" ref="canvasMap" @mousedown="fastMove"/>
  </div>
</template>

<script>
/** из за того что передача параметро это очень дорогая операция пришлось создать копию компонента мини карты отдельно */
import {gameStore} from '../../game/store'
import {MapSize} from "../../game/map/createMap";

export default {
  name: "MiniMapCanvas",
  props: ['map', 'staticObjects', 'userID', 'userSquadID', 'units', 'bullets', 'GeoZones', 'objects', 'reservoirs',
    'boxes', 'evacuations', 'signals'],
  data() {
    return {
      offsetX: null,
      offsetY: null,
      radarMarks: {},
      mapScale: 2048, // размер карты при котором увелечение х1, следовательно 4096 будет х2
      scale: 1,
      mapId: 0,
    }
  },
  created() {
    let app = this;

    setInterval(function () {
      if (app.$props.map && app.$refs['canvasMapStatic']) {
        if (app.mapId !== app.$props.map.id) {
          app.createStaticMap()
        }
      }
    }, 1000)

    setInterval(function () {
      if (app.$props.map && app.$refs['canvasMap']) {
        let canvas = app.$refs['canvasMap'];
        let ctx = canvas.getContext("2d");

        let oldOffsetX = app.offsetX;
        let oldOffsetY = app.offsetY;

        app.offsetX = app.$props.map.XSize / canvas.width;
        app.offsetY = app.$props.map.YSize / canvas.height;

        if (oldOffsetX !== app.offsetX || oldOffsetY !== app.offsetY) {
          app.createStaticMap()
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        app.createMap(ctx);
      }
    }, 100)
  },
  computed: {
    missions() {
      return this.$store.getters.getMissions;
    },
    groupState() {
      return this.$store.getters.getGroupState;
    },
    distressSignals() {
      return this.$store.getters.getChatState.distressSignals
    },
    battleState() {
      return this.$store.getters.getBattleState
    },
  },
  methods: {
    fastMove() {

    },
    getObjectColorByUserID(userID) {
      if (userID === this.$props.userID) {
        return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#19ff00"}
      } else {
        if (this.groupState.members && this.groupState.members.hasOwnProperty(userID)) {
          return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#00aaff"}
        } else {
          if (this.battleState) {
            return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#ff0000"}
          } else {
            return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#ff7a00"}
          }
        }
      }
    },
    fillGeoData(ctx, geoPoint) {
      let app = this;
      app.createMapRing(ctx, geoPoint.x, geoPoint.y, geoPoint.radius, "rgba(255, 255, 255, 0)", "#000000")
    },
    createStaticMap() {
      let app = this;
      app.mapId = app.$props.map.id;
      app.scale = app.$props.map.XSize / app.mapScale

      let canvas = app.$refs['canvasMapStatic'];
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(125,125,125,0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      app.staticMap(ctx);
    },
    createMapRing(ctx, x, y, radius, strokeColor, fillColor, needScale) {

      let app = this;

      ctx.beginPath();
      if (fillColor) ctx.fillStyle = fillColor;
      if (strokeColor) ctx.strokeStyle = strokeColor;

      if (needScale) {
        radius = radius * app.scale;
      }

      ctx.ellipse(
        (x / app.offsetX),
        (y / app.offsetY),
        radius / app.offsetX,
        radius / app.offsetY,
        0, 0, 2 * Math.PI, true);

      if (fillColor) ctx.fill();
      if (strokeColor) ctx.stroke();
    },
    createMapRect(ctx, x, y, width, height, strokeColor, fillColor, center, needScale) {

      let app = this;

      if (fillColor) ctx.fillStyle = fillColor;
      if (strokeColor) ctx.strokeStyle = strokeColor;

      if (needScale) {
        width = width * app.scale;
        height = height * app.scale;
      }

      width = width / app.offsetX;
      height = height / app.offsetY;

      if (center) {
        if (fillColor) ctx.fillRect((x / app.offsetX) - width / 2, (y / app.offsetY) - height / 2, width, height);
        if (strokeColor) ctx.strokeRect((x / app.offsetX) - width / 2, (y / app.offsetY) - height / 2, width, height);
      } else {
        if (fillColor) ctx.fillRect((x / app.offsetX), (y / app.offsetY), width, height);
        if (strokeColor) ctx.strokeRect((x / app.offsetX), (y / app.offsetY), width, height);
      }
    },
    createMapRhombus(ctx, x, y, width, height, strokeColor, fillColor, needScale) {
      let app = this;

      if (fillColor) ctx.fillStyle = fillColor;
      if (strokeColor) ctx.strokeStyle = strokeColor;

      if (needScale) {
        width = width * app.scale;
        height = height * app.scale;
      }

      width = width / app.offsetX;
      height = height / app.offsetY;

      x = x / app.offsetX;
      y = y / app.offsetY;

      ctx.beginPath();
      ctx.moveTo(x - width / 2, y);
      ctx.lineTo(x, y + height / 2);
      ctx.lineTo(x + width / 2, y);
      ctx.lineTo(x, y - height / 2);
      ctx.lineTo(x - width / 2, y);
      ctx.closePath();

      if (fillColor) ctx.fill();
      if (strokeColor) ctx.stroke();
    },
    createMapTriangle(ctx, x, y, width, height, strokeColor, fillColor, needScale) {
      let app = this;

      if (fillColor) ctx.fillStyle = fillColor;
      if (strokeColor) ctx.strokeStyle = strokeColor;

      if (needScale) {
        width = width * app.scale;
        height = height * app.scale;
      }

      width = width / app.offsetX;
      height = height / app.offsetY;

      x = x / app.offsetX;
      y = y / app.offsetY;

      ctx.beginPath();
      ctx.moveTo(x, y + height / 2);
      ctx.lineTo(x - width / 2, y + height / 2);
      ctx.lineTo(x, y - height / 2);
      ctx.lineTo(x + width / 2, y + height / 2);
      ctx.lineTo(x, y + height / 2);
      ctx.closePath();

      if (fillColor) ctx.fill();
      if (strokeColor) ctx.stroke();
    },
    staticMap(ctx) {
      let app = this;

      for (let i in app.$props.map.geo_data) {
        let obstacle = app.$props.map.geo_data[i];
        if (obstacle) {
          app.fillGeoData(ctx, obstacle)
        }
      }

      for (let i in app.$props.staticObjects) {
        let obj = app.$props.staticObjects[i];
        if (obj && obj.geo_data && obj.geo_data.length > 0) {
          for (let j in obj.geo_data) {
            let obstacle = obj.geo_data[j];
            app.fillGeoData(ctx, obstacle)
          }
        }
      }

      if (app.battleState) {
        if (app.battleState.type === "battle" && app.battleState.sub_type === 0) {
          for (let i in app.battleState.teams) {
            let team = app.battleState.teams[i];
            app.createMapRing(ctx, team.spawn.x, team.spawn.y, team.spawn.radius, "rgb(4,255,87)", "rgba(7,255,114,0.3)")
          }
        } else {
          if (app.battleState.type === "battle" && app.battleState.sub_type === 1) {
            let base = app.battleState.bases[0];
            app.createMapRing(ctx, base.x, base.y, base.radius, "rgb(4,255,87)", "rgba(7,255,114,0.3)")
          } else {
            for (let i in app.battleState.bases) {
              let base = app.battleState.bases[i];
              app.createMapRing(ctx, base.x, base.y, base.radius, "rgb(4,255,87)", "rgba(7,255,114,0.3)")
            }
          }
        }
      }
    },
    createMap(ctx) {
      let app = this;

      // туман войны
      let userUnit = app.$props.units[app.$props.userSquadID];

      // линии радара
      if (userUnit && userUnit.sprite) {
        if (userUnit.body.range_radar > 0) {
          app.createMapRing(ctx, userUnit.x, userUnit.y, userUnit.body.range_radar, "rgba(0, 0, 255, 0.5)", null)
        }
      }

      // линии радара обьектов
      for (let i in app.$props.objects) {
        let obj = app.$props.objects[i];
        if (obj && (obj.owner_id === app.$props.userID || (app.groupState.members.hasOwnProperty(obj.owner_id))) && obj.range_radar > 0) {
          app.createMapRing(ctx, obj.x, obj.y, obj.range_radar, "rgba(0, 0, 255, 0.5)", null)
        }
      }

      // // линии радара отряда
      //   for (let i in app.groupState.members) {
      //     if (app.$props.userSquadID === app.groupState.state[i].unit_id) continue;
      //
      //     let unit = app.$props.units[app.groupState.state[i].unit_id];
      //
      //     if (unit && app.groupState.state[i].rr > 0) {
      //       ctx.beginPath();
      //       ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
      //       ctx.ellipse(unit.x / app.offsetX, (unit.y / app.offsetY) - 2,
      //         app.groupState.state[i].rr / app.offsetX, app.groupState.state[i].rr / app.offsetY,
      //         0, 0, 2 * Math.PI, true);
      //       ctx.stroke();
      //     }
      //   }

      for (let i in app.$props.objects) {
        let obj = app.$props.objects[i];
        if (obj && obj.geo_data && obj.geo_data.length > 0) {

          if (obj.build) {
            let {strokeColor, fillColor} = app.getObjectColorByUserID(obj.owner_id)
            app.createMapRect(ctx, obj.x, obj.y, 50, 50, strokeColor, fillColor, true, true)
          } else {
            for (let j in obj.geo_data) {
              app.fillGeoData(ctx, obj.geo_data[j])
            }
          }
        }
      }

      for (let i in app.$props.map.handlers_coordinates) {
        let outSector = app.$props.map.handlers_coordinates[i];
        if (outSector.handler === "sector") {
          // TODO стрелочка тут будет уместнее
          app.createMapRing(ctx, outSector.x, outSector.y, 60, "#00fff5", "rgba(0, 155, 0, 1)", true)
        }
      }

      for (let i in app.$props.map.entry_points) {
        for (let j in app.$props.map.entry_points[i].positions) {
          let position = app.$props.map.entry_points[i].positions[j];
          app.createMapRing(ctx, position.x, position.y, 30, "#00fff9", "rgba(155, 155, 0, 1)", true)
        }
      }

      for (let id in app.$props.units) {
        let unit = app.$props.units[id]
        let size = (unit.body.width + unit.body.height) / 1.5;
        let {strokeColor, fillColor} = app.getObjectColorByUserID(unit.owner_id)
        app.createMapRhombus(ctx, unit.x, unit.y, size * 2, size * 3, strokeColor, fillColor, true);
      }

      for (let id in app.$props.reservoirs) {
        let reservoir = app.$props.reservoirs[id];
        if (reservoir) {
          app.createMapRing(ctx, reservoir.x, reservoir.y, 25, "#000000", "#ffd700", true)
        }
      }

      for (let id in app.$props.boxes) {
        let box = app.$props.boxes[id];
        if (box) {
          app.createMapRing(ctx, box.x, box.y, 25, "#000000", "#bdff00", true)
        }
      }

      for (let i in app.$props.evacuations) {
        let evacuation = app.$props.evacuations[i];
        app.createMapTriangle(ctx, evacuation.x, evacuation.y, 70, 70, "rgb(0, 0, 0)", "#ff7a00", true);
      }

      // летящие пули
      for (let i in app.$props.bullets) {
        let bullet = app.$props.bullets[i];
        if (bullet && app.$props.bullets.hasOwnProperty(i)) {
          app.createMapRing(ctx, bullet.x, bullet.y, 15, "#7c6d17", "#ffd700", true)
        }
      }

      // сигналы бегствия
      for (let i in app.$props.signals) {
        let signal = app.$props.signals[i];

        if (!signal.hasOwnProperty('radius') || signal.radius > 3) {
          signal.radius = 1;
        } else {
          signal.radius++;
        }

        app.createMapRing(ctx, signal.x, signal.y, signal.radius * 8, "rgb(255,8,2)", "rgba(255,0,28,0.5)", true)
      }
    }
  }
}
</script>

<style scoped>
#canvasMap {
  height: 100%;
  width: 100%;
  position: relative;
}

#canvasMapStatic {
  height: 100%;
  width: 100%;
  position: absolute;
}

#canvasFog {
  height: 100%;
  width: 100%;
  position: absolute;
}

.back {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: grey;
}

.can {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
