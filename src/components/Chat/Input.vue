<template>
  <form autocomplete="off">
    <textarea placeholder="message..." id="chatInput"
              @focus="focus"
              @blur="blur"
              @input="validate"
              v-bind:disabled="disabled"
              v-model="newMessage"
              @keydown.13="sendMessage"/>
  </form>
</template>

<script>
export default {
  name: "Input",
  props: ['currentChatID', 'disabled'],
  data() {
    return {
      newMessage: null,
    }
  },
  methods: {
    validate() {
      this.newMessage = this.newMessage.trimStart();
    },
    focus() {
      //console.log('focus')
    },
    blur() {
      //console.log('NOfocus')
    },
    sendMessage() {
      if (this.newMessage !== "") {
        this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
          event: "NewChatMessage",
          message_text: this.newMessage.trimStart(),
          group_id: this.$props.currentChatID,
        }));

        this.newMessage = null;
      }
    },
  }
}
</script>

<style scoped>
textarea {
  width: 284px;
  height: 32px;
  border-radius: 0 0 5px 5px;
  border: 0;
  margin-left: 3px;
  background: #adc6cd;
  box-shadow: inset 0 0 3px black;
  background-size: 100% 3px;
  text-shadow: none;
  padding-left: 5px;
  padding-right: 5px;
  resize: none;
  font-weight: 900;
}

textarea::placeholder {
  color: rgb(126, 127, 149);
  font-size: 15px;
}

textarea:disabled {
  color: rgba(0, 0, 0, 0.4);
}
</style>
