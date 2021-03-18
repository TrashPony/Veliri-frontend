<template>
  <div id="audioPlayer" ref="audioPlayer" @mousedown="toUp">
    <div id="progress">
      <input @input="changeProgressTrack" type="range" min="0" max="100" step="1" v-model="progress">
    </div>

    <div id="control">
      <div>
        <div id="buttons">
          <div @click="playPrev">
            <img src="https://img.icons8.com/plasticine/100/000000/rewind.png"/>
          </div>
          <div @click="playTrack(false)">
            <img v-if="!statusPlay" src="https://img.icons8.com/plasticine/100/000000/play.png"/>
            <img v-if="statusPlay" src="https://img.icons8.com/plasticine/100/000000/pause.png"/>
          </div>
          <div @click="playNext">
            <img src="https://img.icons8.com/plasticine/100/000000/fast-forward.png"/>
          </div>
        </div>
        <div id="volume">
          <div>
            <img src="https://img.icons8.com/plasticine/100/000000/low-volume.png"/>
          </div>
          <div style="float: left; width: 50px; margin: 0;">
            <input @input="changeVolume" type="range" min="0" max="1" step="0.01" v-model="volume" title="Музыка">
            <input style="margin-top: 2px;" @input="changeSFXVolume" type="range" min="0" max="1" step="0.01"
                   v-model="SFXVolume" title="Эффекты">
          </div>
          <div>
            <img src="https://img.icons8.com/plasticine/100/000000/high-volume.png"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Control from '../Window/Control';

export default {
  name: "AudioPlayer",
  data() {
    return {
      statusPlay: false,
      currentTrack: {playList: 'lobby', track: 0, meta: null},
      volume: null,
      SFXVolume: null,
      progress: 0,
      progressTrack: null,
      lobby: [
        {src: require('../../assets/audio/music/sci_fi_track_1.mp3'), title: 'sci_fi_track_1', file: null},
        {src: require('../../assets/audio/music/sci_fi_track_3.mp3'), title: 'sci_fi_track_3', file: null},
        {src: require('../../assets/audio/music/sci_fi_track_4.mp3'), title: 'sci_fi_track_4', file: null},
      ],
      global: [
        {src: require('../../assets/audio/music/sci_fi_track_3.mp3'), title: 'sci_fi_track_3', file: null},
        {src: require('../../assets/audio/music/sci_fi_track_4.mp3'), title: 'sci_fi_track_4', file: null},
        {src: require('../../assets/audio/music/sci_fi_track_2.mp3'), title: 'sci_fi_track_2', file: null},
        {src: require('../../assets/audio/music/sci_fi_track_1.mp3'), title: 'sci_fi_track_1', file: null},
      ],
      battle: [
        {src: require('../../assets/audio/music/sci_fi_battle_theme.mp3'), title: 'sci_fi_battle_theme', file: null},
        {src: require('../../assets/audio/music/sci_fi_track_3.mp3'), title: 'sci_fi_track_3', file: null},
        {src: require('../../assets/audio/music/sci_fi_track_4.mp3'), title: 'sci_fi_track_4', file: null},
        {src: require('../../assets/audio/music/sci_fi_track_2.mp3'), title: 'sci_fi_track_2', file: null},
        {src: require('../../assets/audio/music/sci_fi_track_1.mp3'), title: 'sci_fi_track_1', file: null},
      ],
    }
  },
  mounted() {
    let app = this;

    app.volume = this.$store.getters.getSettings.volume;
    app.SFXVolume = this.$store.getters.getSettings.SFXVolume;

    app.progressTrack = setInterval(function () {
      if (app.statusPlay) {
        // проверм прогрес трека
        app.progress = app.getPercentProgressTrack();
        if (app.progress === 100) {
          app.playNext();
        }
      }

      // проверяем плейлист игры которы зависит от места и состояния
      if (app.$route.path === '/lobby' && app.currentTrack.playList !== 'lobby') {
        app.changePlayList('lobby')
      }

      if (app.$route.path === '/global') {
        let sectorState = app.$store.getters.getSectorState;
        let userState = app.$store.getters.getGamePlayer;

        if (sectorState && userState) {
          if (sectorState.base && sectorState.base.fraction === userState.fraction) {
            if (app.currentTrack.playList !== 'global') app.changePlayList('global')
          } else {
            if (app.currentTrack.playList !== 'battle') app.changePlayList('battle');
          }
        }
      }

    }, 1000)
  },
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    loadFile() {
      if (!this.getCurrentTrack().file) {
        this.getCurrentTrack().file = new Audio(this.getCurrentTrack().src);
        this.changeVolume();
      }
    },
    playTrack(forcePlay) {
      if (this.statusPlay && !forcePlay) {
        this.statusPlay = false;
        this.getCurrentTrack().file.pause();
      } else {
        this.progress = 0;
        this.statusPlay = true;
        this.loadFile();
        this.getCurrentTrack().file.play();
      }
    },
    changeVolume() {
      if (this.getCurrentTrack().file) this.getCurrentTrack().file.volume = this.volume;
      this.$store.commit({
        type: 'setVolume',
        volume: this.volume,
      });
    },
    changeSFXVolume() {
      this.$store.commit({
        type: 'setSFXVolume',
        SFXVolume: this.SFXVolume,
      });
    },
    playNext() {
      this.stopTrack();

      if (this.currentTrack.track + 1 < this[this.currentTrack.playList].length) {
        this.currentTrack.track++;
      } else {
        this.currentTrack.track = 0
      }

      this.playTrack(true);
    },
    playPrev() {
      this.stopTrack();

      if (this.currentTrack.track - 1 >= 0) {
        this.currentTrack.track--;
      } else {
        this.currentTrack.track = this[this.currentTrack.playList].length - 1
      }

      this.playTrack(true);
    },
    randomTrack() {
      this.stopTrack();
      this.currentTrack.track = Math.abs(Math.round(Math.random() * this[this.currentTrack.playList].length - 1));

      if (this.statusPlay) this.playTrack(true);
    },
    stopTrack() {
      this.progress = 0;
      if (this.getCurrentTrack().file) {
        this.getCurrentTrack().file.pause();
        this.getCurrentTrack().file.currentTime = 0;
      }
    },
    getCurrentTrack() {
      if (!this[this.currentTrack.playList][this.currentTrack.track]) {
        return {}
      }
      return this[this.currentTrack.playList][this.currentTrack.track]
    },
    getPercentProgressTrack() {
      if (this.getCurrentTrack().file) {
        return (this.getCurrentTrack().file.currentTime * 100 / this.getCurrentTrack().file.duration)
      } else {
        return 100
      }
    },
    changeProgressTrack() {
      if (this.getCurrentTrack().file) {
        this.getCurrentTrack().file.currentTime = this.progress * this.getCurrentTrack().file.duration / 100;
      }
    },
    changePlayList(playList) {
      this.stopTrack();
      this.currentTrack.playList = playList;
      this.randomTrack();
    },
  },
  computed: {},
  components: {
    AppControl: Control,
  }
}
</script>

