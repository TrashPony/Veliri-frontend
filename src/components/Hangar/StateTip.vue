<template>
  <div class="tip"
       v-if="inventory.stateSkill[param] + inventory.stateEquip[param] + inventory.stateBodyBonus[param] > 0 ||
       inventory.stateSkill[param] + inventory.stateEquip[param] + inventory.stateBodyBonus[param] < 0">

    <div>
      <span>{{titleEquip}}:</span>
      <span v-if="baseValue">{{baseValue}}</span>
      <span v-else>{{inventory.stateMS[param] - inventory.stateSkill[param] - inventory.stateEquip[param] - inventory.stateBodyBonus[param]}}</span>
    </div>

    <div v-if="inventory.stateSkill[param] && inventory.stateSkill[param] !== 0">
      <span>Навык:</span>
      <span v-bind:class="{up: inventory.stateSkill[param] > 0, fine: inventory.stateSkill[param] < 0}">
                    {{inventory.stateSkill[param] > 0 ? '+' : '-'}} {{skillValue ? skillValue : inventory.stateSkill[param]}}
      </span>
    </div>

    <div v-if="inventory.stateEquip[param] && inventory.stateEquip[param] !== 0">
      <span>Снаряжение:</span>
      <span v-bind:class="{up: inventory.stateEquip[param] > 0, fine: inventory.stateEquip[param] < 0}">
                    {{inventory.stateEquip[param] > 0 ? '+' : '-'}} {{skillValue ? skillValue : inventory.stateEquip[param]}}
      </span>
    </div>

    <div v-if="inventory.stateBodyBonus[param] && inventory.stateBodyBonus[param] !== 0">
      <span>Бонус корпуса:</span>
      <span v-bind:class="{up: inventory.stateBodyBonus[param] > 0, fine: inventory.stateBodyBonus[param] < 0}">
                    {{inventory.stateBodyBonus[param] > 0 ? '+' : '-'}} {{skillValue ? skillValue : inventory.stateBodyBonus[param]}}
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "StateTip",
    props: ['titleEquip', 'param', 'baseValue', 'skillValue'],
    computed: {
      inventory() {
        return this.$store.getters.getInventory
      },
    },
  }
</script>

<style scoped>
  .up {
    color: #abff00;
  }

  .fine {
    color: red;
  }

  .tip {
    display: none;
    position: absolute;
    bottom: calc(100% + 5px);
    right: 5px;
    min-height: 20px;
    min-width: 210px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    padding: 5px;
    box-shadow: 0 0 2px black;
    color: white;
  }

  .tip span:first-child {
    float: left;
  }

  .tip span:last-child {
    float: right;
  }

  .tip div {
    clear: both;
  }
</style>
