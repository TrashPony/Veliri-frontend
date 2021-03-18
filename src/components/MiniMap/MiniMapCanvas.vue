<template>
  <div class="can">
    <div class="back"></div>
    <canvas width="200" height="200" id="canvasFog" ref="canvasFog"/>
    <canvas width="200" height="200" id="canvasMapStatic" ref="canvasMapStatic"/>
    <canvas width="200" height="200" id="canvasMap" ref="canvasMap"
            @mousemove="fastMove($event)"
            @mouseup="moveCamera = false"
            @mouseout="moveCamera = false"
            @mousedown="fastMove($event, true)"/>
  </div>
</template>

<script>
import {gameStore} from '../../game/store'
import {Scene} from '../../game/create'
import {GetGlobalPos} from "../../game/map/gep_global_pos";
import {MapSize} from "../../game/map/createMap";

export default {
  name: "MiniMapCanvas",
  data() {
    return {
      offsetX: null,
      offsetY: null,
      radarMarks: {},
      mapScale: 2048, // размер карты при котором увелечение х1, следовательно 4096 будет х2
      scale: 1,
      map: 0,
      staticObjCount: 0,
      moveCamera: false,
      updaters: {
        static: null,
        other: null,
      }
    }
  },
  destroyed() {
    this.map = 0;
    if (this.updaters.static) clearInterval(this.updaters.static)
    if (this.updaters.other) clearInterval(this.updaters.other)
  },
  created() {
    let app = this;
    app.updaters.static = setInterval(function () {
      if (gameStore.map && gameStore.mapsState[gameStore.map.id].staticObjects.length > 0 && Scene && app.$refs['canvasMapStatic']) {
        if (app.map !== gameStore.map.id || gameStore.mapsState[gameStore.map.id].staticObjects.length !== app.staticObjCount) {
          app.createStaticMap()
        }
      }
    }, 1000);

    app.updaters.other = setInterval(function () {
      if (gameStore.map && Scene && Scene.cameras && app.$refs['canvasMap']) {
        let canvas = app.$refs['canvasMap'];
        let ctx = canvas.getContext("2d");

        let oldOffsetX = app.offsetX;
        let oldOffsetY = app.offsetY;

        app.offsetX = gameStore.map.XSize / canvas.width;
        app.offsetY = gameStore.map.YSize / canvas.height;

        if (oldOffsetX !== app.offsetX || oldOffsetY !== app.offsetY) {
          app.createStaticMap()
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        app.createMap(ctx);

        let canvasFog = app.$refs['canvasFog'];
        let ctx2 = canvasFog.getContext("2d");
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        app.fog(ctx2);
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
    getGlobalTarget() {
      let target = this.$store.getters.getGlobalTarget;
      let currentSector = this.$store.getters.getSectorState.id;

      if (target) {
        if (gameStore.bases) {
          for (let i in gameStore.bases) {
            if (Number(i) === Number(target.baseID)) {
              return gameStore.bases[i];
            }
          }
        }

        if (target.points) {
          for (let p of target.points) {
            if (p.map_id === currentSector) return p;
          }
        }

        if (target.mapID === currentSector) {
          return null
        } else {
          this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
            event: "MoveToSector",
            map_id: Number(target.mapID),
            base_id: Number(target.baseID),
            type: 'target',
          }));
        }
      }

      return null
    },
  },
  methods: {
    fastMove(e, on) {

      if (on) this.moveCamera = true;

      if (this.moveCamera) {
        let x = e.offsetX * this.offsetX;
        let y = e.offsetY * this.offsetY;

        let pos = GetGlobalPos(x, y, gameStore.map.id);

        Scene.cameras.main.stopFollow();
        Scene.cameras.main.centerOn(pos.x, pos.y);
      }
    },
    getObjectColorByUserID(userID, fraction) {
      if (gameStore.user && userID === gameStore.user.id) {
        return {strokeColor: "rgb(0,0,0)", fillColor: "#19ff00"}
      } else {
        if (this.groupState.members && this.groupState.members.hasOwnProperty(userID)) {
          return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#00ff1c"}
        } else {
          if (this.battleState) {
            return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#ff0000"}
          } else {
            if (fraction) {
              if (fraction === 'Replics') return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#ee7015"}
              if (fraction === 'Reverses') return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#659DFF"}
              if (fraction === 'Explores') return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#7aba00"}
              if (fraction === 'APD') return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#d7bc09"}
            } else {
              return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#ffffff"}
            }
          }
        }
      }

      return {strokeColor: "rgba(0, 0, 0, 0.7)", fillColor: "#ffffff"}
    },
    fillGeoData(ctx, geoPoint) {
      let app = this;
      app.createMapRing(ctx, geoPoint.x, geoPoint.y, geoPoint.radius, "rgba(255, 255, 255, 0)", "#000000")
    },
    createStaticMap() {
      let app = this;
      app.map = gameStore.map.id;
      app.staticObjCount = gameStore.mapsState[gameStore.map.id].staticObjects.length;
      app.scale = gameStore.map.XSize / app.mapScale

      let canvas = app.$refs['canvasMapStatic'];
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      app.staticMap(ctx);
    },
    createMapText(ctx, x, y, strokeColor, fillColor, text) {
      let app = this;

      if (fillColor) ctx.fillStyle = fillColor;
      if (strokeColor) ctx.strokeStyle = strokeColor;

      let textSize = 18
      x = (x / app.offsetX);
      y = (y / app.offsetY);

      ctx.textBaseline = 'middle';
      ctx.textAlign = "center";

      ctx.font = "bold " + textSize + "px Arial";
      ctx.lineWidth = 2;

      if (strokeColor) ctx.strokeText(text, x, y);
      if (fillColor) ctx.fillText(text, x, y);
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

      for (let i in gameStore.map.geo_data) {
        let obstacle = gameStore.map.geo_data[i];
        if (obstacle) {
          app.fillGeoData(ctx, obstacle)
        }
      }

      for (let i in gameStore.mapsState[gameStore.map.id].staticObjects) {
        let obj = gameStore.mapsState[gameStore.map.id].staticObjects[i];
        if (obj && obj.geo_data && obj.geo_data.length > 0) {
          for (let j in obj.geo_data) {
            let obstacle = obj.geo_data[j];
            app.fillGeoData(ctx, obstacle)
          }
        }

        // if (obj.type === "roads") {
        //   app.createMapRing(ctx, obj.x, obj.y, 15, null, "rgb(11,110,103)")
        // }
      }

      if (app.battleState) {

        ctx.font = "48px serif";

        if (app.battleState.type === "battle" && app.battleState.sub_type === 0) {

          for (let i in app.battleState.teams) {
            let team = app.battleState.teams[i];
            app.createMapRing(ctx, team.spawn.x, team.spawn.y, team.spawn.radius, "rgb(4,255,87)", "rgba(7,255,114,0.3)")
            app.createMapText(ctx, team.spawn.x, team.spawn.y, "rgba(0,0,0)", "rgb(255,255,255)", team.spawn.name);
          }

        } else {
          if (app.battleState.type === "battle" && app.battleState.sub_type === 1) {
            let base = app.battleState.bases[0];
            app.createMapRing(ctx, base.x, base.y, base.radius, "rgb(4,255,87)", "rgba(7,255,114,0.3)")
            app.createMapText(ctx, base.x, base.y, "rgba(0,0,0)", "rgb(255,255,255)", base.name);
          } else {
            for (let i in app.battleState.bases) {
              let base = app.battleState.bases[i];
              app.createMapRing(ctx, base.x, base.y, base.radius, "rgb(4,255,87)", "rgba(7,255,114,0.3)")
              app.createMapText(ctx, base.x, base.y, "rgba(0,0,0)", "rgb(255,255,255)", base.name);
            }
          }
        }
      }
    },
    fog(ctx) {
      let openFogColor = "rgb(255,255,255)"

      let app = this;
      // туман войны
      let userUnit = gameStore.units[gameStore.user_squad_id];
      if (userUnit && userUnit.sprite) {
        app.createMapRing(ctx, userUnit.x, userUnit.y, userUnit.body.range_view, openFogColor, openFogColor)
      }

      // дальность обьектов
      for (let i in gameStore.objects) {
        let obj = gameStore.objects[i];

        if (!gameStore.user) continue;

        if (obj && obj.work && (obj.owner_id === gameStore.user.id || (app.groupState && app.groupState.members && app.groupState.members.hasOwnProperty(obj.owner_id)) && obj.range_view > 0)) {
          app.createMapRing(ctx, obj.x, obj.y, obj.range_view, openFogColor, openFogColor)
        }
      }

      // туман войны группы
      if (app.groupState.members) {
        for (let i in app.groupState.members) {

          if (!app.groupState.state[i]) continue;
          if (gameStore.user_squad_id === app.groupState.state[i].u_id) continue;

          let unit = gameStore.units[app.groupState.state[i].u_id];

          if (unit && app.groupState.state[i].rv > 0) {
            app.createMapRing(ctx, unit.x, unit.y, app.groupState.state[i].rv, openFogColor, openFogColor)
          }
        }
      }
    },
    createMap(ctx) {
      let app = this;

      // туман войны
      let userUnit = gameStore.units[gameStore.user_squad_id];

      if (app.getGlobalTarget && userUnit && userUnit.sprite) {
        ctx.beginPath();
        ctx.strokeStyle = "#ffb700";
        ctx.lineWidth = 3
        ctx.moveTo(userUnit.x / app.offsetX, userUnit.y / app.offsetY);
        ctx.lineTo(app.getGlobalTarget.x / app.offsetX, app.getGlobalTarget.y / app.offsetY);
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      // линии радара
      if (userUnit && userUnit.sprite) {
        if (userUnit.body.range_radar > 0) {
          app.createMapRing(ctx, userUnit.x, userUnit.y, userUnit.body.range_radar, "rgba(0, 0, 255, 0.5)", null)
        }
      }

      // линии радара обьектов
      for (let i in gameStore.objects) {
        let obj = gameStore.objects[i];

        if (!gameStore.user) continue;

        if (obj && (obj.owner_id === gameStore.user.id || (app.groupState && app.groupState.members && app.groupState.members.hasOwnProperty(obj.owner_id))) && obj.range_radar > 0) {
          app.createMapRing(ctx, obj.x, obj.y, obj.range_radar, "rgba(0, 0, 255, 0.5)", null)
        }
      }

      // // линии радара отряда
      // if (app.groupState.members) {
      //   for (let i in app.groupState.members) {
      //     if (gameStore.user_squad_id === app.groupState.state[i].unit_id) continue;
      //
      //     let unit = gameStore.units[app.groupState.state[i].unit_id];
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
      // }

      for (let i in gameStore.objects) {
        let obj = gameStore.objects[i];
        if (obj && obj.geo_data && obj.geo_data.length > 0) {

          if (obj.build) {
            let {strokeColor, fillColor} = app.getObjectColorByUserID(obj.owner_id, obj.fraction)
            app.createMapRect(ctx, obj.x, obj.y, 50, 50, strokeColor, fillColor, true, true)
          } else {
            for (let j in obj.geo_data) {
              app.fillGeoData(ctx, obj.geo_data[j])
            }
          }
        }
      }

      for (let i in gameStore.map.handlers_coordinates) {
        let outSector = gameStore.map.handlers_coordinates[i];
        if (outSector.handler === "sector") {
          // TODO стрелочка тут будет уместнее
          app.createMapRing(ctx, outSector.x, outSector.y, 60, "#00fff5", "rgba(0, 155, 0, 1)", true)
        }
      }

      for (let i in gameStore.map.entry_points) {
        let position = gameStore.map.entry_points[i];
        app.createMapRing(ctx, position.x, position.y, 30, "#00fff9", "rgba(155, 155, 0, 1)", true)
      }

      for (let id in gameStore.units) {
        if (gameStore.units[id].sprite) {

          let unit = gameStore.units[id]
          let size = (unit.body.width + unit.body.height) / 1.5;

          let {strokeColor, fillColor} = app.getObjectColorByUserID(unit.owner_id, unit.of)
          app.createMapRhombus(ctx, unit.x, unit.y, size * 2, size * 3, strokeColor, fillColor, true);

          if (unit.owner_id === gameStore.user.id) {
            if (unit.moveTo) {
              ctx.beginPath();
              ctx.strokeStyle = "#00fcff";
              ctx.moveTo(unit.x / app.offsetX - 1, unit.y / app.offsetY - 1);
              ctx.lineTo(unit.moveTo.x / app.offsetX - 1, unit.moveTo.y / app.offsetY - 1);
              ctx.stroke();
            }
          }
        }
      }

      for (let id in gameStore.reservoirs) {
        let reservoir = gameStore.reservoirs[id];
        if (reservoir) {
          app.createMapRing(ctx, reservoir.x, reservoir.y, 25, "#000000", "#ffd700", true)
        }
      }

      for (let id in gameStore.boxes) {
        let box = gameStore.boxes[id];
        if (box) {
          app.createMapRing(ctx, box.sprite.x - MapSize, box.sprite.y - MapSize, 25, "#000000", "#bdff00", true)
        }
      }

      for (let i in gameStore.bases) {
        let base = gameStore.bases[i]
        app.createMapRing(ctx, base.x, base.y, 40, "rgb(0, 0, 0)", "rgb(0, 243, 255)")
        app.createMapRing(ctx, base.x, base.y, base.gravity_radius, "rgba(0, 243, 255, 0.5)", "rgba(0, 243, 255, 0.1)")

        if (base.type === 'base' && !gameStore.map.possible_battle && !gameStore.map.free_land) {
          if (userUnit && userUnit.sprite && Phaser.Math.Distance.Between(userUnit.sprite.x - MapSize, userUnit.sprite.y - MapSize, base.x, base.y) < base.gravity_radius) {
            app.$store.commit({
              type: 'setSecureZone',
              secure: true,
            });
          } else {
            app.$store.commit({
              type: 'setSecureZone',
              secure: false,
            });
          }
        }
      }

      for (let i in gameStore.evacuations) {
        let evacuation = gameStore.evacuations[i];
        let {strokeColor, fillColor} = app.getObjectColorByUserID(null, evacuation.transportState.fraction)
        app.createMapTriangle(ctx, evacuation.x - MapSize, evacuation.y - MapSize, 70, 70, strokeColor, fillColor, true);
      }

      for (let uuid in gameStore.radar_marks) {

        let mark = gameStore.radar_marks[uuid];
        if (mark && mark.sprite && mark.sprite.visible) {

          let markColor = "#d0d0d0";

          if (mark.type === 'fly') {
            app.createMapTriangle(ctx, mark.sprite.x - MapSize, mark.sprite.y - MapSize, 70, 70, "rgb(0, 0, 0)", markColor, true);
            continue;
          }

          if (mark.type === 'ground') {
            app.createMapRhombus(ctx, mark.sprite.x - MapSize, mark.sprite.y - MapSize, 50, 70, "rgb(0, 0, 0)", markColor, true);
            continue;
          }

          if (mark.type === 'structure') {
            app.createMapRect(ctx, mark.sprite.x - MapSize, mark.sprite.y - MapSize, 50, 50, "rgb(0, 0, 0)", markColor, true, true)
            continue;
          }

          if (mark.type === "bullet") continue;

          if (!app.radarMarks[mark.type]) {

            let markImg = new Image();

            markImg.addEventListener("load", function () {
              app.radarMarks[mark.type] = markImg;
            });

            markImg.src = require('../../assets/radar/' + mark.type + ".png");

          } else {

            let size = 96 * app.scale;
            ctx.drawImage(app.radarMarks[mark.type],
              ((mark.sprite.x - MapSize) / app.offsetX) - (size / app.offsetX) / 2,
              ((mark.sprite.y - MapSize) / app.offsetY) - (size / app.offsetY) / 2,
              size / app.offsetX,
              size / app.offsetY);
          }
        }
      }

      if (app.missions.helper) {
        let ms = gameStore.units[gameStore.user_squad_id];
        if (ms && ms.sprite) {
          ctx.beginPath();
          ctx.strokeStyle = "#00ff03";
          ctx.moveTo(ms.x / app.offsetX, ms.y / app.offsetY);
          ctx.lineTo(app.missions.helper.x / app.offsetX, app.missions.helper.y / app.offsetY);
          ctx.stroke();

          app.createMapRing(ctx, app.missions.helper.x, app.missions.helper.y, app.missions.helper.radius,
            "rgba(0, 255, 0, 0.5)", "rgba(0, 255, 0, 0.1)")
        }
      }

      // летящие пули
      for (let i in gameStore.bullets) {
        let bullet = gameStore.bullets[i];
        if (bullet && bullet.sprite && gameStore.bullets.hasOwnProperty(i)) {
          app.createMapRing(ctx, bullet.sprite.x - MapSize, bullet.sprite.y - MapSize, 15, "#7c6d17", "#ffd700", true)
        }
      }

      // сигналы бегствия
      for (let i in app.distressSignals) {
        let signal = app.distressSignals[i];

        if (!signal.hasOwnProperty('radius') || signal.radius > 3) {
          signal.radius = 1;
        } else {
          signal.radius++;
        }

        app.createMapRing(ctx, signal.x, signal.y, signal.radius * 8, "rgb(255,8,2)", "rgba(255,0,28,0.5)", true)
      }

      for (let i in app.missions.points) {
        let point = app.missions.points[i];

        if (!point.hasOwnProperty('radius') || point.radius > 3) {
          point.radius = 1;
        } else {
          point.radius++;
        }

        app.createMapRing(ctx, point.x, point.y, point.radius * 8, "rgb(4,255,87)", "rgba(7,255,114,0.3)")
      }

      if (Scene && Scene.cameras.main) {
        app.createMapRect(
          ctx,
          Scene.cameras.main.worldView.x - MapSize,
          Scene.cameras.main.worldView.y - MapSize,
          Scene.cameras.main.worldView.width,
          Scene.cameras.main.worldView.height,
          "#fffc1f",
          null,
        )
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
