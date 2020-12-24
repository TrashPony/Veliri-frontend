<template>
  <div class="UserMsg" v-if="!hide" :id="windowID" :ref="windowID"
       :style="{left: meta.pos.left + 'px', top: meta.pos.top + 'px'}">
    <div class="msg">
      <div class="text">{{meta.text}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "UserMsg",
    props: ['windowID', 'meta'],
    data() {
      return {
        updater: null,
        hide: true,
      }
    },
    destroyed() {
      clearInterval(this.updater);
    },
    created() {
      let app = this;
      app.updater = setInterval(function () {
        if (app.$props.meta.pos.left + 150 > window.innerWidth ||
          app.$props.meta.pos.top + 150 > window.innerHeight ||
          app.$props.meta.pos.left < 0 || window.innerHeight < 0) {

          app.hide = true;
        } else {
          app.hide = false;
        }
      }, 100)
    },
  }
</script>

<style scoped>
  .UserMsg {
    pointer-events: none;
    z-index: -1;
    color: white;
    position: absolute;
    height: 25px;
    min-width: 30px;
    max-width: 300px;
    text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  }

  .msg {
    position: relative;
    left: -50%;
  }

  .msg {
    position: relative;
    min-width: 30px;
    max-width: 200px;
    height: 16px;
    padding: 2px 0;
    background-color: rgba(239, 239, 255, 0.75);
    border: 1px solid #666;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    border-radius: 30px;
  }

  .text {
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 18px;
    text-align: center;
    padding: 0 5px;
  }

  .msg:before {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: 50%;
    top: 20px;
    border: 5px solid;
    border-color: #666 transparent transparent #666;
  }

  .msg:after {
    content: ' ';
    position: absolute;
    width: 0;
    height: 0;
    left: calc(50% + 2px);
    top: 20px;
    border: 3px solid;
    border-color: rgba(239, 239, 255, 0.75) transparent transparent rgba(239, 239, 255, 0.75);
  }
</style>
