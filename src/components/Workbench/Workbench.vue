<template>
  <div id="Workbench" ref="Workbench" @mousedown="toUp">

    <app-control v-bind:head="language === 'RU' ? 'Производство:' : 'Production:'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'Workbench'"
                 v-bind:resizeFunc="resize"
                 v-bind:minSize="{height: 218, width: 383}"/>

    <div style="float: left;">
      <div id="wrapperBP">
        <div id="bluePrints">

          <app-b-p-drop-zone/>

          <div id="bpName">{{ itemName }}
          </div>
          <div id="workStatus" v-if="workbench.select_bp.type_select === 'bp'">

            <div id="mineralTax" style="background-image: url(https://img.icons8.com/color/48/000000/bronze-ore.png)">
              <span>{{ workbench.select_bp.blue_print ? workbench.select_bp.mineral_tax : '0' }}%</span>
            </div>

            <div id="timeTax" style="background-image: url(https://img.icons8.com/fluent/48/000000/timer.png)">
              <span id="timeTaxSpan">{{ workbench.select_bp.blue_print ? workbench.select_bp.time_tax : '0' }}%</span>
            </div>

          </div>
        </div>
      </div>
      <div id="currentCrafts">
        <div class="blueHead" id="queueProduction">
          {{ language === 'RU' ? 'Очередь производаства:' : 'Production queue:' }}
        </div>

        <div class="blueRow" v-for="work in works" @click="selectWork(work)">

          <div class="bpIconItem">
            <app-background-item-cell
              v-bind:slotItem="{type: work.work.blueprint.item_type, item: {name: work.work.item.name}}"/>
          </div>

          <div class='nameBP'>{{ work.work.item.name }}</div>
          <div class='countBP'>x{{ work.count }}</div>
          <div class='timerWork'>
            <span>{{ work.time }}</span>
            <div class='workTimeLine' :style="{width: work.width + '%'}"></div>
          </div>
        </div>
      </div>
    </div>

    <div id="detailWork">
      <div id="itemPreview">
        <template v-if="workbench.select_bp.blue_print">
          <app-background-item-cell
            v-bind:slotItem="{type: workbench.select_bp.blue_print.item_type, item: {name: workbench.select_bp.bp_item.name}}"/>

          <span style="z-index: 1">x{{ workbench.select_bp.blue_print.count }}</span>
        </template>
      </div>

      <div id="needItems">
        <template v-for="(items, section) in needItems">

          <div class="nameSection">{{ section }}
            <div class="hideArrowSection"></div>
          </div>

          <app-item-cell v-for="item in items"
                         v-bind:itemSlot="item"
                         v-bind:size="38"
                         v-bind:few="!item.find && workbench.select_bp.type_select === 'bp'"/>

        </template>
      </div>

      <div id="ButtonWrapper">

        <div id="countHead">{{ language === 'RU' ? 'Кол-во:' : 'Qty:' }}</div>

        <input :value="workbench.select_bp ? workbench.select_bp.count : null"
               @input="updateCount" type="number" min="1" :max="workbench.select_bp.max_count">

        <div id="bpCraftTime">
          <template v-if="workbench.select_bp.blue_print && workbench.select_bp.type_select === 'bp'">
            {{ getTimeString(workbench.select_bp.time, workbench.select_bp.count, 'bp') }}
          </template>
          <template v-if="workbench.select_bp.blue_print && workbench.select_bp.type_select === 'work'">
            {{ getTimeString(workbench.select_bp.blue_work.finish_time, workbench.select_bp.count, 'work') }}
          </template>
        </div>

        <input type="button" class="lobbyButton inventoryTip"
               :value="language === 'RU' ? 'Создать' : 'Create'"
               style="pointer-events: auto; bottom: 20px;"
               v-if="workbench.select_bp.type_select === 'bp' && workbench.select_bp.blue_print"
               @click="craft">

        <input type="button" class="lobbyButton inventoryTip"
               :value="language === 'RU' ? 'Отменить' : 'Cancel'"
               style="pointer-events: auto; bottom: 20px;"
               v-if="workbench.select_bp.type_select === 'work' && workbench.select_bp.blue_print"
               @click="cancelCraft">

        <input type="button" class="lobbyButton inventoryTip" style="pointer-events: auto;"
               :value="language === 'RU' ? 'Закрыть' : 'Close'">

      </div>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';
import ItemCell from '../Inventory/ItemCell';
import BPDropZone from './BPDropZone';
import BackgroundItemCell from '../Inventory/BackgroundItemCell'

