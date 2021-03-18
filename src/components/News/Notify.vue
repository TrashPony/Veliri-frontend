<template>
  <div>
    <div class="missionNotify" v-if="notify.name === 'craft'">

      <div class="head">
        <div class="notify_time">{{ getDateTime(notify.time) }}</div>
        <div class="head_title">Завершено производство</div>
      </div>

      <div class="notifyParagraph">
        На базе <span class="importantly">{{ notify.base.name }}</span>
        что в секторе <span class="importantly">{{ notify.map.Name }}</span>
        завершено производство
        <div class="notifyIconItem">
          <app-background-item-cell v-bind:slotItem="notify.item"/>
        </div>
        <span class="importantly">{{ notify.item.item.name }}</span>
        в количестве <span class="importantly">{{ notify.item.quantity }}</span> единиц.
        <p> Созданные вещи ожидают вас на складе базы <span class="importantly">{{ notify.base.name }}</span></p>
      </div>
    </div>

    <div class="missionNotify" v-if="notify.name === 'sell' || notify.name === 'buy'">

      <div class="head">
        <div class="notify_time">{{ getDateTime(notify.time) }}</div>
        <div class="head_title">Совершена {{ typeDealName(notify.name)[0] }}</div>
      </div>

      <div class="notifyParagraph">
        На базе <span class="importantly">{{ notify.base.name }}</span>
        что в секторе <span class="importantly">{{ notify.map.Name }}</span>
        было {{ typeDealName(notify.name)[1] }}
        <div class="notifyIconItem">
          <app-background-item-cell v-bind:slotItem="notify.item"/>
        </div>
        <span class="importantly">{{ notify.item.item.name }}</span>
        в количестве <span class="importantly">{{ notify.item.quantity }}</span> единиц, по цене <span
        class="importantly">{{ notify.price }}</span>
        <span class="cr">cr</span> за шт.
        <p>Общая стоимость сделки составила <span
          class="importantly">{{ notify.item.quantity * notify.price }}</span>
          <span class="cr">cr</span>.</p>
        <p>{{ typeDealName(notify.name)[2] }}</p>
      </div>
    </div>

    <div v-if="notify.name === 'skill_up'" style="background: #ff9700">
      <div class="missionNotify">

        <div class="head">
          <div class="notify_time">{{ getDateTime(notify.time) }}</div>
          <div class="head_title"></div>
        </div>

        <p v-html="skillUp(notify)"></p>
      </div>
    </div>

    <!--      EXPEDITION NOTIFY-->
    <div v-if="notify.event === 'new_expedition'" style="background: #b3ff00">
      <div class="missionNotify">

        <div class="head">
          <div class="notify_time">{{ getDateTime(notify.time) }}</div>
          <div class="head_title">Экспедиция</div>
        </div>

        <p>
          <span class="importantly">{{ notify.broadcast_fraction }}</span> отправляет
          экспедицию в сектор "<span class="importantly">{{ notify.data.to_map }}</span>", экспедиция отправляется из
          сектора "<span class="importantly">{{ notify.data.map }}</span>".
        </p>
      </div>
    </div>

    <div v-if="notify.event === 'place_expedition'" style="background: #b3ff00">
      <div class="missionNotify">

        <div class="head">
          <div class="notify_time">{{ getDateTime(notify.time) }}</div>
          <div class="head_title">Экспедиция</div>
        </div>

        <p>
          Экспедиции <span class="importantly">{{ notify.broadcast_fraction }}</span> удалось
          закрепиться в секторе "<span class="importantly">{{ notify.data.map }}</span>".
        </p>
      </div>
    </div>

    <div v-if="notify.event === 'destroy_expedition'" style="background: #b3ff00">
      <div class="missionNotify">

        <div class="head">
          <div class="notify_time">{{ getDateTime(notify.time) }}</div>
          <div class="head_title">Экспедиция</div>
        </div>

        <p>
          Экспедиция <span class="importantly">{{ notify.broadcast_fraction }}</span> в секторе
          "<span class="importantly">{{ notify.data.map }}</span>" потеряла основные силы, деятельность экспедиции в
          этом секторе прекращается.
        </p>
      </div>
    </div>

    <div v-if="notify.event === 'expedition_trader'" style="background: #b3ff00">
      <div class="missionNotify">

        <div class="head">
          <div class="notify_time">{{ getDateTime(notify.time) }}</div>
          <div class="head_title">Экспедиция</div>
        </div>

        <p>
          Отряд экспедиции <span class="importantly">{{ notify.broadcast_fraction }}</span>
          отправляется в сектор "<span class="importantly">{{ notify.data.map }}</span>".
        </p>
      </div>
    </div>

    <!--      CAPTURES NOTIFY-->
    <template v-if="notify.data">
      <div v-if="notify.event === 'capture_base' && notify.data.lose !== ''" style="background: #0048ff">
        <div class="missionNotify">

          <div class="head">
            <div class="notify_time">{{ getDateTime(notify.time) }}</div>
            <div class="head_title">Фракционная война</div>
          </div>

          <p>
            Наши силы смогли уничтожить маяк управления у базы <span class="importantly">{{ notify.data.base }}</span>
            в
            секторе <span class="importantly">{{ notify.data.map }}</span>, ранее они принадлежана <span
            class="importantly">{{ notify.data.lose }}</span>.
          </p>
        </div>
      </div>


      <div class="missionNotify" v-if="notify.event === 'capture_base' && notify.data.lose === ''">

        <div class="head">
          <div class="notify_time">{{ getDateTime(notify.time) }}</div>
          <div class="head_title">Фракционная война</div>
        </div>

        <p>
          Наши силы захватили базу <span class="importantly">{{ notify.data.base }}</span> в секторе
          <span class="importantly">{{ notify.data.map }}</span>.
        </p>
      </div>

      <div class="missionNotify" v-if="notify.event === 'lose_base'">

        <div class="head">
          <div class="notify_time">{{ getDateTime(notify.time) }}</div>
          <div class="head_title">Фракционная война</div>
        </div>

        <p>
          Мы потерпели поражение и потеряли базу <span class="importantly">{{ notify.data.base }}</span> в секторе
          <span class="importantly">{{ notify.data.map }}</span>.
        </p>

      </div>

      <div class="missionNotify" v-if="notify.event === 'capture_base_other' && notify.data.lose === ''">

        <div class="head">
          <div class="notify_time">{{ getDateTime(notify.time) }}</div>
          <div class="head_title">Фракционная война</div>
        </div>

        <p>
          <span class="importantly">{{ notify.data.capture }}</span> взяли под контроль базу <span
          class="importantly">{{ notify.data.base }}</span> в секторе <span class="importantly">{{
            notify.data.map
          }}</span>.
        </p>

      </div>


      <div class="missionNotify"
           v-if="notify.event === 'capture_base_other' && (notify.data.capture === '' || notify.data.lose === notify.data.capture)">

        <div class="head">
          <div class="notify_time">{{ getDateTime(notify.time) }}</div>
          <div class="head_title">Фракционная война</div>
        </div>

        <p>
          Разведка сообщает что база <span class="importantly">{{ notify.data.base }}</span> в секторе <span
          class="importantly">{{ notify.data.map }}</span> снова спободна.
        </p>
      </div>

      <div class="missionNotify"
           v-if="notify.event === 'capture_base_other' && notify.data.lose !== '' && notify.data.lose !== notify.data.capture">

        <div class="head">
          <div class="notify_time">{{ getDateTime(notify.time) }}</div>
          <div class="head_title">Фракционная война</div>
        </div>

        <p>
          Враги сражаются друг с другом! <span class="importantly">{{ notify.data.capture }}</span> уничтожили маяк
          управления <span class="importantly">{{ notify.data.lose }}</span> у базы <span
          class="importantly">{{ notify.data.base }}</span>, в секторе <span class="importantly">{{
            notify.data.map
          }}</span>
        </p>
      </div>
    </template>

    <!--      BASES NOTIFY-->
    <div class="missionNotify" v-if="notify.event === 'base_min_tax'">

      <div class="head">
        <div class="notify_time">{{ getDateTime(notify.time) }}</div>
        <div class="head_title">Производство</div>
      </div>

      <p>
        На базе <span class="importantly">{{ notify.data.base }}</span> (сектор: <span
        class="importantly">{{ notify.data.map }}</span>) установлен минимальный налог на переработку полезных
        ископаемых. // TODO указывать на какие именно
      </p>
    </div>

    <div class="missionNotify" v-if="notify.event === 'base_max_efficiency'">
      <div class="head">
        <div class="notify_time">{{ getDateTime(notify.time) }}</div>
        <div class="head_title">Производство</div>
      </div>

      <p>
        База <span class="importantly">{{ notify.data.base }}</span> достигла максимальной эффективности (сектор:
        <span class="importantly">{{ notify.data.map }}</span>).
        Для создания предметов не требуются допальнительные затраты.
      </p>
    </div>

    <div class="missionNotify" v-if="notify.event === 'meteorite_rain'">

      <div class="head">
        <div class="notify_time">{{ getDateTime(notify.time) }}</div>
        <div class="head_title">Аномалия</div>
      </div>

      <p>
        Сканеры показывают что в секторе <span class="importantly">{{ notify.data.map }}</span> начался метеоритный
        дождь!
      </p>
    </div>
  </div>
