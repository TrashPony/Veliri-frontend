<template>
  <div class="WarehousesTabs"
       @click="switchWarehouse(id)"
       v-bind:class="{ active: id === inventory.warehouse}">
    {{title}}
  </div>
</template>

<script>
  export default {
    name: "WarehouseTab",
    props: ['title', 'id'],
    data() {
      return {
        checkValidBox: null,
      }
    },
    destroyed() {
      if (this.checkValidBox) {
        clearInterval(this.checkValidBox)
      }
    },
    created() {
      let app = this;

      let house = app.inventory.warehouses[app.$props.id];
      if (house.meta && house.meta.type === 'box') {
        app.checkValidBox = setInterval(function () {
          app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
            event: "checkBox",
            id: house.meta.id,
          }));
        })
      }
    },
    mounted() {
      let app = this;

      $(app.$el).droppable({
        tolerance: "pointer",
        drop: function (event, ui) {

          $('.ui-selected').removeClass('ui-selected');

          let draggable = ui.draggable;

          // если родитель конструктор то это снятие эквипа с тушки, там свои методы
          if (draggable.data("slotData").parent === "Constructor") {
            app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
              event: draggable.data("slotData").event,
              equip_slot: Number(draggable.data("slotData").equipSlot),
              equip_slot_type: Number(draggable.data("slotData").equipType),
              destination: app.$props.id,
            }));
          } else {
            if (!draggable.data("selectedItems")) return;
            app.$store.getters.getWSByService('inventory').socket.send(JSON.stringify({
              event: "itemsToDst",
              source: draggable.data("slotData").parent,
              destination: app.$props.id,
              storage_slots: draggable.data("selectedItems").slotsNumbers
            }));
          }
        }
      });
    },
    methods: {
      switchWarehouse(warehouse) {
        this.$store.commit({
          type: 'setCurrentWarehouse',
          warehouse: warehouse,
        });
      },
    },
    computed: {
      inventory() {
        return this.$store.getters.getInventory
      },
    },
  }
</script>

<style scoped>
  .WarehousesTabs {
    text-align: left;
    display: block;
    width: 82px;
    padding-left: 10px;
    background: rgb(136, 68, 34);
    box-shadow: 0 0 2px rgba(0, 0, 0, 1);
    color: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    margin: 2px 0 0 2px;
    font-size: 13px;
    line-height: 17px;
    height: 16px;
    user-select: none;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
    font-weight: bold;
  }

  .WarehousesTabs.active {
    background: rgb(221, 112, 52);
    box-shadow: inset 0 0 4px 0 white;
  }

  .WarehousesTabs:hover {
    cursor: pointer;
    box-shadow: inset 0 0 4px 0 #20fffd;
  }
</style>