export default {
  name: "Workbench",
  data() {
    return {
      updater: null
    }
  },
  created() {
    let app = this;

    this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
      event: "OpenWorkbench",
    }));

    app.updater = setInterval(function () {
      app.updateCount()
    }, 1000)
  },
  destroyed() {
    if (this.updater) clearInterval(this.updater);
  },
  methods: {
    resize(event, ui, el) {
      el.find('#detailWork').css("height", el.height() - 7);
      el.find('#needItems').css("height", el.height() - 7);
      el.find('#ButtonWrapper').css("height", el.height() - 95);

      el.find('#wrapperBP').css("height", 58);
      el.find('#currentCrafts').css("height", el.height() - 64);

      el.find('#detailWork').css("width", el.width() - 207);
      el.find('#needItems').css("width", el.width() - 283);
    },
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    getTimeString(sec, count, type) {

      let data;

      if (type === 'bp') {
        data = new Date(0);
        data.setSeconds(sec * count);
      } else {
        data = new Date();
        sec = new Date(sec).getTime();
        data.setTime(sec - new Date().getTime());
      }

      let days = (data.getUTCDate() - 1 > 0) ? data.getUTCDate() - 1 + "d: " : '';
      let hours = (data.getUTCHours() > 9) ? data.getUTCHours() : "0" + data.getUTCHours();
      let minutes = (data.getUTCMinutes() > 9) ? data.getUTCMinutes() : "0" + data.getUTCMinutes();
      let seconds = (data.getUTCSeconds() > 9) ? data.getUTCSeconds() : "0" + data.getUTCSeconds();
      return days + hours + ":" + minutes + ":" + seconds + "s"

    },
    updateCount(e) {
      if (this.workbench.select_bp.type_select && (this.workbench.select_bp.blue_work || this.workbench.select_bp.storage_slot)) {

        this.$store.commit({
          type: 'setCountSelectBP',
          count: e ? e.target.value : this.workbench.select_bp.count,
        });

        if (this.workbench.select_bp.type_select === 'work') {
          this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
            event: "SelectWork",
            id: this.workbench.select_bp.blue_work.id,
            count: e ? Number(e.target.value) : Number(this.workbench.select_bp.count),
            start_time: this.workbench.select_bp.start_time,
            to_time: this.workbench.select_bp.to_time,
          }));
        } else {
          this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
            event: "SelectBP",
            storage_slots: [Number(this.workbench.select_bp.storage_slot)],
            count: e ? Number(e.target.value) : Number(this.workbench.select_bp.count),
          }));
        }
      }
    },
    craft() {
      this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
        event: "Craft",
        storage_slot: Number(this.workbench.select_bp.storage_slot),
        count: Number(this.workbench.select_bp.count),
        user_work_skill_detail_percent: this.workbench.select_bp.user_work_skill_detail_percent,
        user_work_skill_time_percent: this.workbench.select_bp.time_tax,
        efficiency: this.baseStatus.state.efficiency,
      }));
    },
    cancelCraft() {
      this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
        event: "CancelCraft",
        id: this.workbench.select_bp.blue_work.id,
        count: Number(this.workbench.select_bp.count),
        start_time: this.workbench.select_bp.start_time,
        to_time: this.workbench.select_bp.to_time,
      }));
    },
    selectWork(work) {
      this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
        event: "SelectWork",
        start_time: work.startTime,
        to_time: work.finishTime,
        blue_print_id: work.work.blueprint.id,
        mineral_saving: work.work.mineral_tax_percentage,
        time_saving: work.work.time_tax_percentage,
        count: work.count,
        id: work.work.id,
      }));
    },
    checkWorkRow(work) {
      let data = new Date();

      let finishTime = new Date(work.finish_time);
      let startTime = new Date(work.start_time);

      data.setTime(finishTime.getTime() - new Date().getTime());

      let percent = ((new Date() - startTime.getTime()) * 100) / (finishTime.getTime() - startTime.getTime());
      let widthTimeLine = 0;

      let days, hours, minutes, seconds;
      if (percent > 0) {
        widthTimeLine = Math.round(percent);

        days = (data.getUTCDate() - 1 > 0) ? data.getUTCDate() - 1 + "d: " : '';
        hours = (data.getUTCHours() > 9) ? data.getUTCHours() : "0" + data.getUTCHours();
        minutes = (data.getUTCMinutes() > 9) ? data.getUTCMinutes() : "0" + data.getUTCMinutes();
        seconds = (data.getUTCSeconds() > 9) ? data.getUTCSeconds() : "0" + data.getUTCSeconds();
      } else {
        let craftTime = (finishTime.getTime() - startTime.getTime()) / 1000;
        data.setTime(craftTime * 1000);

        days = (data.getUTCDate() - 1 > 0) ? data.getUTCDate() - 1 + "d: " : '';
        hours = (data.getUTCHours() > 9) ? data.getUTCHours() : "0" + data.getUTCHours();
        minutes = (data.getUTCMinutes() > 9) ? data.getUTCMinutes() : "0" + data.getUTCMinutes();
        seconds = (data.getUTCSeconds() > 9) ? data.getUTCSeconds() : "0" + data.getUTCSeconds();
      }

      if (widthTimeLine > 100 || data.getUTCDate() > 20) {
        return null
      }

      return {
        active: percent > 0,
        time: days + hours + ":" + minutes + ":" + seconds + "s",
        widthTimeLine: widthTimeLine
      }
    }
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    },
    itemName() {

      if (this.workbench.select_bp.blue_print && this.workbench.select_bp.type_select === 'bp') {
        let bp = this.workbench.select_bp.blue_print
        return this.handbook[bp.item_type][this.language][bp.item_name].name
      }

      return ''
    },
    workbench() {
      return this.$store.getters.getWorkbenchState
    },
    baseStatus() {
      return this.$store.getters.getBaseStatus
    },
    needItems() {
      let sections = {};

      let need_items_slots = this.$store.getters.getWorkbenchState.select_bp.preview_recycle_slots;
      for (let i in need_items_slots) {

        let slot = need_items_slots[i];
        if (!sections.hasOwnProperty(slot.type)) {
          sections[slot.type] = [];
        }
        sections[slot.type].push(slot);
      }

      return sections;
    },
    works() {
      let works = {};
      // групируем одинаковые работы

      // эти переменные определяют порядок крафта по бд, и т.к. крафты идут попорядку это делит крафты на пачки по времени
      let previousBP = 0;
      let row = 0;

      for (let i in this.workbench.blue_works) {
        let work = this.workbench.blue_works[i];

        let workState = this.checkWorkRow(work);
        if (!workState) continue;

        // сложный ид для того что бы групировать одинаковые итемы а не добавлять каждый раз новый
        let idRow;

        if (previousBP !== work.blueprint.id) {
          row++
        }
        previousBP = work.blueprint.id;

        if (workState.active) {
          idRow = "blueRow" + work.id
        } else {
          idRow = "blueRow" + work.blueprint.id + "" + work.mineral_tax_percentage + "" + work.time_tax_percentage + "" + row;
        }

        if (!works.hasOwnProperty(idRow)) {
          works[idRow] = {
            count: 0,
            time: workState.time,
            finishTime: 0,
            startTime: Infinity,
            work: work,
            active: workState.active,
            width: workState.widthTimeLine,
          };
        }
        works[idRow].count++;
        // формирование интервала времени для это строки
        // например в этой старке находятся 5 работ по интервалу от 05 до 15 минут
        if (works[idRow].finishTime < new Date(work.finish_time).getTime()) {
          works[idRow].finishTime = new Date(work.finish_time).getTime();
          works[idRow].work = work;
        }

        if (works[idRow].startTime > new Date(work.finish_time).getTime()) {
          works[idRow].startTime = new Date(work.finish_time).getTime()
        }
      }

      return works
    }
  },
  components: {
    AppControl: Control,
    AppBPDropZone: BPDropZone,
    AppBackgroundItemCell: BackgroundItemCell,
    AppItemCell: ItemCell,
  }
}
</script>

