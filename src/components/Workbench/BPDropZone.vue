<template>
  <div id="bpIcon">
    <app-background-item-cell
      v-if="workbench.select_bp.blue_print && workbench.select_bp.type_select === 'bp'"
      v-bind:slotItem="{type: 'blueprints', item: workbench.select_bp.blue_print}"/>
  </div>
</template>

<script>
  import BackgroundItemCell from '../Inventory/BackgroundItemCell'

  export default {
    name: "BPDropZone",
    mounted() {
      let app = this;
      $(app.$el).droppable({
        tolerance: "pointer",
        drop: function (event, ui) {

          $('.ui-selected').removeClass('ui-selected');

          let draggable = ui.draggable;
          if (!draggable.data("selectedItems")) return;

          if (draggable.data("slotData").parent === "storage") {
            app.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
              event: "SelectBP",
              storage_slots: draggable.data("selectedItems").slotsNumbers,
              count: 1,
            }));
          }
        }
      });
    },
    computed: {
      workbench() {
        return this.$store.getters.getWorkbenchState
      }
    },
    components: {
      AppBackgroundItemCell: BackgroundItemCell,
    }
  }
</script>

<style scoped>

</style>
