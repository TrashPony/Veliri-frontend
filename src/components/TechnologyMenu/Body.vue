<template>
  <div class="wrapper" id="BodyWrapper" ref="BodyWrapper"
       :style="{height: (sizeGrid.y * gridCellSize) + 'px', width: (sizeGrid.x * gridCellSize) + 'px'}">

    <canvas id="BodyCanvas" ref="BodyCanvas"/>

    <div class="category"
         v-for="category in bodies[fraction].bodies"
         :style="{left: (category.pos.x * gridCellSize) - gridCellSize + 'px', top: (category.pos.y* gridCellSize) + 'px'}">
      <h4>{{ category.category }}</h4>

      <div class="bodies">
        <app-item-cell v-for="bodyID in category.ids" v-if="bodiesSlots[bodyID]"
                       v-bind:itemSlot="bodiesSlots[bodyID]"
                       v-bind:drag="false"
                       v-bind:showHP="false"
                       v-bind:noQuantity="true"
                       v-bind:size="(gridCellSize / 3) - 10"
                       @click.native="openSubMenu($event, bodiesSlots[bodyID])"/>

      </div>
    </div>

  </div>
</template>

<script>
import urls from '../../const';
import ItemCell from '../Inventory/ItemCell';

import Vue from 'vue'

export default {
  name: "Body",
  props: ['fraction'],
  data() {
    return {
      updater: null,
      gridCellSize: 160,
      bodiesSlots: {},
      sizeGrid: {
        x: 9,
        y: 5,
      },
    }
  },
  destroyed() {
    if (this.updater) clearInterval(this.updater);
  },
  created() {
    let app = this;
    app.updater = setInterval(function () {
      if (app.$refs && app.$refs.hasOwnProperty('BodyCanvas')) {

        app.$refs['BodyCanvas'].width = app.$refs['BodyWrapper'].scrollWidth;
        app.$refs['BodyCanvas'].height = app.$refs['BodyWrapper'].scrollHeight;
        app.CanvasGrid('BodyCanvas');
      }
    }, 500);
  },
  methods: {
    CanvasGrid(ref) {

      let app = this;
      let canvas = app.$refs[ref];
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

      ctx.lineWidth = 1;

      for (let cell of app.grid) {
        ctx.strokeRect(cell.left, cell.top, cell.width, cell.height);
        ctx.closePath();
      }

      ctx.strokeStyle = "rgba(6,215,140, 0.4)";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(4,252,244, 0.75)';

      ctx.beginPath();
      for (let body of app.bodies[app.$props.fraction].bodies) {

        for (let id of body.ids) {
          app.getBody(id);
        }

        for (let toLine of body.linesTo) {
          ctx.moveTo(body.pos.x * app.gridCellSize, body.pos.y * app.gridCellSize);
          ctx.lineTo(toLine.x * app.gridCellSize, toLine.y * app.gridCellSize);
          ctx.stroke();
          ctx.closePath();
        }
      }

      ctx.beginPath();
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.shadowColor = "transparent";
      for (let cell of app.grid) {
        ctx.arc(cell.left, cell.top, 5, 0, 360);
        ctx.closePath();
      }
      ctx.fill();
    },
    getBody(id) {
      let app = this;

      if (app.bodiesSlots[id]) {
        return
      }

      app.$api.get(urls.itemURL + '?id=' + id + "&type=body&method=item").then(function (response) {
        Vue.set(app.bodiesSlots, id, response.data);
      }).catch(function (err) {
        console.log(err)
      });
    },
    openSubMenu(event, slot) {
      let app = this;
      app.$parent.subMenuProps.slot = null;
      setTimeout(function () {
        app.$parent.subMenuProps.src = '';
        app.$parent.subMenuProps.x = event.pageX - $(app.$parent.$refs['TechnologyMenu']).position().left - 1;
        app.$parent.subMenuProps.y = event.pageY - $(app.$parent.$refs['TechnologyMenu']).position().top - 1;
        app.$parent.subMenuProps.slot = slot;
      }, 0)
    },
  },
  computed: {
    grid() {
      let cells = [];

      for (let i = 0; i <= this.sizeGrid.x; i++) {
        for (let j = 0; j <= this.sizeGrid.y; j++) {
          cells.push({
            left: (i * this.gridCellSize),
            top: (j * this.gridCellSize),
            height: this.gridCellSize,
            width: this.gridCellSize,
          })
        }
      }

      return cells
    },
    bodies: function () {
      return this.$store.getters.getTechnologyBodyConfig
    },
  },
  components: {
    AppItemCell: ItemCell,
  }
}
</script>

<style scoped>
.category {
  position: absolute;
  min-height: 70px;
  width: 156px;
  border: 2px solid rgba(37, 160, 225, 0.5);
  background: rgba(8, 138, 210, 0.5);
}

.category h4 {
  margin: 0;
  background: rgb(221, 112, 52);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 17px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  padding-left: 10px;
}

.category .bodies {

}
</style>
