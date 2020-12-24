<template>
  <div>
    <div class="skillRow" v-for="requirement in requirements">
      <span>{{handbook["skill"][language][requirement.name].name}}</span>

      <img class="imgPassRequirement"
           v-if="mySkills.hasOwnProperty(requirement.name) && mySkills[requirement.name].level >= requirement.level"
           src="https://img.icons8.com/color/48/000000/ok--v1.png"/>

      <img class="imgPassRequirement"
           v-else
           src="https://img.icons8.com/color/48/000000/cancel--v1.png"/>

      <span class="level">{{requirement.level}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Requirements",
    props: ['requirements'],
    created() {
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "GetMySkills",
      }));
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
  .skillRow {
    position: relative;
    float: left;
    width: calc(100% - 10px);
    height: 17px;
    background: rgba(0, 0, 0, 0.1);
    padding: 3px 5px;
    margin-bottom: 3px;
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