<style>
#Workbench {
  position: absolute;
  display: block;
  border-radius: 5px;
  top: 50px;
  left: calc(50% - 400px);
  z-index: 11;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
  width: 498px;
  height: 338px;
  padding: 23px 3px 3px 3px;
}

#Workbench .RecycleSection {
  float: left;
  width: 100%;
}

#Workbench #bluePrints, #Workbench #detailWork, #currentCrafts {
  box-shadow: inset 0 0 3px black;
  background: #89969c;
  height: 318px;
  width: 180px;
  border-radius: 5px;
  padding: 4px 10px 4px 4px;
  overflow-x: hidden;
  overflow-y: hidden;
}

#Workbench #bluePrints {
  height: 60px;
  width: 190px;
  box-sizing: border-box;
  background: #595a69;
  overflow-x: hidden;
  overflow-y: hidden;
  padding: 5px;
}

#currentCrafts {
  height: 157px;
  width: 190px;
  float: left;
  margin: 6px 3px 3px 0;
  overflow-y: scroll;
  padding: 0;
  box-sizing: border-box;
}

#Workbench #detailWork {
  height: 282px;
  float: right;
}

#Workbench .blueHead {
  padding-left: 10px;
  font-size: 10px;
  line-height: 17px;
  width: 100%;
}

#bpName, #workStatus div {
  float: left;
  text-align: left;
  height: 17px;
  border-radius: 5px;
  z-index: 999;
  line-height: 17px;
  margin: 0 0 0 4px;
  width: calc(100% - 63px);
  box-shadow: 0 0 2px black;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  padding-left: 10px;
  font-size: 10px;
  overflow-x: hidden;
}