</template>

<script>
import BackgroundItemCell from '../Inventory/BackgroundItemCell';

export default {
  name: "Notify",
  props: ["notify"],
  methods: {
    typeDealName(typeDeal) {
      if (typeDeal === 'sell') {
        return ['продажа', 'продано', ''];
      } else if (typeDeal === "buy") {
        return ['покупка', 'куплено', 'Купленные вещи ожидают вас на складе базы <span class="importantly">' + notify.base.name + '</span>'];
      }
    },
    getDateTime(time) {
      let now = new Date(time / 1000000);
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let second = now.getSeconds();
      if (month.toString().length === 1) {
        month = '0' + month;
      }
      if (day.toString().length === 1) {
        day = '0' + day;
      }
      if (hour.toString().length === 1) {
        hour = '0' + hour;
      }
      if (minute.toString().length === 1) {
        minute = '0' + minute;
      }
      if (second.toString().length === 1) {
        second = '0' + second;
      }

      return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    },
    skillUp(notify) {
      if (this.handbook["skill"][this.language][notify.text] && this.handbook["skill"][this.language][notify.text].hasOwnProperty('name')) {
        let skillName = this.handbook["skill"][this.language][notify.text].name;
        if (this.language === 'RU') {
          return `Уровень <span class="importantly"> ${skillName} </span> повышен до
                <span class="importantly"> ${notify.count} </span> уровня.`
        } else {
          return `Lvl up <span class="importantly"> ${skillName} </span> to
                <span class="importantly"> ${notify.count} </span> level.`
        }
      } else {
        return `<span class="importantly">[delete]</span>`;
      }
    },
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    },
    user() {
      return this.$store.getters.getUser
    },
    currentUser() {
      return this.$store.getters.getUser
    },
  },
  components: {
    AppBackgroundItemCell: BackgroundItemCell,
  }
}
</script>

