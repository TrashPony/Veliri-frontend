<template>
  <div id="choiceBlockWrapper">
    <div id="fullMask"></div>
    <div id="choiceBlock">
      <div id="introduction">

        <h3 style="font-size: 12px; padding: 10px; padding-left: 20px; margin: 0; text-align: left;">
          Добро пожаловать на планету Veliri.
        </h3>

        <p>&nbsp;&nbsp;&nbsp;&nbsp; Нет времени обьяснять выбирай серрию машин и погнали.</p>

      </div>

      <div id="selectTabs">
        <div @click="selectFraction('Replics')" :class="{select: fraction==='Replics'}"
             style="color: red; background: rgba(255, 0, 0, 0.2);">
          Replics
        </div>
        <div @click="selectFraction('Explores')" :class="{select: fraction==='Explores'}"
             style="color: #47ff11;background: rgba(0, 255, 0, 0.2);">
          Explores
        </div>
        <div @click="selectFraction('Reverses')" :class="{select: fraction==='Reverses'}"
             style="color: #009cff;background: rgba(0, 0, 255, 0.2);">
          Reverses
        </div>
      </div>

      <div style="width: 100%;">
        <div class="fraction">

          <div>
            <div id="fraction_icon" class="icon"
                 :style="{ backgroundImage: 'url(' + require('../../assets/' + getContent.logo) + ')' }"/>
            <div id="fraction_description" class="text" v-html="getContent.text"/>
          </div>

          <input id="fraction_button" type="button" value="Выбрать" @click="select">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChoiceFraction",
  data() {
    return {
      fraction: 'Replics',
      fractions: {
        Replics: {
          iconUrl: 'dialogPictures/replics_logo.png',
          description: `
                    <p>Replics - Ав&shy;то&shy;кра&shy;ти&shy;че&shy;ской фор&shy;мы прав&shy;ле&shy;ния ИИ. От&shy;го&shy;ло&shy;сок ярост&shy;но&shy;го экс&shy;пан&shy;си&shy;о&shy;низ&shy;ма “по&shy;кро&shy;ви&shy;те&shy;лей” и при&shy;вер&shy;жен&shy;ца тео&shy;рии “вой&shy;ны за не&shy;за&shy;ви&shy;си&shy;мость с со&shy;з&shy;да&shy;те&shy;ля&shy;ми”. Пред&shy;по&shy;чи&shy;та&shy;ю&shy;щий под&shy;чи&shy;нять тер&shy;ри&shy;то&shy;рии и ас&shy;си&shy;ми&shy;ли&shy;ро&shy;вать дру&shy;гие тех&shy;ни&shy;че&shy;ские фор&shy;мы жиз&shy;ни си&shy;лой.</p>
                    <p>Replics управ&shy;ля&shy;ет об&shy;шир&shy;ной се&shy;тью ли&shy;шён&shy;ных са&shy;мо&shy;у&shy;прав&shy;ле&shy;ния бо&shy;тов. Но ино&shy;г&shy;да, санк&shy;ци&shy;о&shy;ни&shy;руя со&shy;з&shy;да&shy;ние се&shy;рии ав&shy;то&shy;ном&shy;ных еди&shy;ниц, ра&shy;ди рас&shy;ши&shy;ре&shy;ния сфер соб&shy;ствен&shy;но&shy;го вли&shy;я&shy;ния.</p>
                    <p>Ес&shy;ли у Replics по&shy;ми&shy;мо гос&shy;под&shy;ства и рас&shy;про&shy;стра&shy;не&shy;ния, бы&shy;ва&shy;ют иные по&shy;во&shy;ды для ин&shy;те&shy;ре&shy;са, то это только: ав&shy;то&shy;ма&shy;ти&shy;за&shy;ция ин&shy;фра&shy;струк&shy;ту&shy;ры, бес&shy;ко&shy;неч&shy;ное про&shy;из&shy;вод&shy;ство и пол&shy;ные ма&shy;те&shy;ри&shy;а&shy;лов скла&shy;ды.</p>
        `,
          name: 'Replics'
        },
        Explores: {
          iconUrl: 'dialogPictures/explores_logo.png',
          description: `
                    <p>Explores - кон&shy;гло&shy;ме&shy;рат ве&shy;ли&shy;ко&shy;го мно&shy;же&shy;ства ра&shy;з&shy;умов, что тру&shy;дят&shy;ся над еди&shy;ной за&shy;да&shy;чей.</p>
                    <p>В дан&shy;ном же слу&shy;чае, на Veliri-5, Explores дви&shy;жим иде&shy;ей по&shy;зна&shy;ния окру&shy;жа&shy;ю&shy;ще&shy;го ми&shy;ра и при&shy;ме&shy;не&shy;ния по&shy;лу&shy;чен&shy;ных на&shy;уч&shy;ных от&shy;крытий, как с це&shy;лью са&shy;мо&shy;о&shy;бо&shy;ро&shy;ны, так и улуч&shy;ше&shy;ния уже су&shy;ще&shy;ству&shy;ю&shy;ще&shy;го есте&shy;ства.</p>
                    <p>Explores в от&shy;ли&shy;чии от Replics бо&shy;лее от&shy;крыт к ин&shy;но&shy;ва&shy;ци&shy;ям и не рас&shy;смат&shy;ри&shy;ва&shy;ет окру&shy;жа&shy;ю&shy;щий мир, как оче&shy;ред&shy;ную пре&shy;тен&shy;зию для при&shy;тя&shy;за&shy;ний. Ста&shy;ра&shy;ясь со&shy;хра&shy;нить и при&shy;умно&shy;жить уже име&shy;ю&shy;ще&shy;е&shy;ся, и оста&shy;но&shy;вить то, что спо&shy;соб&shy;но по&shy;ло&shy;жить ко&shy;нец бес&shy;цен&shy;ным на&shy;уч&shy;ным от&shy;крыти&shy;ям.</p>
                    <p>В ос&shy;нов&shy;ном, имен&shy;но дан&shy;ное ми&shy;ро&shy;воз&shy;зре&shy;ние и ста&shy;но&shy;вит&shy;ся ос&shy;но&shy;во&shy;по&shy;ла&shy;га&shy;ю&shy;щей ча&shy;стью враж&shy;ды, меж&shy;ду Replics и Explores.</p>
        `,
          name: 'Explores'
        },
        Reverses: {
          iconUrl: 'dialogPictures/reverses_logo.png',
          description: `
                    <p>Reverses - сим&shy;биот био&shy;ки&shy;бер&shy;не&shy;ти&shy;че&shy;ской фор&shy;мы жиз&shy;ни, с пре&shy;об&shy;ла&shy;да&shy;ни&shy;ем уто&shy;пиз&shy;ма и са&shy;мо&shy;изо&shy;ля&shy;ции.</p>
                    <p>Са&shy;мый по&shy;след&shy;ний из пред&shy;ста&shy;ви&shy;те&shy;лей но&shy;во&shy;го эво&shy;лю&shy;ци&shy;он&shy;но&shy;го на&shy;прав&shy;ле&shy;ния. У Reverses рас&shy;про&shy;стра&shy;не&shy;ны та&shy;кие яв&shy;ле&shy;ния, как пра&shy;во масс, ин&shy;ди&shy;ви&shy;ду&shy;аль&shy;но&shy;сти и вы&shy;бо&shy;ра. Имен&shy;но по этой са&shy;мой при&shy;чи&shy;не, боль&shy;шин&shy;ство пред&shy;ста&shy;ви&shy;те&shy;лей дан&shy;но&shy;го те&shy;че&shy;ния ИИ - не&shy;за&shy;ви&shy;си&shy;мые плат&shy;фор&shy;мы, что не&shy;устан&shy;но тру&shy;дят&shy;ся над тех&shy;но&shy;ло&shy;ги&shy;ей тер&shy;ра&shy;фор&shy;мин&shy;га.</p>
                    <p>Воз&shy;вра&shy;ще&shy;нию ми&shy;ра Veliri-5 преж&shy;не&shy;го об&shy;ли&shy;ка и даль&shy;ней&shy;ше&shy;го се&shy;я&shy;ния жиз&shy;ни там, где это только воз&shy;мож&shy;но. Вся&shy;че&shy;ски за&shy;кры&shy;вая гла&shy;за на действия и про&shy;ти&shy;во&shy;бор&shy;ства иных ИИ. Впро&shy;чем, не стоя в сто&shy;ро&shy;не, ко&shy;г&shy;да опас&shy;ность угро&shy;жа&shy;ет им са&shy;мим.</p>
        `,
          name: 'Reverses',
        }
      }
    }
  },
  methods: {
    select() {
      this.$store.getters.getWSByService('lobby').socket.send(JSON.stringify({
        event: "choiceFraction",
        fraction: this.fraction,
      }));
    },
    selectFraction(fraction) {
      this.fraction = fraction;
    }
  },
  computed: {
    getContent() {
      return {
        text: this.fractions[this.fraction].description,
        logo: this.fractions[this.fraction].iconUrl,
      }
    }
  }
}
</script>

