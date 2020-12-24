<template>
  <div class="ammo_sub_menu">
    <div class="ammo_row" v-for="ammoState in ammo" @click="change(ammoState.item.id)">
      <div class="ammo_icon">
        <app-background-item-cell v-bind:slotItem="ammoState" v-bind:noShowName="true"/>
      </div>
      <div class="ammo_name">{{ammoState.item.name}}</div>
      <div class="ammo_count">х{{ammoState.quantity}}</div>
    </div>
  </div>
</template>

<script>
  import BackgroundItemCell from '../Inventory/BackgroundItemCell';

  export default {
    name: "ChangeWeaponAmmo",
    props: ['ammo'],
    methods: {
      change(id) {
        this.$store.getters.getWSByService('global').socket.send(JSON.stringify({
          event: "ReloadWeapon",
          id: Number(id),
        }));
      }
    },
    components: {
      AppBackgroundItemCell: BackgroundItemCell,
    }
  }
</script>

<style scoped>
  .ammo_sub_menu {
    position: absolute;
    min-height: 20px;
    border: 1px solid rgba(37, 160, 225, 0.2);
    background: rgba(8, 138, 210, 0.2);
    border-radius: 5px;
    bottom: calc(100% + 8px);
    box-shadow: 0 0 2px black;
    width: max-content;
  }

  .ammo_row {
    box-shadow: 0 0 2px black;
    padding: 2px;
    height: 20px;
    clear: both;
    border: 1px solid rgba(37, 160, 225, 0.5);
    background: rgba(0, 114, 198, 0.51);
    border-radius: 3px;
    margin: 2px;
    line-height: 23px;
    font-size: 14px;
    color: white;
    width: calc(100% - 10px);
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .ammo_row div {
    float: left;
  }

  .ammo_row:hover {
    border: 1px solid rgba(37, 160, 225, 0.8);
    background: rgba(8, 138, 210, 0.8);
  }

  .ammo_row:active {
    transform: scale(0.98);
  }

  .ammo_icon {
    height: 20px;
    width: 20px;
    background: #8cb3c7;
    border-radius: 5px;
    margin: 0 5px 2px 0;
    float: left;
    transition: 0.1s;
    position: relative;
  }

  .ammo_name {

  }

  .ammo_row .ammo_count {
    margin-left: 7px;
    color: yellow;
    float: right;
  }
</style>
