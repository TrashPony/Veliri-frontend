<template>
  <div class="popup_wrapper">

    <div class="mask"></div>

    <div class="infoBlock">
      <app-control v-bind:head="'Авторизация'" v-bind:move="false" v-bind:close="false"
                   v-bind:refWindow="'loginBlock'"/>
      <h2 class="error">{{ error }}</h2>
    </div>
  </div>
</template>

<script>
import urls from '../../const';
import Control from '../Window/Control';

export default {
  name: "VkPopup",
  data() {
    return {
      code: "",
      error: "",
    }
  },
  mounted() {
    let app = this;
    app.code = this.$route.query.code
    app.$api.get(urls.vkOAuth + '?code=' + app.code, {
      withCredentials: true,
    }).then(function (response) {
      if (response.data.success) {
        window.close()
      } else {
        app.error = response.data.error
      }
    });
  },
  components: {
    AppControl: Control,
  }
}
</script>

<style scoped>
.popup_wrapper {
  height: 100vh;
  width: 100%;
  text-align: center;
  background-color: #7f7f7f;
  background-image: url('../../assets/bases/base.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}

.mask {
  position: absolute;
  z-index: 1 !important;
  background-color: rgba(0, 0, 0, 0.7);
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

.infoBlock {
  position: absolute;
  left: calc(50% - 90px);
  top: 20%;
  display: block;
  border-radius: 5px;
  width: 180px;
  height: 110px;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  z-index: 11 !important;
  padding: 20px 0 0 0;
  box-shadow: 0 0 2px black;
}

.error {
  color: #db3333;
  font-size: 12px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}
</style>