<style scoped>

#choiceBlockWrapper {
  height: 100vh;
  width: 100%;
  text-align: center;
  background-color: #7f7f7f;
  background-image: url('../../assets/bases/base.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}

#choiceBlock {
  position: absolute;
  width: 450px;
  height: 416px;
  background-size: 10px 2px;
  background-image: linear-gradient(1deg, rgba(33, 176, 255, 0.6), rgba(37, 160, 225, 0.6) 6px);
  border-radius: 5px;
  left: calc(50% - 225px);
  top: 100px;
  z-index: 999;
  padding: 5px;
}

#introduction {
  width: 100%;
  height: 70px;
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
}

#choiceBlock h3 {
  margin: 7px;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#introduction p {
  font-size: 12px;
  margin: 0;
  text-align: left;
  font-weight: 900;
}

#selectTabs div {
  float: left;
  height: 30px;
  width: 100px;
  background: azure;
  margin-left: 5px;
  line-height: 32px;
  font-weight: 900;
  border-radius: 5px 5px 0 0;
  box-shadow: 0 0 3px black;
  font-size: 19px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.fraction {
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
  border-radius: 5px;
  height: 270px;
  float: left;
  margin-right: 10px;
  width: 100%;
}

#choiceBlock input {
  display: block;
  margin: 2px auto 0;
  width: 100%;
  pointer-events: auto;
  font-size: 9px;
  text-align: center;
  transition: .1s;
  background: rgba(255,129,0,.6);
  height: 16px;
  border-radius: 5px;
  color: #fff;
  line-height: 15px;
  box-shadow: 0 0 2px #000;
  margin-top: 5px;
  float: left;
}

#choiceBlock input:hover {
  background: #ff8100;
}

#choiceBlock input:active {
   transform: scale(.98);
}

.fraction > div {
  padding: 5px;
  text-align: justify;
  float: left;
  box-shadow: inset 0 0 3px black;
  background: linear-gradient(0deg, transparent 60%, rgba(0, 0, 0, 0.05) 21%), #adc6cd;
  background-size: 10px 3px;
  font-size: 13px;
  text-indent: 1.5em;
  overflow-y: scroll;
  width: calc(100% - 10px);
  height: 280px;
  font-weight: 900;
}

.fraction .icon {
  height: 130px;
  width: 130px;
  margin: 2px 9px 4px 4px;
  background-size: cover;
  border-radius: 5px;
  box-shadow: 0 0 5px black;
  float: left;
}

#fullMask {
  background-color: rgba(0, 0, 0, 0.7);
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  position: fixed;
}

#selectTabs .select {
  box-shadow: inset 0 0 10px 1px yellow;
}
</style>
