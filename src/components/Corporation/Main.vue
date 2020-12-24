<template>
  <div>
    <div class="userAvatar" v-bind:style="{backgroundImage:  'url(\'' + logo + '\')'}"></div>
    <h3 class="head">
      [<span>{{this.$store.getters.getChatState.corporation.info.tag}}</span>]
      {{this.$store.getters.getChatState.corporation.info.name}}
    </h3>
    <p>{{this.$store.getters.getChatState.corporation.info.description}}</p>
  </div>
</template>

<script>
  import urls from '../../const';

  export default {
    name: "Main",
    data() {
      return {
        logo: null
      }
    },
    created() {
      this.getLogo();
    },
    methods: {
      getLogo() {
        let app = this;
        app.$api.get(urls.corpLogoURL + '?corporation_id=' + app.corporation.info.id).then(function (response) {
          app.$set(app, 'logo', response.data.avatar);
        });
      },
    },
    computed: {
      corporation() {
        return this.$store.getters.getChatState.corporation;
      },
    },
  }
</script>

<style scoped>
  .userAvatar {
    background-color: rgb(128, 128, 128);
    height: 100px;
    width: 100px;
    float: left;
    margin: -1px 5px 5px -1px;
    border: 1px solid rgba(0, 0, 0, 0.4);
    box-shadow: inset 0 0 1px 0 black;
    background-size: cover;
  }

  .head {
    margin: 0 0 10px 0;
    background: rgb(221, 112, 52);
    color: rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    font-size: 13px;
    line-height: 17px;
    height: 17px;
    user-select: none;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
    font-weight: bold;
    box-shadow: 0 0 2px rgba(0, 0, 0, 1);
    padding-left: 10px;
  }

  .head span {
    color: #e4ff00;
    font-size: 10px;
  }

  p {
    font-size: 10px;
    text-indent: 4px;
    word-wrap: break-word;
  }
</style>