<style scoped>
#audioPlayer {
  width: 140px;
  color: white;
  display: block;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  z-index: 11;
  padding: 0 1px 1px 1px;
  box-shadow: 0 0 2px black;
  pointer-events: auto;
  height: 100%;
  border-radius: 5px;
}

#control {
  width: 100%;
  border-radius: 5px;
  border: 0;
  display: block;
  background: rgb(101, 165, 195);
  height: 18px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 900;
  transition: 100ms;
  font-family: 'Comfortaa', cursive;
  padding: 1px 0;
  box-shadow: 0 0 2px black;
}

#buttons div, #volume div {
  height: 14px;
  width: 14px;
  background: rgb(203, 170, 95);
  float: left;
  margin: 2px;
  border-radius: 3px;
  box-shadow: 0 0 2px black;
  position: relative;
}

#volume div {
  background: none;
  box-shadow: none;
}

#volume input, #progress input {
  padding: 0;
  background: none;
}

#volume input {
  float: left;
  width: 50px;
}

#buttons div img, #volume div img {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  filter: drop-shadow(0 0 1px black);
}

#buttons div:hover {
  background: rgba(126, 126, 132, 0.31);
}

#buttons div:active {
  transform: scale(0.97);
}

#volume input[type=range] {
  box-shadow: none;
  margin-top: 1px;
  height: 7px;
}

#volume input[type=range]::-ms-thumb {
  border: 0 solid rgba(0, 0, 0, 0);
  width: 3px;
  border-radius: 0;
  background: rgba(255, 143, 53, 0.7);
  cursor: pointer;
  height: 4px;
}

#volume input[type=range]::-moz-range-thumb {
  border: 0 solid rgba(0, 0, 0, 0);
  height: 4px;
  width: 3px;
  border-radius: 0;
  background: rgba(255, 143, 53, 0.7);
  cursor: pointer;
  box-shadow: 0 0 2px black;
}

#volume input[type=range]::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  border-radius: 1px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  background: rgba(246, 255, 252, 0.4);
}

#volume input[type=range]::-webkit-slider-thumb {
  box-shadow: 0 0 2px black;
  border: 0 solid rgba(0, 0, 0, 0);
  height: 5px;
  width: 3px;
  border-radius: 0;
  background: rgba(255, 143, 53, 0.7);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -0.1px;
}

#volume input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 7px;
  cursor: pointer;
  border-radius: 1px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  background: rgba(246, 255, 252, 0.4);
}

#progress {
  height: 9px;
  width: 100%;
  line-height: 5px;
}

#progress input[type=range] {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  box-shadow: none;
}

#progress input[type=range]:focus {
  outline: none;
  background: rgba(246, 255, 252, 0.4);
}

#progress input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  background: rgba(246, 255, 252, 0.4);
}

#progress input[type=range]::-webkit-slider-thumb {
  box-shadow: 0 0 2px black;
  border: 0 solid rgba(0, 0, 0, 0);
  height: 4px;
  width: 12px;
  background: #ff8f35;
  cursor: pointer;
  -webkit-appearance: none;
  border-radius: 1px;
}

#progress input[type=range]:focus::-webkit-slider-runnable-track {
  background: rgba(0, 130, 195, 0);
}

#progress input[type=range]::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  background: rgba(246, 255, 252, 0.4);
}

#progress input[type=range]::-moz-range-thumb {
  box-shadow: 0 0 2px black;
  border: 0 solid rgba(0, 0, 0, 0);
  height: 4px;
  width: 12px;
  background: #ff8f35;
  cursor: pointer;
  -webkit-appearance: none;
  border-radius: 1px;
}

</style>
