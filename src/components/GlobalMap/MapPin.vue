<template>
  <div class="mapPin" v-bind:style="{ left: subMenuProps.x + 'px', top: subMenuProps.y + 'px' }">

    <div class="section" style="margin: 0">
      <div class="icon"
           :style="{backgroundImage: 'url(' + require('../../assets/' + fractionLogo(subMenuProps.map.fraction)) + ')'}"></div>
      <div class="mapName">{{subMenuProps.map.Name}}</div>
    </div>

    <div class="section" v-if="subMenuProps.map.battle">
      <div class="battle"></div>
      <div class="battle_text">В секторе идет бой!</div>
    </div>

    <div class="section" v-if="mainBase">
      <div class="icon"
           :style="{backgroundImage: 'url(' + require('../../assets/map/objects/sector_structure/' + mainBase.sprite_texture + '.png') + ')'}"></div>

      <div class="baseName">
        <p>Главная база</p>
        <p>{{mainBase.name}}</p>
      </div>
    </div>

    <div class="section" v-if="otherStructures" v-for="base in otherStructures">
      <div class="icon"
           :style="{backgroundImage: 'url(' + require('../../assets/map/objects/sector_structure/' + base.sprite_texture + '.png') + ')'}"></div>

      <div class="baseName">
        <p>{{base.type}}</p>
        <p>{{base.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MapPin",
    props: ['subMenuProps'],
    methods: {
      fractionLogo(fraction) {
        if (fraction === '') {
          fraction = 'Free'
        }
        return 'logo/' + fraction + '.png'
      },
    },
    computed: {
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
    z-index: 12;
    text-shadow: 1px 1px 2px black, 0 0 1em #696969;
  }

  .icon {
    float: left;
    height: 25px;
    width: 25px;
    position: relative;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 0 3px 5px 0;
    border-radius: 5px;
    background-size: contain;
    background-repeat: no-repeat;
    filter: drop-shadow(0 0 2px white);
    background-position: center;
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
    margin-top: 7px
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
</style>
