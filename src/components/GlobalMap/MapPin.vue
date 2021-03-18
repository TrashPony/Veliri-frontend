<template>
  <div class="mapPin" :class="{active: subMenuProps.active}"
       v-bind:style="{ left: subMenuProps.x + 'px', top: subMenuProps.y + 'px' }">
    <div class="section">
      <div style="float: left">
        <div class="icon"
             :style="{backgroundImage: 'url(' + require('../../assets/' + fractionLogo(subMenuProps.map.fraction)) + ')'}"></div>
        <div class="mapName">{{ subMenuProps.map.Name }}</div>
      </div>

      <div style="float: right" v-if="subMenuProps.active">
        <div class="auto_pilot" title="Автопилот"
             @click="toSectorAutoPilot(subMenuProps.map.id, 0, 'auto_pilot')"></div>
        <div class="target" title="Установить цель" @click="toSectorAutoPilot(subMenuProps.map.id, 0, 'target')"></div>
      </div>
    </div>

    <div class="section" v-if="subMenuProps.map.battle">
      <div class="battle"></div>
      <div class="battle_text">В секторе идет бой!</div>
    </div>

    <div class="section" v-if="mainBase">
      <div style="float: left">
        <div class="icon"
             :style="{backgroundImage: 'url(' + require('../../assets/map/objects/sector_structure/' + mainBase.sprite_texture + '.png') + ')'}"></div>

        <div class="baseName">
          <p>{{ getBaseTypeName(mainBase.type) }}</p>
          <p>{{ mainBase.name }}</p>
        </div>
      </div>

      <div style="float: right" v-if="subMenuProps.active">
        <div class="auto_pilot" title="Автопилот"
             @click="toSectorAutoPilot(subMenuProps.map.id, mainBase.id, 'auto_pilot')"></div>
        <div class="target" title="Установить цель"
             @click="toSectorAutoPilot(subMenuProps.map.id, mainBase.id, 'target')"></div>
      </div>
    </div>

    <div class="section" v-if="otherStructures" v-for="base in otherStructures">
      <div style="float: left">
        <div class="icon"
             :style="{backgroundImage: 'url(' + require('../../assets/map/objects/sector_structure/' + base.sprite_texture + '.png') + ')'}"></div>

        <div class="baseName">
          <p>{{ getBaseTypeName(base.type) }}</p>
          <p>{{ base.name }}</p>
        </div>
      </div>

      <div style="float: right" v-if="subMenuProps.active">
        <div class="auto_pilot" title="Автопилот"
             @click="toSectorAutoPilot(subMenuProps.map.id, base.id, 'auto_pilot')"></div>
        <div class="target" title="Установить цель"
             @click="toSectorAutoPilot(subMenuProps.map.id, base.id, 'target')"></div>
      </div>
    </div>

    <div class="exit_block" v-if="subMenuProps.active">
      <input type="button" value="Закрыть" @click="$parent.subMenuProps = null">
    </div>
  </div>
</template>

<script>
import Input from "../Chat/Input";

export default {
  name: "MapPin",
  components: {Input},
  props: ['subMenuProps'],
  methods: {
    fractionLogo(fraction) {
      if (fraction === '') {
        fraction = 'Free'
      }
      return 'logo/' + fraction + '.png'
    },
    getBaseTypeName(baseType) {
      return this.$store.getters.getBaseTypeName(baseType, this.language)
    },
    toSectorAutoPilot(mapID, baseID, type) {
      this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
        event: "MoveToSector",
        map_id: Number(mapID),
        base_id: Number(baseID),
        type: type,
      }));

      this.$store.commit({
        type: 'toggleWindow',
        id: 'GlobalViewMap',
        forceClose: true,
      });
    },
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    info() {
      return this.$store.getters.getWorldMapState.mapInfo[this.$props.subMenuProps.map.id]
    },
    mainBase() {
      if (this.info && this.info.bases) {
        for (let i in this.info.bases) {
          let base = this.info.bases[i];
          if (base.type === 'base') {
            return base
          }
        }
      }
    },
    otherStructures() {
      let structures = [];

      if (this.info && this.info.bases) {
        for (let i in this.info.bases) {
          let base = this.info.bases[i];
          if (base.type !== 'base') {
            structures.push(base);
          }
        }
      }

      return structures
    }
  },
}
</script>

<style scoped>
.mapPin {
  position: absolute;
  background-size: 100% 2px;
  background-image: linear-gradient(0deg, rgba(7, 41, 60, 0.8), rgba(0, 62, 95, 0.8));
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  min-height: 20px;
  min-width: 80px;
  padding: 5px;
  z-index: 999;
  text-shadow: 1px 1px 2px black, 0 0 1em #696969;
}

.active {
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
}

.icon {
  float: left;
  height: 25px;
  width: 25px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: 0 0 2px black;
}

.mapName {
  color: yellow;
  float: left;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  font-size: 15px;
  margin-left: 5px;
}

.section {
  clear: both;
  margin-bottom: 2px;
  float: left;
  width: calc(100% - 4px);
  padding: 3px 2px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 2px black;
}

.battle {
  height: 30px;
  width: 30px;
  background-image: url('../../assets/indexImg/battle_icon.png');
  background-size: contain;
  z-index: 2;
  margin: 0 auto;
}

.battle_text {
  color: red;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.baseName {
  color: yellow;
  float: left;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  font-size: 10px;
  margin-left: 5px;
}

.baseName p {
  margin: 0;
}

.baseName p:first-child {
  font-size: 8px;
  color: white;
}

.exit_block input, .auto_pilot, .target {
  display: block;
  width: 100%;
  margin: 2px auto 0;
  pointer-events: auto;
  font-size: 9px;
  text-align: center;
  transition: 100ms;
  background: rgba(255, 129, 0, 0.6);
  height: 16px;
  border-radius: 5px;
  color: #fff;
  line-height: 15px;
  box-shadow: 0 0 2px #000;
}

.exit_block input:hover, .auto_pilot:hover, .target:hover {
  background: rgba(255, 129, 0, 1);
}

.exit_block input:active, .auto_pilot:active, .target:active {
  transform: scale(0.98);
}

.exit_block {
  clear: both;
  float: left;
  width: 100%;
}

.auto_pilot, .target {
  float: left;
  height: 25px;
  width: 25px;
  margin-left: 5px;
  margin-top: 0;
  background-size: cover;
  background-image: url(https://img.icons8.com/cotton/64/000000/route.png);
}

.target {
  background-image: url(https://img.icons8.com/plasticine/100/000000/define-location.png);
}

.auto_pilot:hover {
  background: url(https://img.icons8.com/cotton/64/000000/route.png), rgba(255, 129, 0, 1);
  background-size: cover;
}

.target:hover {
  background: url(https://img.icons8.com/plasticine/100/000000/define-location.png), rgba(255, 129, 0, 1);
  background-size: cover;
}

</style>