#bpIcon, #itemPreview {
  height: 65px;
  width: 65px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  background: rgba(63, 70, 74, 0.5);
  border-radius: 5px;
  float: left;
}

#bpIcon {
  float: left;
  height: 45px;
  width: 45px;
  background: #424242;
  border: 2px solid rgb(51, 49, 49);
  box-shadow: inset 0 0 2px, 0 0 2px;
  border-radius: 5px;
  background-image: url("https://img.icons8.com/office/48/000000/collapse.png");
  background-position: center;
  background-size: contain;
  position: relative;
  overflow: hidden;
}

#itemPreview {
  position: relative;
  margin-top: 10px;
  float: right;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

#itemPreview span {
  color: #ffffff;
  z-index: 1;
  position: absolute;
  right: 5px;
  bottom: 5px;
  height: 20px;
  line-height: 27px;
  font-weight: 900;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#needItems {
  height: 268px;
  width: 189px;
  box-shadow: inset 0 0 5px black;
  background: rgba(0, 0, 0, 0.2);;
  position: relative;
  border-radius: 5px;
  float: left;
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: left;
}

#workStatus {
  float: left;
}

#workStatus div {
  width: 42px;
  text-align: right;
  margin: 9px 0 0 4px;
  line-height: 18px;
  padding-right: 5px;
  box-shadow: inset 0 0 2px black, 0 0 2px black;
  font-size: 11px;
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: 6px center;
  background-color: #79a0b4;
  border: 2px solid orange;
  overflow: hidden;
}

#Workbench input[type="number"], #countHead, #bpCraftTime {
  background: #7e919a;
  text-align: center;
  float: left;
  width: 65px;
  height: 18px;
  line-height: 20px;
  padding-right: 5px;
  box-shadow: inset 0 0 2px black;
  border: 0;
  font-size: 11px;
  outline: none;
  padding-left: 5px;
  border-radius: 5px;
  color: #ff7800;
  margin-top: 3px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#countHead, #bpCraftTime {
  background: #79a0b4;
  height: 20px;
}

#Workbench input[type="button"] {
  width: 60px;
  position: absolute;
  bottom: -3px;
  right: 0;
}

#Workbench .ui-resizable-s {
  position: absolute;
  bottom: -6px;
  height: 4px;
}

#ButtonWrapper {
  float: left;
  width: 66px;
  margin: 7px 2px 2px 5px;
  position: relative;
  height: 185px;
}

#Workbench .blueRow {
  padding: 0px 4px 0px 0px;
  text-align: left;
  border: 1px solid rgba(0, 0, 0, 0.5);
  font-size: 12px;
  color: #9bc9f1;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  height: 50px;
  line-height: 26px;
  transition: 0.1s;
  min-width: 168px;
  position: relative;
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.2);
  margin: 1px 3px 0px 3px;
}

#Workbench .blueRow:hover {
  transform: scale(1.01);
  color: #66f5ff;
  background: rgba(44, 44, 44, 0.15);
}

#Workbench .blueRow .nameBP {
  /*float: left;*/
}

#Workbench .blueRow .countBP {
  color: #d6caca;
  line-height: 17px;
  position: absolute;
  right: 10px;
  top: 11px;
}

#Workbench .blueRow .timerWork {
  color: #e6e6e6;
  line-height: 17px;
  font-size: 12px;
  text-align: center;
  background: rgba(8, 8, 8, 0.04);
  height: 15px;
  box-shadow: inset 0 0 5px black;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  z-index: 1;
  margin-top: 1px;
}

.workTimeLine {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 49%;
  background: #ff9d07;
  z-index: -1;
  box-shadow: inset 0 0 5px black;
}

.bpIconItem {
  height: 37px;
  width: 37px;
  background: rgba(0, 0, 0, 0.5);
  float: left;
  margin: 6px;
  border-radius: 5px;
  background-size: contain;
  position: relative;
}

#Workbench .InventoryCell {
  width: 38px;
  height: 38px;
}

#Workbench #detailWork {
  width: 262px;
}

#Workbench .blueHead {
  text-align: left;
  height: 17px;
  border-radius: 5px 0 0 0;
  border: 1px solid #25a0e1;
  z-index: 999;
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.6), rgba(37, 160, 225, 0.6) 6px);
  line-height: 19px;
  margin: 1px 0 0 1px;
  width: 262px;
  box-shadow: 0 0 2px black;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.nameSection {
  clear: both;
  width: 100%;
  height: 14px;
  font-size: 12px;
  margin: 2px 0 1px 1px;
  padding-left: 11px;
  border: 1px solid #793f1f;
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(251, 93, 0, 0.55), rgba(225, 37, 46, 0.6) 6px);
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

</style>
