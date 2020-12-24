<template>
  <div class="itemsPools" id="itemsPool">
    <div class="pollHead">
      <h3>Input materials</h3>
      <div>
        <div id="RecyclePercent">
          <div id="fillBackPercent" :style="{width: recycler.user_recycle_skill + '%'}"></div>
          <span id="UserRecyclePercent">
            {{language === 'RU' ? 'Потери:' : 'Losses:'}} {{recycler.user_recycle_skill}} %
          </span>
        </div>
        <div class="util"></div>
      </div>

      <div class="RecycleSection">
        <template v-for="(items, section) in innerItems">
          <app-item-cell v-for="item in items"
                         @click.native="removeItem(item)"
                         v-bind:itemSlot="item.slot"
                         v-bind:size="50"
                         v-bind:few="!item.recycled"
                         v-bind:tax="10"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import ItemCell from '../Inventory/ItemCell';

  export default {
    name: "ItemsDropZone",
    mounted() {
      let app = this;

      // $(app.$el).selectable({
      //   filter: '.InventoryCell',
      //   start: function () {
      //     $('.ui-selected').removeClass('ui-selected')
      //   }
      // });

      $(app.$el).droppable({
        drop: function (event, ui) {
          $('.ui-selected').removeClass('ui-selected');
          let draggable = ui.draggable;

          if (draggable.data("slotData") && (draggable.data("slotData").parent === "storage" || draggable.data("slotData").parent === "squadInventory")) {
            if (draggable.data("selectedItems") !== undefined) {
              app.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
                event: "PlaceItemsToProcessor",
                storage_slots: draggable.data("selectedItems").slotsNumbers,
                item_source: draggable.data("slotData").parent,
              }));
            } else {
              app.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
                event: "PlaceItemToProcessor",
                storage_slot: Number(draggable.data("slotData").number),
                item_source: draggable.data("slotData").parent,
              }));
            }
          }
        }
      });
    },
    methods: {
      removeItem(item) {
        console.log(123)
        this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
          event: "RemoveItemFromProcessor",
          recycler_slot: Number(item.number),
          item_source: item.source,
        }));
      }
    },
    computed: {
      language() {
        return this.$store.getters.getSettings.Language
      },
      recycler() {
        return this.$store.getters.getRecyclerState
      },
      innerItems() {
        let sections = {};

        let need_items_slots = this.$store.getters.getRecyclerState.recycle_slots;

        for (let source in need_items_slots) {
          for (let i in need_items_slots[source]) {

            let itemSlot = need_items_slots[source][i];
            itemSlot.number = i;

            if (!sections.hasOwnProperty(itemSlot.slot.type)) {
              sections[itemSlot.slot.type] = [];
            }
            sections[itemSlot.slot.type].push(itemSlot);
          }
        }

        return sections;
      },
    },
    components: {
      AppItemCell: ItemCell,
    }
  }
</script>

<style>

</style>
