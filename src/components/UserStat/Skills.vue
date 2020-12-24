<template>
  <div class="skills">
    <div id="HelpSections">

      <div class="button">
        {{ language === 'RU' ? 'Только изученые:' : 'Only studied:' }} <input v-model="onlyStudied" type="checkbox">
      </div>

      <template v-for="(section, key) in skills" v-if="!section.notList && key !== 'title'">

        <div class="helpSection"
             v-bind:class="{select: selectCat.main && selectCat.main === key}"
             @click="selectCat.main && selectCat.main === key ? selectCat.main = null: selectCat = {main: key}">
          {{ section.title }}
        </div>

        <template v-if="key === 'weapon' || key === 'body' || key === 'ammo'" v-for="(children, subKey) in section">

          <div class="helpSubSection" v-if="selectCat.main && selectCat.main === key && subKey !== 'title'"
               v-bind:class="{select: selectCat.sub && selectCat.sub === subKey}"
               @click="selectCat = {main: key, sub: subKey, twoSub: null}">
            {{ children.title }}
          </div>

          <div class="helpSubSection two"
               v-for="(children2, subKey2) in children"
               v-bind:class="{select: selectCat.twoSub && selectCat.twoSub === subKey2}"
               v-if="selectCat.main && selectCat.main === key && selectCat.sub && selectCat.sub === subKey && subKey2 !== 'title'"
               @click="selectCat = {main: key, sub: subKey, twoSub: subKey2}">
            {{ children2.title }}
          </div>

        </template>
      </template>
    </div>


    <div class="skillContent">
      <template v-for="(skill, key) in selectSkills" v-if="(onlyStudied && skill.level > 0) || !onlyStudied">

        <div class="skillWrap" v-if="key !== 'undefined'">

          <div class="detailSkillButton">
            <div class="detailSkill" v-html="handbook['skill'][language][skill.name].description"/>
          </div>

          <div class="skillHead">
            {{ handbook["skill"][language][skill.name] ? handbook["skill"][language][skill.name].name : '' }}
            <div style="margin-top: 6px">
              <span>Уровень: <span class="level">{{ skill.level }}</span></span>
              <span class="points">{{ skill.user_experience_point }} / {{ skill.need_points_to_up }}</span>
            </div>
          </div>

          <div class="skillRow">
            <div>
              <div :style="{width: getFillPercent(skill)}"></div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Input from "../Chat/Input";

