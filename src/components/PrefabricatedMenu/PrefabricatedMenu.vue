<template>
  <div id="prefabricatedMenuWrapper" ref="prefabricatedMenuWrapper" @mousedown="toUp">

    <app-control v-bind:head="language === 'RU' ? 'Производство деталей:' : 'Parts production:'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'prefabricatedMenuWrapper'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 179, width: 405}"/>

    <div id="prefabricatedMenu">
      <div id="headPrefabricatedMenu">

        <div id="iconSelectDetail">
          <app-background-item-cell
            v-if="prefabricatedMenu.select_detail.detail"
            v-bind:slotItem="prefabricatedMenu.select_detail.detail"/>
        </div>

        <div id="controlPanelSelectDetail">

          <div id="HeadSelectDetail">
            {{prefabricatedMenu.select_detail.detail ? prefabricatedMenu.select_detail.detail.item.name :
            language === 'RU' ? 'Выбери деталь' : 'Choose a part'}}
          </div>

          <input id="countCraftSelectDetailRange" type="range" min="0"
                 @input="setCountSelectDetail"
                 :value="prefabricatedMenu.select_detail.count"
                 :max="prefabricatedMenu.select_detail.maxCount">

          <span id="countCraftSelectDetailInput">
            {{prefabricatedMenu.select_detail.detail ? prefabricatedMenu.select_detail.count * prefabricatedMenu.detail_bps[prefabricatedMenu.select_detail.detail.item.id].count : 0}}
          </span>

          <label id="craftSelectDetailLabel">
            <span id="taxCraftDetail">Налог: {{100 - baseStatus.state.efficiency}}%</span>
            <input id="craftSelectDetail" type="button" value="Произвести" @click="createDetail()">
          </label>

        </div>

        <div id="needItemsForDetails">
          <h4 id="needItemsForDetailsHead">{{language === 'RU' ? 'Необходимо ресурсов' : 'Resources needed'}}</h4>

          <template v-if="prefabricatedMenu.select_detail.detail && prefabricatedMenu.select_detail.needItems">
            <div class="need_item" v-for="item in prefabricatedMenu.select_detail.needItems">
              <app-background-item-cell v-bind:slotItem="item"/>
              <div class="count">{{item.quantity}}</div>
            </div>
          </template>
        </div>
      </div>

      <div id="itemsPrefabricatedMenu">

        <div v-for="(detail, i) in prefabricatedMenu.details"
             @click="selectDetail(detail, i)"
             v-bind:class="{disable: prefabricatedMenu.detail_max_counts[i] <= 0}">

          <app-background-item-cell v-bind:slotItem="detail"/>

          <div id="PrefabricatedItemCount${itemSlot.item.name}" class="count">
            {{prefabricatedMenu.detail_max_counts[i]}}
            <span style="font-size: 9px; color: #78ff00"> x {{prefabricatedMenu.detail_bps[i].count}}</span>
          </div>

          <div class="need_detail_items">
            <h4 class="needItemsForDetailsHead">{{language === 'RU' ? 'Необходимо ресурсов' : 'Resources needed'}}</h4>
            <div class="need_item" v-for="item in prefabricatedMenu.detail_need_items[i]">
              <app-background-item-cell v-bind:slotItem="item"/>
              <div class="count">{{item.quantity}}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Control from '../Window/Control';
  import BackgroundItemCell from '../Inventory/BackgroundItemCell'

  export default {
    name: "PrefabricatedMenu",
    data() {
      return {
        updater: null,
      }
    },
    destroyed() {
      clearInterval(this.updater);
    },
    created() {
      let app = this;

      app.updater = setInterval(function () {
        app.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
          event: "openPrefabricatedMenu",
        }));
      }, 1000);
    },
    methods: {
      resize() {
      },
      toUp() {
        this.$store.commit({
          type: 'setWindowZIndex',
          id: this.$el.id,
        });
      },
      selectDetail(detail, i) {

        this.$store.commit({
          type: 'setSelectDetail',
          detail: detail,
          maxCount: this.prefabricatedMenu.detail_max_counts[i],
          count: 0,
        });

        this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
          event: "getPrefabricatedNeedItems",
          id: detail.item_id,
          count: 0
        }));
      },
      setCountSelectDetail(e) {
        if (this.prefabricatedMenu.select_detail.detail) {
          this.$store.commit({
            type: 'setCountForSelectDetail',
            count: Number(e.target.value),
          });

          this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
            event: "getPrefabricatedNeedItems",
            id: this.prefabricatedMenu.select_detail.detail.item_id,
            count: Number(e.target.value)
          }));
        }
      },
      createDetail() {
        this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
          event: "createPrefabricatedItems",
          id: this.prefabricatedMenu.select_detail.detail.item_id,
          count: this.prefabricatedMenu.select_detail.count
        }));

        this.$store.commit({
          type: 'setSelectDetail',
          detail: null,
          maxCount: null,
          count: null,
        });
      },
    },
    computed: {
      language() {
        return this.$store.getters.getSettings.Language
      },
      prefabricatedMenu() {
        return this.$store.getters.getPrefabricatedMenuState
      },
      baseStatus() {
        return this.$store.getters.getBaseStatus
      },
    },
    components: {
      AppControl: Control,
      AppBackgroundItemCell: BackgroundItemCell,
    }
  }
