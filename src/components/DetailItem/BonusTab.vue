<template>
  <div>
    <div class="bonus" v-for="bonus in bonuses" v-bind:class="{open: checkBonus(bonus)}">
      <div class="bonusHead">
        <span class="importantly">{{getNameEffectType(bonus.bonus.type)}}</span>
        <span class="importantly">{{getNameParameter(bonus.bonus.parameter)}}</span>
        {{getNameWeapon(bonus.bonus.weapon_type, bonus.bonus.standard_size)}}
        <span class="importantly">{{getCountBonus(bonus.bonus)}}</span>
      </div>

      <div class="needSkills">
        <div class="skillRow" v-for="(lvl, requirement) in bonus.requirements">
          <span>{{handbook["skill"][language][requirement].name}}</span>

          <img class="imgPassRequirement"
               v-if="mySkills.hasOwnProperty(requirement) && mySkills[requirement].level >= lvl"
               src="https://img.icons8.com/color/48/000000/ok--v1.png"/>

          <img class="imgPassRequirement"
               v-else
               src="https://img.icons8.com/color/48/000000/cancel--v1.png"/>

          <span class="level">{{lvl}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "BonusTab",
    props: ['bonuses'],
    created() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "GetMySkills",
      }));
    },
    methods: {
      getNameEffectType(type) {
        if (type === 'enhances') return 'увеличение ';
      },
      getNameParameter(parameter) {
        if (parameter === 'damage') return 'урона ';
        if (parameter === 'gun_speed_rotate') return 'скорости поворота ';
        if (parameter === 'speed') return 'скорости движения ';
        if (parameter === 'capacity_size') return 'вместимости трюма ';
        if (parameter === 'mining_ore_speed') return 'скорости добычи руды ';
      },
      getNameWeapon(weapon_type, size) {
        let weaponType = "";
        if (weapon_type === 'firearms') weaponType = 'балистическоих орудий ';
        if (weapon_type === 'laser') weaponType = 'лазеров ';
        if (weapon_type === 'missile') weaponType = 'ракетных установок ';

        if (size === 1) return "малых " + weaponType;
        if (size === 2) return "средних " + weaponType;
        if (size === 3) return "больших " + weaponType;
      },
      getCountBonus(bonus) {
        let count = 'на ' + bonus.quantity + ' ';
        if (bonus.percentages) count += '% ';
        return count
      },
      checkBonus(bonus) {
        for (let requirement in bonus.requirements) {
          if (this.mySkills[requirement].level < bonus.requirements[requirement]) {
            return false
          }
        }

        return true
      }
    },
    computed: {
      language() {
        return this.$store.getters.getSettings.Language
      },
      handbook() {
        return this.$store.getters.getHandBook
      },
      mySkills() {
        return this.$store.getters.getChatState.mySkills
      }
    },
  }
</script>

<style scoped>
  .bonus {
    width: calc(100% - 13px);
    float: left;
    font-size: 10px;
    padding: 5px;
    clear: both;
    border: 1px solid transparent;
    background: rgba(82, 5, 0, 0.4);
    border-radius: 3px;
    margin: 3px 1px;
    color: white;
    box-shadow: 0 0 2px 1px black;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .bonus.open {
    background: rgba(52, 82, 61, 0.4);
  }

  .bonus:first-letter {
    text-transform: capitalize;
  }

  .bonusHead {
    margin-bottom: 2px;
  }

  .needSkills {
    width: calc(100% - 10px);
    float: left;
    padding: 5px;
    box-shadow: inset 0 0 2px black;
    background: rgba(255, 255, 255, 0.2);
  }

  .skillRow {
    position: relative;
    float: left;
    width: calc(100% - 10px);
    height: 17px;
    background: rgba(0, 0, 0, 0.1);
    padding: 3px 5px;
    margin-bottom: 6px;
    font-size: 10px;
    line-height: 20px;
    box-shadow: 0 0 2px black;
    border-radius: 3px;
    color: white;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .skillRow:last-child {
    margin-bottom: 0;
  }

  .level {
    float: right;
    color: yellow;
  }

  .imgPassRequirement {
    float: right;
    height: 100%;
    margin-left: 10px;
    box-shadow: 0 0 2px 1px black;
    border-radius: 50%;
  }
</style>