export default {
  name: "Skills",
  components: {Input},
  data() {
    return {
      updater: null,
      selectCat: {
        main: null,
        sub: null,
        twoSub: null,
      },
      onlyStudied: false,
    }
  },
  destroyed() {
    if (this.updater) clearInterval(this.updater)
  },
  created() {
    let app = this;
    app.updater = setInterval(function () {
      app.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "GetMySkills",
      }));
    }, 1000);
  },
  mounted() {
    this.$parent.resize(null, null, $(this.$parent.$el))
  },
  methods: {
    getFillPercent(skill) {
      let percent = (100 / (skill.need_points_to_up / skill.user_experience_point));
      if (!percent > 0) {
        percent = 0
      }
      return percent + '%'
    }
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    },
    skills() {

      //  оружие {лазерное, ракетное, балистическое}
      //  корпуса {фракции {размеры}}
      //  переработка
      //  производство

      let skills = {
        weapon: {
          rocket: {
            small: {
              title: "малые"
            },
            medium: {
              title: "средние"
            },
            big: {
              title: "большие"
            },
            title: this.language === "RU" ? "Ракетное" : "Missile"
          },
          laser: {
            small: {
              title: "малые"
            },
            medium: {
              title: "средние"
            },
            big: {
              title: "большие"
            },
            title: this.language === "RU" ? "Лазерное" : "Laser"
          },
          ballistic: {
            small: {
              title: "малые"
            },
            medium: {
              title: "средние"
            },
            big: {
              title: "большие"
            },
            title: this.language === "RU" ? "Балистическое" : "Ballistic"
          },
          title: this.language === "RU" ? "Оружие" : "Weapon"
        },
        ammo: {
          rocket: {
            small: {
              title: "малые"
            },
            medium: {
              title: "средние"
            },
            big: {
              title: "большие"
            },
            title: this.language === "RU" ? "Ракетное" : "Missile"
          },
          laser: {
            small: {
              title: "малые"
            },
            medium: {
              title: "средние"
            },
            big: {
              title: "большие"
            },
            title: this.language === "RU" ? "Лазерное" : "Laser"
          },
          ballistic: {
            small: {
              title: "малые"
            },
            medium: {
              title: "средние"
            },
            big: {
              title: "большие"
            },
            title: this.language === "RU" ? "Балистическое" : "Ballistic"
          },
          title: this.language === "RU" ? "Боеприпасы" : "Ammo"
        },
        body: {
          explores: {
            small: {
              title: "легкие"
            },
            medium: {
              title: "средние"
            },
            big: {
              title: "тяжелые"
            },
            title: "explores"
          },
          replics: {
            small: {
              title: "легкие"
            },
            medium: {
              title: "средние"
            },
            big: {
              title: "тяжелые"
            },
            title: "replics"
          },
          reverses: {
            small: {
              title: "легкие"
            },
            medium: {
              title: "средние"
            },
            big: {
              title: "тяжелые"
            },
            title: "reverses"
          },
          title: this.language === "RU" ? "Корпуса" : "Bodies"
        },
        ore: {
          title: this.language === "RU" ? "Добыча полезных ископаемых" : "Mining"
        },
        production: {
          title: this.language === "RU" ? "Производство" : "Production"
        },
        processing: {
          title: this.language === "RU" ? "Переработка полезных ископаемых" : "Processing"
        },
      };

      for (let i in this.$store.getters.getChatState.mySkills) {
        if (this.$store.getters.getChatState.mySkills.hasOwnProperty(i)) {
          let skill = this.$store.getters.getChatState.mySkills[i];

          if (skill.type === 'weapon' || skill.type === 'ammo') {
            if (skill.name.includes('rocket')) {
              if (skill.name.includes('small')) skills[skill.type].rocket.small[i] = skill;
              if (skill.name.includes('medium')) skills[skill.type].rocket.medium[i] = skill;
              if (skill.name.includes('big')) skills[skill.type].rocket.big[i] = skill;
            }
            if (skill.name.includes('laser')) {
              if (skill.name.includes('small')) skills[skill.type].laser.small[i] = skill;
              if (skill.name.includes('medium')) skills[skill.type].laser.medium[i] = skill;
              if (skill.name.includes('big')) skills[skill.type].laser.big[i] = skill;
            }
            if (skill.name.includes('ballistic')) {
              if (skill.name.includes('small')) skills[skill.type].ballistic.small[i] = skill;
              if (skill.name.includes('medium')) skills[skill.type].ballistic.medium[i] = skill;
              if (skill.name.includes('big')) skills[skill.type].ballistic.big[i] = skill;
            }
          } else if (skill.type === 'body') {
            if (skill.name.includes('explores')) {
              if (skill.name.includes('small')) skills[skill.type].explores.small[i] = skill;
              if (skill.name.includes('medium')) skills[skill.type].explores.medium[i] = skill;
              if (skill.name.includes('big')) skills[skill.type].explores.big[i] = skill;
            }
            if (skill.name.includes('replics')) {
              if (skill.name.includes('small')) skills[skill.type].replics.small[i] = skill;
              if (skill.name.includes('medium')) skills[skill.type].replics.medium[i] = skill;
              if (skill.name.includes('big')) skills[skill.type].replics.big[i] = skill;
            }
            if (skill.name.includes('reverses')) {
              if (skill.name.includes('small')) skills[skill.type].reverses.small[i] = skill;
              if (skill.name.includes('medium')) skills[skill.type].reverses.medium[i] = skill;
              if (skill.name.includes('big')) skills[skill.type].reverses.big[i] = skill;
            }
          } else {
            skills[skill.type][i] = skill;
          }
        }
      }

      return skills;
    },
    selectSkills() {
      let skills = {};

      if (!this.selectCat.main) {
        return this.$store.getters.getChatState.mySkills
      }

      if (this.selectCat.main === 'weapon' || this.selectCat.main === 'ammo' || this.selectCat.main === 'body') {
        if (!this.selectCat.sub) {
          for (let i in this.skills[this.selectCat.main]) {
            for (let j in this.skills[this.selectCat.main][i]) {
              for (let k in this.skills[this.selectCat.main][i][j]) {
                skills[this.skills[this.selectCat.main][i][j][k].name] = this.skills[this.selectCat.main][i][j][k]
              }
            }
          }
        } else {
          if (!this.selectCat.twoSub) {
            for (let i in this.skills[this.selectCat.main][this.selectCat.sub]) {
              for (let j in this.skills[this.selectCat.main][this.selectCat.sub][i]) {
                skills[this.skills[this.selectCat.main][this.selectCat.sub][i][j].name] = this.skills[this.selectCat.main][this.selectCat.sub][i][j]
              }
            }
          } else {
            for (let j in this.skills[this.selectCat.main][this.selectCat.sub][this.selectCat.twoSub]) {
              skills[this.skills[this.selectCat.main][this.selectCat.sub][this.selectCat.twoSub][j].name] = this.skills[this.selectCat.main][this.selectCat.sub][this.selectCat.twoSub][j]
            }
          }
        }
      } else {
        for (let i in this.skills[this.selectCat.main]) {
          skills[this.skills[this.selectCat.main][i].name] = this.skills[this.selectCat.main][i]
        }
      }

      return skills
    }
  }
}
</script>