</script>

<style scoped>
  #prefabricatedMenuWrapper {
    position: absolute;
    display: block;
    border-radius: 5px;
    z-index: 11;
    width: 405px;
    height: 278px;
    top: 50px;
    left: calc(50% - 200px);
    padding: 20px 3px 3px;
    color: #0cc2fb;
    border: 1px solid #25a0e1;
    background: rgb(8, 138, 210);
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  #prefabricatedMenu {
    box-shadow: inset 0 0 5px black;
    background: #8cb3c7;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  #headPrefabricatedMenu {
    height: 77px;
    width: 100%;
    box-shadow: 0 0 4px black;
    background: rgba(156, 175, 185, 0.4);
  }

  #itemsPrefabricatedMenu {
    overflow-x: hidden;
    overflow-y: scroll;
    width: calc(100% - 8px);
    height: calc(100% - 77px);
    padding: 4px;
  }

  #itemsPrefabricatedMenu > div {
    position: relative;
    height: 92px;
    width: 188px;
    float: left;
    box-shadow: inset 0 0 3px 1px black;
    margin: 2px;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.2);
  }

  #itemsPrefabricatedMenu > div > .itemIconInventoryCell {
    height: 92px;
    width: 81px;
    float: left;
    position: relative;
  }

  #iconSelectDetail {
    height: 68px;
    width: 68px;
    background: #9e9a9a;
    float: left;
    margin: 5px;
    border-radius: 5px;
    box-shadow: 0 0 2px black;
    z-index: 1;
    position: relative;
  }

  #controlPanelSelectDetail {
    float: left;
    width: 200px;
  }

  #HeadSelectDetail {
    background: rgba(0, 0, 0, 0.24);
    height: 15px;
    width: 255px;
    margin-top: 8px;
    margin-left: -55px;
    margin-bottom: 4px;
    border-radius: 0 20px 0 0;
    z-index: 0;
    position: relative;
    font-size: 12px;
    text-align: left;
    text-indent: 56px;
    line-height: 17px;
  }

  #countCraftSelectDetailRange {
    float: left;
    width: 120px;
    margin-right: 10px;
    padding: 0;
  }

  #countCraftSelectDetailInput {
    float: left;
    width: 60px;
    height: 14px;
    color: orange;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  #craftSelectDetail {
    float: right;
    pointer-events: auto;
  }

  #craftSelectDetailLabel {
    float: left;
    width: 199px;
    background: rgba(0, 0, 0, 0.24);
    height: 20px;
    padding: 2px 2px 2px 6px;
    margin: 5px 0 0 -7px;
    border-radius: 3px;
    pointer-events: none;
  }

  #craftSelectDetailLabel span {
    float: left;
    line-height: 23px;
    margin-left: 4px;
    font-size: 10px;
  }

  #needItemsForDetails {
    float: right;
    height: calc(100% - 6px);
    margin-top: 3px;
    margin-right: 3px;
    width: 120px;
    background: rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 3px black;
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 3px;
    padding-left: 2px;
  }

  #needItemsForDetails > div, .need_detail_items > div {
    height: 25px;
    width: 25px;
    position: relative;
    float: left;
    background: rgba(0, 0, 0, 0.35);
    margin: 1px;
    border-radius: 3px;
    box-shadow: inset 0 0 2px black;
  }

  #needItemsForDetails .count, .need_detail_items .count {
    font-size: 10px;
    left: 1px;
    top: 1px;
  }

  #needItemsForDetailsHead, .needItemsForDetailsHead {
    clear: both;
    width: 100%;
    height: 14px;
    font-size: 8px;
    line-height: 15px;
    margin: 0 0 1px -2px;
    padding-left: 3px;
    border: 1px solid #793f1f;
    background-size: 10px 2px;
    background-image: linear-gradient(1deg, rgba(251, 93, 0, 0.55), rgba(225, 37, 46, 0.6) 6px);
    color: #ff7800;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .needItemsForDetailsHead {
    padding: 0;
  }

  .count {
    z-index: 1;
    position: absolute;
    left: 5px;
    top: 5px;
    color: orange;
  }

  .disable {
    opacity: 0.3;
  }

  .need_detail_items {
    height: 84px;
    width: 105px;
    float: left;
    margin: 4px 0px 2px -1px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    box-shadow: inset 0 0 2px black;
    overflow: hidden;
  }
</style>