<style scoped>
.missionNotify {
  position: absolute;
  bottom: 10px;
  left: 0;
  background-color: rgba(7, 41, 60, 0.8);
  border-radius: 5px 0 0 5px;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  overflow-y: scroll;
  z-index: 1;
  color: white;
  font-size: 12px;
  padding: 5px;
  overflow-x: hidden;
  min-height: 100px;
  max-height: 190px;
  width: 250px;
  box-shadow: 0 0 2px black;
}

.missionNotify h3 {
  margin: 0;
  text-align: left;
  padding-left: 5px;
  color: yellow;
}

.missionNotify h4 {
  margin: 0;
  color: #78ff00;
  font-size: 11px;
  text-align: left;
  padding-left: 5px;
}

.missionNotify p {
  text-align: justify;
  padding: 5px;
  margin: 5px 0;
  text-indent: 1.5em;
  font-size: 10px;
}

.notifyParagraph {
  text-align: justify;
  padding: 5px;
  color: #ff8100;
  margin: 5px 0;
  text-indent: 1.5em;
}

.missionNotify a:visited {
  text-decoration: none;
  color: aqua;
}

.missionNotify a:hover {
  text-decoration: none;
  color: #0093ff;
}

.notifyIconItem {
  display: inline-block;
  height: 35px;
  width: 35px;
  position: relative;
  box-shadow: inset 0 0 4px 0 white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin: 0 4px;
}

.head {
  clear: both;
  margin-bottom: 25px;
  margin-top: -3px;
  margin-left: -2px;
}

.notify_time {
  font-size: 8px;
  font-family: 'Audiowide', cursive;
  color: #adacac;
  float: left;
}

.head_title {
  float: left;
  color: #f1bd00;
  clear: both;
  font-size: 11px;
}
</style>