<style scoped>

.skillContent {
  margin: 0 auto 0;
  overflow-y: scroll;
  height: 188px;
  border-radius: 0;
  box-shadow: inset 0 0 1px black;
  background: #89969c;
  pointer-events: auto;
  overflow-x: hidden;
  width: 235px;
  text-align: left;
  font-size: 13px;
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, 0.4);
}

.skills {
  float: left;
  width: 100%;
  margin-top: 2px;
  height: 200px;
}

#HelpSections {
  float: left;
  height: calc(100%);
  width: 150px;
  box-shadow: inset 0 0 2px black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.2);
  margin-right: 3px;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
}

.helpSection, .helpSubSection {
  text-align: left;
  display: block;
  width: calc(100% - 4px);
  padding-left: 4px;
  background: rgb(222, 101, 40);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  margin: 2px 0 0 2px;
  font-size: 10px;
  line-height: 17px;
  height: 16px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
  float: left;
  box-shadow: 0 0 2px black;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.helpSubSection {
  background: rgb(158, 69, 24);
  margin-left: 10px;
  font-size: 10px;
}

.helpSubSection.two {
  margin-left: 20px;
}

.helpSection:hover, .helpSubSection:hover {
  box-shadow: 0 0 2px rgb(255, 255, 255);
}

.helpSection:active, .helpSubSection:active {
  transform: scale(0.98);
}

.skillRow {
  height: 20px;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 0 2px black;
}

.skillRow > div {
  position: relative;
  width: calc(100% - 4px);
  height: 16px;
  margin: 2px;
  background: rgb(145, 145, 145);
  float: left;
  border-radius: 5px;
  box-shadow: inset 0 0 2px black;
  overflow: hidden;
}

.skillRow > div > div {
  top: 0;
  left: 0;
  position: absolute;
  height: 100%;
  width: 50%;
  box-shadow: inset 0 0 4px 1px black;
  background: #008ee2;
}

.skillHead {
  color: #f1f1f1;
  font-size: 10px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  height: 32px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 2px;
}

.skillHead .points {
  color: yellow;
  float: right;
}

.level {
  color: #ffc800;
  font-size: 15px;
  line-height: 11px;
}

.skillWrap {
  padding: 4px 5px 4px 5px;
  background: rgba(0, 0, 0, 0.17);
  margin-bottom: 5px;
  border-radius: 5px;
  box-shadow: 0 0 2px black;
  position: relative;
}

.skillWrap:last-child {
  margin-bottom: 0;
}

.button {
  width: 150px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  float: left;
  left: 0;
  box-shadow: 0 0 2px black;
  color: #f1f1f1;
  font-size: 11px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  line-height: 21px;
  padding-left: 5px;
  top: 0;
  position: sticky;
}

.button input {
  float: right;
  margin-right: 20px;
}

.helpSubSection.select {
  background: #67b5bf;
}

.helpSection.select {
  background: #67b5bf;
}

.detailSkillButton {
  height: 15px;
  width: 15px;
  position: absolute;
  right: 3px;
  top: 3px;
  background-image: url(https://img.icons8.com/flat_round/64/000000/question-mark.png);
  background-size: contain;
  border-radius: 50%;
  box-shadow: 0 0 2px black;
  opacity: 0.5;
  transition: 200ms;
  z-index: 10;
}

.detailSkillButton:hover {
  opacity: 1;
}

.detailSkill {
  position: absolute;
  top: 100%;
  right: 100%;
  min-height: 25px;
  width: 200px;
  padding: 3px;
  border-radius: 3px;
  z-index: 20;
  color: white;
  visibility: hidden;
  transition: 0ms;
  box-shadow: 0 0 2px black;
  border: 1px solid rgba(37, 160, 225, 0.75);
  background: rgb(14 89 128);
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}


.detailSkillButton:hover .detailSkill {
  visibility: visible;
}
</style>
<style>
.detailSkill p {
  text-indent: 1.5em;
  margin: 0 auto 10px;
}
</style>
