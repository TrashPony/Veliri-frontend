<template>
  <div class="points_board" v-if="getPointsNotify">
    <div class="point" v-for="point in points">
      {{ point.text }} x{{ point.count }}
    </div>
  </div>
</template>

<script>
export default {
  name: "PointsBoard",
  data() {
    return {
      points: {},
    }
  },
  methods: {
    getName: function (pointType) {
      if (pointType === "destroy") return "Уничтожение";
      if (pointType === "damage_hostile") return "Повреждение";
      if (pointType === "damage_received") return "Получение урона";
      if (pointType === "assist_destroy") return "Помощь в уничтожение";
      if (pointType === "capture") return "Захват базы";
      if (pointType === "intelligence_damage") return "Урон по разведданным";
      if (pointType === "heal") return "Ремонт";
    }
  },
  computed: {
    getPointsNotify() {

      let app = this;
      let pointsNotify = app.$store.getters.getPointsNotify;

      while (pointsNotify.length > 0) {

        let notify = pointsNotify.shift();
        let key = notify.text;

        // Если у предыдущей позиции такой же тип нотифая то просто увеличиваем count и обнуляем таймер
        if (app.points.hasOwnProperty(key)) {
          clearTimeout(app.points[key].timer);
          app.points[key].count += notify.count;
          app.points[key].timer = setTimeout(function () {
            app.$delete(app.points, key)
          }, 3000)
        } else {
          app.points[key] = {
            count: notify.count,
            text: app.getName(notify.text),
            timer: setTimeout(function () {
              app.$delete(app.points, key)
            }, 3000)
          };
        }
      }

      return app.points
    }
  }
}
</script>

<style scoped>
.points_board {
  white-space: nowrap;
  pointer-events: none;
}

.point {
  margin-left: -50%;
  opacity: 0.6;
  color: white;
  font-size: 10px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}
</style>
