<template>
  <div id="helpWrapper" ref="helpWrapper" @mousedown="toUp">

    <app-control v-bind:head="'Помощь'"
                 v-bind:move="true"
                 v-bind:close="true"
                 v-bind:refWindow="'helpWrapper'"
                 v-bind:noHeight="true"
                 v-bind:noWidth="true"/>

    <div id="HelpSections">
      <template v-for="(section, key) in sections" v-if="!section.notList">

        <div class="helpSection" @click="selectPage({page: key, subPage: null})">{{ section.title }}</div>

        <div class="helpSubSection" v-for="(children, subKey) in section.children"
             @click="selectPage({page: key, subPage: subKey})">
          {{ children.title }}
        </div>

      </template>
    </div>

    <div id="HelpContentWrapper">
      <div id="HelpHead">
        {{
          contentSection.subPage !== null ? sections[contentSection.page].title + ' / ' +
            sections[contentSection.page].children[contentSection.subPage].title : sections[contentSection.page].title
        }}
      </div>
      <div id="HelpContent">
        <v-runtime-template
          :template="contentSection.subPage !== null ? sections[contentSection.page].children[contentSection.subPage].content : sections[contentSection.page].content"/>
      </div>
    </div>

  </div>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import Control from '../Window/Control';

/** ¯\_(ツ)_/¯ **/

export default {
  name: "Help",
  props: ['meta'],
  mounted() {
    $(this.$el).resizable({
      handles: "s",
      alsoResize: "#HelpSections, #HelpContentWrapper, #HelpContent",
      resize: function (event, ui) {
        let HelpSections = $('#HelpSections');
        let HelpContentWrapper = $('#HelpContentWrapper');
        let HelpContent = $('#HelpContent');

        HelpSections.css("width", 190);
        HelpContentWrapper.css("width", 507);
        HelpContent.css("width", 497);
      },
    });
  },
  methods: {
    toUp() {
      this.$store.commit({
        type: 'setWindowZIndex',
        id: this.$el.id,
      });
    },
    selectPage(page) {
      this.select = page
    },
    selectPageByName(name) {
      for (let i in this.sections) {
        if (name === this.sections[i].title) {
          this.select = {page: i, subPage: null}
        }
        for (let sI in this.sections[i].children) {
          if (name === this.sections[i].children[sI].title) {
            this.select = {page: i, subPage: sI}
          }
        }
      }
    }
  },
  components: {
    AppControl: Control,
    VRuntimeTemplate,
  },
  computed: {
    contentSection() {

      if (this.select) return this.select;

      if (this.$props.meta && this.$props.meta.name) {
        this.selectPageByName(this.$props.meta.name);
        return this.select;
      }

      return {page: 0, subPage: null};
    }
  },
  data() {
    return {
      select: null,
      sections: [
        {
          title: "Движение",
          content: `
            <div>
                <ul>
                    <li><a @click="selectPageByName('Управление')">Управление</a></li>
                    <li><a @click="selectPageByName('Топливо')">Топливо</a></li>
                    <li><a @click="selectPageByName('Форсаж')">Форсаж</a></li>
                </ul>
            </div>
        `,
          children: [
            {
              title: "Управление", content: `
                    <div>
                      <div style="float: left;">
                          <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/move1.jpg')}); width: 128px; height: 128px;"></div>
                          <p>Управление движенией машиной осуществляется с помощью клавиш WASD</p>
                      </div>
                      <div style="margin-top: 5px; float: left;">
                          <p>Что бы передвинуть камеру зажмите в игре правую кнопку мыши и потяните ее в сторону.</p>
                          <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/contol_camera.png')}); width: 100%; height: 134px; background-size: contain;"></div>
                      </div>
                      <div style="margin-top: 5px; float: left;">
                          <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/contol_camera_2.png')}); width: 256px; height: 280px;"></div>
                          <p>Что бы отцентровать вам транспорт на камере необходимо нажать желтую стрелку</p>
                          <p>Изменение масштаба камеры регулируется кнопками +- помеченые розовой стрелкой</p>
                      </div>
                    </div>
                `
            }, {
              title: "Топливо", content: `
                    <div>
                      <div>
                          <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/power1.jpg')}); width: 100%; height: 84px; background-size: contain;"></div>
                          <p>Для передвижения необходимо топливо, оно тратиться когда вы набираете скорость, так же топливо тратиться на снаряжение.</p>
                      </div>
                      <div style="clear: both">
                          <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/power2.jpg')});  width: 100%; height: 81px; background-size: contain;"></div>
                          <p>У некоторых корпусов 2 или более топлевные ячейки, они тратять соотвественно х2 и более топлива на движение.</p>
                          <p>Если у корпуса укоплектованы не все ячейки то максимальная скорость и скорость разгона снизятся. Если топлива совсем нет то скорость уменьшается до 20%.</p>
                      </div>
                    </div>
                `
            }, {
              title: "Форсаж", content: `
                    <div>
                        <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/power3.jpg')}); width: 100%; height: 85px; background-size: contain;"></div>
                        <p>У вас есть возможность увеличить выробатку энергии и скорость машины в 2 раза включив формасаж, но вы можете умереть :3</p>
                        <p>Когда активирован форсаж то ваш реактор получает урон что сказывается на состояние всей машины.</p>
                    </div>
                `
            },
          ],
        }, {
          title: "Смерть",
          content: `
            <div>
                <p>Если транспорт был уничтожен во внешнем мире то вы будете перенесены на последнюю союзную базу которую вы посещали.</p>
                <p>После смерти вы теряете корпус и все что было в трюме.</p>
            </div>
        `,
        }, {
          title: "Снаряжение",
          content: `
            <div>
                <ul>
                    <li><a @click="selectPageByName('Панель снаряжения')">Панель снаряжения</a></li>
                    <li><a @click="selectPageByName('Режимы снаряжения')">Режимы снаряжения</a></li>
                </ul>
            </div>
        `,
          children: [
            {
              title: "Панель снаряжения", content: `
                <div>
                  <div>
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/equipPanel.jpg')}); width: calc(100% - 10px); height: 64px;"></div>
                      <p>Панель снаряжения позволяет использовать снаряжение или предметы из инвентаря напрямую.</p>
                      <p>Первая ячейка зарезервирована под манипулятор, если у вас выбрано снаряжение или оружие то вы
                      не можете взаимодействовать с ящиками, обломками, строениями и тд. для этого вам необходимо выбрать манипулятор</p>
                  </div>
                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/equipPanel2.jpg')}); width: 300px; height: 215px;"></div>
                      <p>Что бы установить снаряжение, надо открыть меню машинки и перетащить необходимый элемент в желаемую ячейку (кроме первой).</p>
                  </div>
                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/equipPanel3.jpg')}); width: 250px; height: 215px;"></div>
                      <p>Из инвентаря так же только из инвентаря.</p>
                  </div>

                  <div style="clear: both">
                      <p>
                      <p>Ячейки отличаются по цвету и отображаемоей информации</p>
                  </div>
                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/equipPanel4.jpg')}); width: 50px; height: 313px;"></div>
                      <ul>
                          <li style="padding-top: 16px;">Оружие - имеет красный фон и выводит тип и количество боеприпасов</li>
                          <li style="margin-top: 30px;">Активное дистанционное снаряжение - зеленый фон</li>
                          <li style="margin-top: 30px;">Активное снаряжение - синий фон, в активнос состояние имеет золотую рамку</li>
                          <li style="margin-top: 30px;">Пасивное снаряжение - темно серый фон</li>
                          <li style="margin-top: 30px;">Вещи из инвентаря - имеет белый фон, так же показывается кол-во предметов</li>
                          <li style="margin-top: 30px;">Когда оружие/прибор перезаряжается то показывается загрузка</li>
                      </ul>
                  </div>
                </div>
            `
            }, {
              title: "Режимы снаряжения", content: `
                <div>

                </div>
                `
            }
          ],
        }, {
          title: "Навигация",
          content: `
             <div>
                <ul>
                    <li><a @click="selectPageByName('Радар')">Радар</a></li>
                </ul>
            </div>
        `,
          children: [
            {
              title: "Радар", content: `
                <div>
                  <div>
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/radar1.jpg')}); width: 128px; height: 128px;"></div>
                      <p>Радар - это то что позволяет видить дальше, хотя и не очень разборчиво.
                      Каждый корпус имеет свой радиус радара, и некоторое снаряжение может его улучшать.</p>
                  </div>
                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/radar2.png')}); width: 128px; height: 256px;"></div>
                      <p>На радаре можно увидеть метки которые обозначают тип обьекта, но нельзя понять что это за обьект.</p>
                  </div>
                </div>
                `
            }
          ],
        }, {
          title: "Оружие",
          content: `
             <div>
               <div style="clear: both">
                  <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/weapon1.png')}); width: 226px; height: 169px;"></div>
                  <p>Оружие в игре делится на 3 основных типа.</p>
                  <ul>
                      <li><a @click="selectPageByName('Ракетное вооружение')">Ракетное вооружение</a></li>
                      <li><a @click="selectPageByName('Лазерное вооружение')">Лазерное вооружение</a></li>
                      <li><a @click="selectPageByName('Огнестрельное вооружение')">Огнестрельное вооружение</a></li>
                  </ul>
               </div>
               <div style="clear: both">
                  <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/ammo1.png')}); width: 168px; height: 256px;"></div>
                  <p>Для стрельбы оружию необходимы боеприпасы. В 1 оружие можно засунуть разные боеприпасы с различными характиристиками и типом урона.</p>
                  <ul>
                      <li><a @click="selectPageByName('Боеприпасы')">Боеприпасы</a></li>
                  </ul>
               </div>
               <div style="clear: both">
                  Как пользоватся:
                  <ul>
                      <li><a @click="selectPageByName('Прицеливание и стрельба')">Прицеливание и стрельба</a></li>
                  </ul>
              </div>
             </div>
        `,
          children: [
            {
              title: "Прицеливание и стрельба", content: `
                <div>
                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/use_weapon_1.jpg')}); width: 74px; height: 92px;"></div>
                      <p>Что бы использовать оружие его надо разместить на <a @click="selectPageByName('Панель снаряжения')">"панеле снаряжения"</a> и тыкнуть в него что бы выбрать.</p>
                      <p>Так же необходимо убедится что установлен <a @click="selectPageByName('Боеприпасы')">боеприпас</a></p>
                  </div>

                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/use_weapon_2.jpg')}); width: 189px; height: 95px;"></div>
                      <p>После выбра оружия, оно начнет поварачиватся в сторону курсора мыши. И появится прицел показывающий примерную зону поражения.</p>
                      <p>Чем меньше точность и дальше цель тем зона поражения будет больше.</p>
                  </div>

                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/use_weapon_3.jpg')}); width: 189px; height: 95px;"></div>
                      <p>Обратите внимание на то что прицел может "цеплятся" за некоторые обьекты на карте,
                      это связано с тем что обьект имеет высоту и по данной траектории пуля столкнется с этим обьектом.</p>
                  </div>

                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/use_weapon_4.jpg')}); width: 189px; height: 95px;"></div>
                      <p>Когда вы нажмете на левую кнопку мышки то оружие стрельнет. Отлетающие цифры покажут сколько и кто получил урона урона.
                      Если <a @click="selectPageByName('Боеприпасы')">боеприпас</a> имеет урон по площади то урон получат все в зоне поражения.</p>
                  </div>

                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/use_weapon_5.jpg')}); width: 189px; height: 143px;"></div>
                      <p>Не которые типы вооружения, например <a @click="selectPageByName('Ракетное вооружение')">ракетницы</a> с самоводящейся ракетой,
                      могут управлятся во время полета мышкой, они будут стараться достигнуть курсора</p>
                  </div>
                </div>
            `
            }, {
              title: "Боеприпасы", content: `
                <div>
                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/ammo2.jpg')}); width: 200px; height: 164px;"></div>

                      <p>Без боезопаса оружие стрелять не будет <span class="bracket">(да, даже лазер, нет ядерный реактор не сможет >_<. И ваще не в питание беды)</span>.
                      Для того что бы снарядить оружие боеприпасов надо открыть меню машинки и перетащить боезапас из инвентаря в слот оружия.
                      Тип оружие и боезапаса а так же их стандарт должны совпадать.</p>

                      <p>Если во время стрельбы в оружие кончился боезапас то оружие автоматически начнет перезарядку на такой же боезапас при условие наличия его в трюме.</p>
                  </div>

                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/ammo3.jpg')}); width: 256px; height: 404px;"></div>
                      <p>В 1 оружие можно зарядить разные боеприпасы которые могут различатся уроном, типом атаки, управляемость, зоной поражений, скоростью полета и тд.
                      Подробнее об этом можно посмотреть в карточке конкретного боезапаса</p>
                  </div>
                </div>
            `
            }, {
              title: "Ракетное вооружение", content: `
                <div style="clear: both">
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/rockets.png')}); width: 256px; height: 126px"></div>
                    <p>Ракетное вооружение, любимое оружие Reverses, отличается фиксированой скорость полета пули,
                    высоким уроном и точностью <span class="bracket">(для некоторый ракет управляемостью)</span>,
                    однако против него можно применить ПРО который будет сбивать их на подлете, а скорость ракет не отличается быстротой.</p>
                    <p>Ракеты имеют так же фиксированую дистанцию полета после чего они взрываются даже если не столкнулись с целью.</p>
                    <p>Еще одной особеностью ракет является то что летящие ракеты отображаются на <a @click="selectPageByName('Радар')">радаре</a> как летящие обьекты.</p>
                </div>
            `
            }, {
              title: "Лазерное вооружение", content: `
                <div style="clear: both">
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/lasers.png')}); width: 256px; height: 126px;"></div>
                    <p>Лазерное оружие отличается мгновенной скоростью порежения цели, но пострелять "навесом" из него не выйдет.</p>
                    <p>Имеет фиксированую дальность поражения.</p>
                    <p>В основном используется в армии Explores</p>
                </div>
            `
            }, {
              title: "Огнестрельное вооружение", content: `
                <div style="clear: both">
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/firearms.png')}); width: 256px; height: 140px;"></div>
                    <p>Огнестрельное оружие имеет балистическую траекторию из за чего обладает не фиксированой дальностью атаки, можно стрелять навесом стреляя через препятсвия.</p>
                    <p>Боеприпасы огнестрельного оружия имеют начальную скорость но само оружие может влиять на нее.
                    Дальность атаки высчитывается из параметроа допустимый угол вертикальной наводки + скорость вылета пули.</p>
                    <p>Основа армии Replic's</p>
                </div>
            `
            }
          ],
        }, {
          title: "Добыча ресурсов",
          content: `
            <div>
                <ul>
                    <li><a @click="selectPageByName('Руда')">Руда</a></li>
                    <li><a @click="selectPageByName('Метеориты')">Метеориты</a></li>
                    <li><a @click="selectPageByName('Обломки')">Обломки</a></li>
                </ul>
            </div>
        `,
          children: [
            {
              title: "Руда", content: `
                <div>
                  <div>
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/mining1.jpg')}); width: 128px; height: 128px;"></div>
                      <p>Руда это основной источник ресурсов в игре. Она <a @click="selectPageByName('Метеориты')">образуется</a>
                       в игровом мире случайно и добывать ее может каждый у кого есть необходимое снаряжение.</p>
                      <p>Нефть можно добыть только построив на источнике <a @click="selectPageByName('Типы строений')">"Добывающее строение"</a></p>
                  </div>
                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/mining6.png')}); width: 128px; height: 128px;"></div>
                      <p>На <a @click="selectPageByName('Радар')">радаре</a> отображается такой пиктограммой</p>
                  </div>
                  <div style="clear: both">
                      <p>Что бы добывать руду, нужен свободный трюм и добывающее снаряжение например: </p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/mining2.jpg')}); width: calc(100% - 10px); height: 363px;"></div>
                  </div>
                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/mining3.jpg')}); width: 146px; height: 64px;"></div>
                      <p>Снаряжение необходимо разместить на <a @click="selectPageByName('Панель снаряжения')">"панеле снаряжения"</a> и тыкнуть в него что бы выбрать.</p>
                  </div>
                  <div style="clear: both">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/mining4.jpg')}); width:147px; height: 182px;"></div>
                      <p>Обратите внимание что снаряжения имеет доступные углы и дальность, если оно не сможет повернутся/дотянутся к залежам руды то и добывать несможет</p>
                  </div>
                  <div style="clear: both">
                      <p>Во время добычи необходимо заполнить индектор добычи под рудой, после заполнения руда самостоятельно упадет в трюм.</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/mining5.jpg')}); width: calc(100% - 10px); height: 168px;"></div>
                  </div>
                </div>
            `
            }, {
              title: "Метеориты", content: `
                <div>
                  <div>
                      <p>Иногда на землю падают метеориты и наносят сильный урон всем вокруг. Однако метеорит может содержать в себе полезные ископаемые которые потом можно добыть.</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/meteorite.jpg')});  width: calc(100% - 10px); height: 121px;"></div>
                  </div>
                </div>
            `
            }, {
              title: "Обломки", content: `
                <div>
                  <div>
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/build3.jpg')}); width: 212px; height: 280px;"></div>
                      <p>С помощью инженерного модуля можно собирать ресурсы из обломков корпусов. Для этого необходимо выбрать его на панеле снаряжения и включить режим "демонтаж", навести на обломки и нажать кнопку мыши.</p>
                      <p>Можно охотится на <a @click="selectPageByName('Маячки бедствия')">Маячки бедствий</a> и зарабывать ресурсы без боя</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/wreckage.png')}); width: 286px; height: 236px;"></div>
                  </div>
                </div>
            `
            }
          ],
        }, {
          title: "База",
          content: `
                <div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <p>Под базой подразумевается любое строение в которое можно попасть через главные ворота. База предоставляет игроку различный набор услуг вот некоторые из них:</p>
                       <ul>
                          <li><a @click="selectPageByName('Склад')">Склад</a></li>
                          <li><a @click="selectPageByName('Магазин')">Магазин</a></li>
                          <li><a @click="selectPageByName('Ангар')">Ангар</a></li>
                          <li><a @click="selectPageByName('Диспетчер базы')">Диспетчер базы</a></li>
                       </ul>
                       <p>База - остравок безопасности, пока вы на ней вам нечего не угрожает</p>
                  </div>
                </div>
        `,
          children: [
            {
              title: "Склад", content: `
                <div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/base_1.png')});  width: 200px; height: 141px;"></div>
                      <p>Склад - индивидуальное хранилище предметов на базе.
                      Склад не имеет размерности и доступ к нему может получить только владелец, даже если база была захвачена врагом.
                      <span class="bracket">(что бы работать со складом конечно необходимо что бы база была захвачена вашей фракцией)</span></p>
                      <p>Взаимодействие с сервисами баз проиходят через склад например: при создание/переработке/покупке предмета он будет перемещен на склад, ресурсы для создания предметов и деталей будут братся из склада.</p>
                  </div>
                </div>
            `
            }, {
              title: "Магазин", content: `
                <div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/base_2.png')});  width: calc(100% - 10px); height: 154px;"></div>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <p>Магазин - предоставляет на каждой базе площадку для обмена товарами среди игроков.</p>
                      <p>Система торгов основана на аукционной схеме:</p>
                      <ul>
                          <li>все игроки рынка анонимны</li>
                          <li>все запросы и предложения находятся в единой базе</li>
                          <li>запросы/предложения схлопываются автоматически при совпадение цены</li>
                      </ul>

                      <p>За каждый выставляемый лот игрок платит налог <span class="bracket">(но это еще не работает)</span></p>
                      <p>Игроки могут обменится предметами и за пределами базы без налога, но так безопаснее</p>
                  </div>
                </div>
            `
            }, {
              title: "Ангар", content: `
                <div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/base_3.png')});  width: 260px; height: 156px;"></div>
                      <p>Ангар - меню которое позволяет конфигурировать вашу машину и показывает все ее характеристики.
                      Ангар доступен везде для просмотра характеристик но конфигурировать машинку можно только на главной базе сектора</p>
                  </div>
                </div>
            `
            }, {
              title: "Диспетчер базы", content: `
                <div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/base_4.png')});  width: 260px; height: 250px;"></div>
                      <p>Диспетчер базы - позволяет брать задания или получать необходимую информацию по заданиям</p>
                  </div>
                </div>
            `
            }
          ],
        }, {
          title: "Аномалии",
          content: `
            <div>
                <div>
                    <p>
                       С помощью чувствтельных приборов можно засечь аномальные сигналы на карте.
                    </p>
                    <p>
                       Если в зоне аномалии провести раскопки то можно обнаружить, что то интересно например <a @click="selectPageByName('Ящики')">ящики</a> с
                        <a @click="selectPageByName('Чертежи')">чертежами</a>/<a @click="selectPageByName('Ресурсы')">ресурсами</a>
                        и тд, <a @click="selectPageByName('Руда')">залежи ресурсов</a> или даже древнии артефакты, но скорее всего это будет просто
                        <a @click="selectPageByName('Мусор')">мусор ¯\\_(ツ)_/¯</a>.
                    </p>
                </div>
                <ul>
                    <li><a @click="selectPageByName('Сканирование')">Сканирование</a></li>
                    <li><a @click="selectPageByName('Копание')">Копание</a></li>
                </ul>
            </div>
        `,
          children: [
            {
              title: "Сканирование", content: `
                <div>
                  <div>
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/scan_anomaly_1.jpg')}); width: 211px; height: 217px;"></div>
                      <p>Что бы находить аномалии необходимо снарядить свою машинку необходимым снаряжением.</p>
                  </div>

                  <div style="clear: both;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/scan_anomaly_2.jpg')}); width: 128px; height: 144px;"></div>
                      <p>Когда сканер установлен <span class="bracket">(если модуль пасивный он работает самостоятельно всегда)</span>
                       то вы начинаете видеть на дисплее <span class="bracket">(в меню "информация о игрока")</span> вокруг машинки разные световые сигналы.
                       Сигналы указывают направление относительно корпуса машинки и силу, чем выше сила тем ближе аномалия.</p>
                  </div>

                   <div style="clear: both;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/scan_anomaly_3.jpg')}); width: 156px; height: 151px;"></div>
                      <p>
                      Аномалии на дисплее имеют цветовую фиверенциацию. Это связано с тем что у каждой аномалии свой сигнал и некоторые из них удается расшифровать.
                      Те которые распознать не удается севятятся голубым.
                      </p>
                  </div>
                </div>
            `
            }, {
              title: "Копание", content: `
                <div>
                  <div>
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/anomaly_digger_1.jpg')}); width: 211px; height: 217px;"></div>
                      <p>После того как источник сигнала найден, его необходимо извлечь из под земли. Для этого понадобится дрон копатель</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <p>Что бы воспользоватся дроном его необходимо разместить на <a @click="selectPageByName('Панель снаряжения')">панеле снаряжения</a>.
                      После активации дрона он летает вокруг машинки и следует на прицелом, до тех пор пока не будет выбрана цель для ракопок (щелчком мыши).</p>

                       <p>Если при раскопке дрон наткнулся на источник сигнала, сигнал пропадет а в крате появтися добыча. В противном случае там будет пусто.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/anomaly_digger_2.jpg')}); width: calc(100% - 10px); height: 224px;"></div>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0;">
                      <p><a @click="selectPageByName('Важно')">ВАЖНО</a>: При раскопке дрон наносит урон всему что окажется в зоне взрыва,
                      поэтому не нацеливайте его на себя иначе рискуете самоуничтожится.<span class="bracket">(и как оружие годится)</span></p>

                      <p>При повторном нажатии иконки дрона на <a @click="selectPageByName('Панель снаряжения')">панеле снаряжения</a> даст дрону команду вернутся в машинку.</p>
                  </div>
                </div>
                `
            }
          ],
        }, {
          title: "Производство",
          content: `
             <div>
                <ul>
                    <li><a @click="selectPageByName('Ресурсы')">Ресурсы</a></li>
                    <li><a @click="selectPageByName('Детали')">Детали</a></li>
                    <li><a @click="selectPageByName('Верстак')">Верстак</a></li>
                    <li><a @click="selectPageByName('Чертежи')">Чертежи</a></li>
                    <li><a @click="selectPageByName('Завод полуфабрикатов')">Завод полуфабрикатов</a></li>
                    <li><a @click="selectPageByName('Перерабатывающий завод')">Перерабатывающий завод</a></li>
                </ul>
            </div>
        `,
          children: [
            {
              title: "Ресурсы", content: `
                <div>
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/resource.png')}); width: 221px; height: 460px;"></div>
                    <p>Ресурсы это переработаная <a @click="selectPageByName('Руда')">руда</a> на
                    <a @click="selectPageByName('Перерабатывающий завод')">перерабатывающем заводе</a>.</p>
                </div>
            `
            }, {
              title: "Детали", content: `
                <div>
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/detail.jpg')}); width: 250px; height: 300px;"></div>
                    <p>Детали это сложные компоненты необходимые при производстве их можно изготавливать на <a @click="selectPageByName('Верстак')">верстаке</a>
                     с помощью <a @click="selectPageByName('Чертежи')">чертежей</a> или на <a @click="selectPageByName('Завод полуфабрикатов')">заводе полуфабрикатов</a>.</p>
                </div>
            `
            }, {
              title: "Верстак", content: `
                <div>
                  <div>
                      <p>Верстак это сервис который позволяет создать всякое с помощью <a @click="selectPageByName('Чертежи')">чертежей</a>
                       и <a @click="selectPageByName('Ресурсы')">русурсов</a>/<a @click="selectPageByName('Детали')">деталей</a>.</p>
                      <p>Верстак доступен в столице или главной <a @click="selectPageByName('База')">базе</a> сектора в этом пункте меню:</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/workbench3.jpg')}); width: calc(100% - 10px); height: 66px;"></div>
                  </div>
                  <div style="clear: both;">
                      <p>Что бы позпользоватся верстаком необходимо в слот для чертежа перенести чертеж из инвентаря/склада.</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/workbench2.jpg')}); width: calc(100% - 10px); height: 400px;"></div>
                  </div>
                  <div style="clear: both;">
                      <p>После установки появится статистика по чертежу. Необходимые предметы, каких предметов не хватает и время произвосдтва.</p>
                      <p>Процентное значение рядом с иконкой минерала говорит сколько необходимо ресурс для изготовления чертежа (100% как указано в чертеже),
                      значение может менятся из за налога базы или способноетсей игрока</p>
                      <p>Процентное значение рядом с иконкой таймера говорит изменения по времени изготовления</p>
                      <p>
                      <p><a @click="selectPageByName('Важно')">ВАЖНО</a>: Для расчета используются <a @click="selectPageByName('Ресурсы')">ресурсы</a> и <a @click="selectPageByName('Детали')">детали</a>
                       которые находятся на <a @click="selectPageByName('Склад')">СКЛАДЕ</a> базы.</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/workbench1.jpg')}); width: calc(100% - 10px); height: 300px;"></div>
                  </div>
                </div>
            `
            }, {
              title: "Чертежи", content: `
                <div>
                  <div>
                      <p>Чертежи возволяют создавать предметы/<a @click="selectPageByName('Строительство')">здания</a>
                      при наличии необходимых ресурсов.</p>

                      <p>Чертежи для предметов имеют синий цвет и их можно производить на <a @click="selectPageByName('Верстак')">верстаке</a></p>
                      <p>Чертежи для <a @click="selectPageByName('Строительство')">зданий</a> имеют красный цвет и строятся они вне баз.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/bp1.jpg')}); width: calc(100% - 97px); height: 119px;"></div>
                  </div>

                  <div>
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/bp2.jpg')}); width: 221px; height: 228px;"></div>
                      <p>Необходимые <a @click="selectPageByName('Ресурсы')">ресурсы</a>, <a @click="selectPageByName('Детали')">детали</a>,
                      а так же прозводимую продукцию можно посмотреть в карточке итема (инвентарь->подробно) во вкладке "Производство"</p>
                  </div>
                </div>
            `
            }, {
              title: "Завод полуфабрикатов", content: `
                <div>
                  <div>
                      <p>Завод полуфабрикатов - это строение в секторе которое позволяет производить детали без <a @click="selectPageByName('Чертежи')">чертежей</a>.</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/prefabricated_plant_1.jpg')}); width: calc(100% - 10px); height: 470px;"></div>
                  </div>

                  <div style="clear: both;">
                      <p>Этот функционал доступен на <a @click="selectPageByName('База')">базе</a> в этом меню</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/prefabricated_plant_2.jpg')}); width: calc(100% - 10px); height: 59px;"></div>
                  </div>
                  <div style="clear: both;">
                      <p>
                      На главной странице показаны все детали которые может изготовить игрок, и в каком количестве.
                      </p>
                      <p>
                      <a @click="selectPageByName('Важно')">ВАЖНО</a>: Расчет деталей который может изготовить игрок идет на основе наличия ресурсов на <a @click="selectPageByName('Склад')">СКЛАДЕ</a> базы.
                      </p>
                      <p>
                      Для того что бы изготовить деталь, надо ее выбрать в меню щелчком и указать количество.
                      В меню "Необходимо ресурсов" будет указано сколько будет затрачено <a @click="selectPageByName('Ресурсы')">ресурсов</a> на изготовку.
                      </p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/prefabricated_plant_3.jpg')}); width: calc(100% - 10px); height: 350px;"></div>
                  </div>
                </div>
            `
            }, {
              title: "Перерабатывающий завод", content: `
                <div>
                  <div>
                      <p>Перерабатывающий завод - это строение в секторе которое имеет уникальный функционал про перерабатыванию руд/снаряжение/деталей.</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/processing_plant_1.jpg')}); width: calc(100% - 10px); height: 381px;"></div>
                  </div>

                  <div style="clear: both;">
                      <p>Этот функционал доступен на <a @click="selectPageByName('База')">базе</a> в этом меню</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/processing_plant_2.jpg')}); width: calc(100% - 10px); height: 70px;"></div>
                  </div>

                  <div style="clear: both;">
                      <p>
                      Что бы переработать что то надо это перетащить в левое меню, справа вы увидете что получится.
                      Обратите внимание что некоторые элементы нельзя переработать, а на некоторые взымается налог.
                      </p>
                      <p>
                      <a @click="selectPageByName('Ресурсы')">Переработанные элементы</a> падают не в трюм а на <a @click="selectPageByName('Склад')">склад</a>.
                      </p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/processing_plant_3.jpg')}); width: calc(100% - 10px); height: 255px;"></div>
                  </div>
                </div>
            `
            }
          ],
        }, {
          title: "Строительство",
          content: `
            <div>
              <div style="clear: both; margin: 0; padding: 0;">
                  <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/build1.jpg')}); width: 256px; height: 178px;"></div>
                  <p>При наличии необходимого снаряжения, чертежей и ресурсов можно строить и разбирать вспомогательный строения <span class="bracket">(турели, радары, склады и тд)</span>.</p>
              </div>
              <div>
                  <ul>
                      <li><a @click="selectPageByName('Как строить')">Как строить</a></li>
                      <li><a @click="selectPageByName('Демонтаж')">Демонтаж</a></li>
                      <li><a @click="selectPageByName('Типы строений')">Типы строений</a></li>
                  </ul>
              </div>
            </div>
        `,
          children: [
            {
              title: "Как строить", content: `
                <div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/build2.jpg')}); width: 212px; height: 420px;"></div>
                      <p>Инициировать строительство можно имея только чертеж строения, меню строительство можно открыть через панель справа снизу или нажав на иконку троительного модуля. </p>
                      <p>В открвшейся менюшке будут показаны все чертежи строений, необходимо тыкнуть то что необходимо построить и курсор мышки превраться в него и надо выбрать место куда его поставить.</p>
                      <p>Если строение горит зеленым то там можно установить строение.</p>
                      <p>При установке строения зона под ним сразу становится не проходимо, но у строения 1хп и уничтожить его не составить труда.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/build3.jpg')}); width: 212px; height: 280px;"></div>
                      <p>Строить уже установленое строения надо с инженерным модулем модулем и ресурсами. Строить можно как свои так и союзные постройки.</p>
                      <p>Снаряжение необходимо выложить на <a @click="selectPageByName('Панель снаряжения')">"панеле снаряжения"</a> и выбрать режим модуля "строительство".</p>
                      <p>После чего выбрать доступную цель и строить.</p>
                      <p>Во время строительства будут отниматся ресурсы пропорционально процентному завершению строения.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/build4.jpg')}); width: 212px; height: 218px;"></div>
                      <p>Посмотреть сколько необходимо для строения ресурсов можно через карточку чертежа.</p>
                  </div>
                </div>
            `
            }, {
              title: "Демонтаж", content: `
                <div>
                     <div style="clear: both; margin: 0; padding: 0;">
                        <p>Демонтаж сооружений можно производить с помощью инженерного модуля в режиме "демонтаж" во время демонтажа будет происходить возврат ресурсов</p>
                        <p>Когда строение полностью снесено то в инентарь так же положится <a @click="selectPageByName('Чертежи')">Чертеж</a> этого сооружения</p>
                        <p>Демонтировать можно все построенные сооружения включая вражеские и союзные (однако это сделает вас <a @click="selectPageByName('Нарушитель')">нарушителем</a>)</p>
                        <p>Все строения кроме глушилок и радаров будут функционаровать при 50% комплектации (фиолетовая шкала), а глушилки и радары перестают работать сразу</p>
                        <p>При демонтаже строение получит урон равный 10% от максимального хп</p>
                     </div>
                </div>
            `
            }, {
              title: "Типы строений", content: `
                <div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <p>Строения служат разным целям от складов до турелей, некоторые строения должны питаться от генераторов или топливных ячеек иначе они перестают работать.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0; padding-top: 17px;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/turrents.png')}); width: 228px; height: 96px;"></div>
                      <p>Турели - атакуют врагов находящиеся в радиусе атаке, очень не любят кусты поэтому отстреливают их при возможности ¯\\_(ツ)_/¯.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0; padding-top: 17px;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/shield.png')}); width: 128px; height: 128px;"></div>
                      <p>Щиты - не пропускают снаряды внутрь, но зато выпускает их из под себя.</p>
                      <p>Для работы необходимо питание.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0; padding-top: 17px;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/radar.png')}); width: 128px; height: 128px;"></div>
                      <p>Радар - расширяет радар машинки, показывает все что попадает в радиус радара.</p>
                      <p>Для работы необходимо питание.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0; padding-top: 17px;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/jammer.png')}); width: 128px; height: 128px;"></div>
                      <p>Генератор помех - делает в области помех бесполезным радар, но не только вражеский а вообще.</p>
                      <p>Для работы необходимо питание.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0; padding-top: 17px;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/missile_defense.png')}); width: 128px; height: 128px;"></div>
                      <p>ПРО - сбивает вражеские ракеты на подлете <span class="bracket">(или все ракеты, я не помню :C)</span>.</p>
                      <p>Для работы необходимо питание.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0; padding-top: 17px;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/storage.png')}); width: 128px; height: 128px;"></div>
                      <p>Склад - как ящик, только склад ¯\\_(ツ)_/¯.</p>
                  </div>

                  <div style="clear: both; margin: 0; padding: 0; padding-top: 17px;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/energy_generator.png')}); width: 128px; height: 128px;"></div>
                      <p>Генератор - имеет расширеную топливную ячейку и способен самостоятельно питать все строения в радиусе действия.</p>
                      <p>Для работы необходимо питание, которое он будет раздавать.</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0; padding-top: 17px;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/extractor.png')}); width: 128px; height: 128px;"></div>
                      <p>Добывающее строение - строится на минерале и добывает ресурсы в автоматическом режиме, что бы строение работало ему ноеобходимо иметь ящик,
                       игрока или строение с инвентарем в точке сброса (красный/зеленый квадратик у здания).</p>
                      <p>Для работы необходимо питание, которое он будет потреблять в каждом цикле добычи.</p>
                  </div>
                </div>
            `
            }, {
              title: "Маяк управления", content: `
                  <div>
                    <div style="clear: both; margin: 0; padding: 0; padding-top: 17px;">
                        <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/beacons.png')}); width: 228px; height: 76px;"></div>
                        <p>Маяк управления - это особое строение которое позволяет захватить сектор.
                        Его можно установить возле главной базы сектора когда соблюдены все <a @click="selectPageByName('Война за территорию')">условия</a> для создания.</p>
                    </div>
                  </div>
                `
            }
          ],
        }, {
          title: "Сектора",
          content: `
             <div style="clear: both; margin: 0; padding: 0;">
                  <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/sector_2.png')}); width: 220px; height: 178px;"></div>
                  <p>Игровой мир поделен на сектора разной размерности, что бы перемещатся между секторами надо использовать "тунели переходов" или специальное снаряжение <span class="bracket">(не релиз.)</span>.</p>
                  <p>Почти в каждом секторе есть структуры (базы, заводы и тд).</p>
              </div>
            `,
          children: [
            {
              title: "Тунели переходов", content: `
                <div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/sector_1.png')});  width: calc(100% - 10px); height: 154px;"></div>
                      <p>Тунели переходов позволяют перемещатся между секторами.</p>
                      <p>Каждый тунель перехода имеет точку входа и N точек выхода, если точки выхода заблокированы то они не работают, если заблокированы все точки выхода то телепорт не работает</p>
                      <p>Все тунели односторонние, теоритически возможно ситуация когда вы прыгаете в другой сектор а на той стороне нет выхода обратно</p>
                  </div>
                </div>
              `
            }, {
              title: "Защитники", content: `
                <div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/sector_3.png')});  width: 224px; height: 80px;"></div>
                      <p>У некоторых баз могут быть защитники, они атакуют вражеских игроков или игроков которые в режиме <a @click="selectPageByName('PK')">"ПК"</a>.</p>
                      <p>Защитники замараживают <a @click="selectPageByName('Нарушитель')">нарушителей порядка</a>, до тех пор пока режим нарушения не спадет</p>
                      <p>Защитники могут перевозить игроков на базу по запросу или если те заблокировали важный участок (например выход из базы)</p>
                  </div>
                </div>
              `
            }, {
              title: "Карта мира", content: `
               <div style="clear: both; margin: 0; padding: 0;">
                  <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/sector_4.png')}); width: 250px; height: 208px;"></div>
                  <p>Меню игровой карты позволяет узнать кто владеет сектором.</p>
                  <p>Через карту можно узнать кратчайший путь до сектора если такой есть.</p>
                  <p>Происходит сейчас в секторе бой или нет <span class="bracket">(не релиз.)</span>.</p>
                </div>
                `
            }
          ],
        }, {
          title: "Фракции",
          content: `
            <div>
              <div>
                <p>На планете идется война между
                <a @click="selectPageByName('Replics')">Replics</a>, <a @click="selectPageByName('Explores')">Explores</a>, <a @click="selectPageByName('Reverses')">Reverses</a>
                 за ресурсы и территорию, игроки могут безнаказано убивать игроков других фракций и захватывать сектора.</p>
              </div>
              <div>
              <p>Так же есть игроки в режиме <a @click="selectPageByName('PK')">"ПК"</a> и 4я неразумная фракция <a @click="selectPageByName('АОП')">"автоматизированая оборона планеты" (АОП)</a>
                  оставшаяся от некогда живших на планете разумных существ, которые воюют против всех</p>
              </div>
            </div>
            `,
          children: [
            {
              title: "Replics",
              content: `
                <div>
                    <div class="helpImg" style="background-image: url(${require('../../assets/dialogPictures/replics_logo.png')});  width: 128px; height: 128px; margin-right: 20px;"></div>
                    <div class="helpImg" style="background-image: url(${require('../../assets/logo/Replics.png')});  width: 32px; height: 32px; margin-left: -52px; background-color: rgba(253, 253, 253, 0.7);"></div>
                    <p>Replics - Ав&shy;то&shy;кра&shy;ти&shy;че&shy;ской фор&shy;мы прав&shy;ле&shy;ния ИИ. От&shy;го&shy;ло&shy;сок ярост&shy;но&shy;го экс&shy;пан&shy;си&shy;о&shy;низ&shy;ма “по&shy;кро&shy;ви&shy;те&shy;лей” и при&shy;вер&shy;жен&shy;ца тео&shy;рии “вой&shy;ны за не&shy;за&shy;ви&shy;си&shy;мость с со&shy;з&shy;да&shy;те&shy;ля&shy;ми”. Пред&shy;по&shy;чи&shy;та&shy;ю&shy;щий под&shy;чи&shy;нять тер&shy;ри&shy;то&shy;рии и ас&shy;си&shy;ми&shy;ли&shy;ро&shy;вать дру&shy;гие тех&shy;ни&shy;че&shy;ские фор&shy;мы жиз&shy;ни си&shy;лой.</p>
                    <p>Replics управ&shy;ля&shy;ет об&shy;шир&shy;ной се&shy;тью ли&shy;шён&shy;ных са&shy;мо&shy;у&shy;прав&shy;ле&shy;ния бо&shy;тов. Но ино&shy;г&shy;да, санк&shy;ци&shy;о&shy;ни&shy;руя со&shy;з&shy;да&shy;ние се&shy;рии ав&shy;то&shy;ном&shy;ных еди&shy;ниц, ра&shy;ди рас&shy;ши&shy;ре&shy;ния сфер соб&shy;ствен&shy;но&shy;го вли&shy;я&shy;ния.</p>
                    <p>Ес&shy;ли у Replics по&shy;ми&shy;мо гос&shy;под&shy;ства и рас&shy;про&shy;стра&shy;не&shy;ния, бы&shy;ва&shy;ют иные по&shy;во&shy;ды для ин&shy;те&shy;ре&shy;са, то это только: ав&shy;то&shy;ма&shy;ти&shy;за&shy;ция ин&shy;фра&shy;струк&shy;ту&shy;ры, бес&shy;ко&shy;неч&shy;ное про&shy;из&shy;вод&shy;ство и пол&shy;ные ма&shy;те&shy;ри&shy;а&shy;лов скла&shy;ды.</p>
                </div>
                `
            }, {
              title: "Explores",
              content: `
                <div>
                    <div class="helpImg" style="background-image: url(${require('../../assets/dialogPictures/explores_logo.png')});  width: 128px; height: 128px; margin-right: 20px;"></div>
                    <div class="helpImg" style="background-image: url(${require('../../assets/logo/Explores.png')});  width: 32px; height: 32px; margin-left: -52px; background-color: rgba(253, 253, 253, 0.7);"></div>
                    <p>Explores - кон&shy;гло&shy;ме&shy;рат ве&shy;ли&shy;ко&shy;го мно&shy;же&shy;ства ра&shy;з&shy;умов, что тру&shy;дят&shy;ся над еди&shy;ной за&shy;да&shy;чей.</p>
                    <p>В дан&shy;ном же слу&shy;чае, на Veliri-5, Explores дви&shy;жим иде&shy;ей по&shy;зна&shy;ния окру&shy;жа&shy;ю&shy;ще&shy;го ми&shy;ра и при&shy;ме&shy;не&shy;ния по&shy;лу&shy;чен&shy;ных на&shy;уч&shy;ных от&shy;крытий, как с це&shy;лью са&shy;мо&shy;о&shy;бо&shy;ро&shy;ны, так и улуч&shy;ше&shy;ния уже су&shy;ще&shy;ству&shy;ю&shy;ще&shy;го есте&shy;ства.</p>
                    <p>Explores в от&shy;ли&shy;чии от Replics бо&shy;лее от&shy;крыт к ин&shy;но&shy;ва&shy;ци&shy;ям и не рас&shy;смат&shy;ри&shy;ва&shy;ет окру&shy;жа&shy;ю&shy;щий мир, как оче&shy;ред&shy;ную пре&shy;тен&shy;зию для при&shy;тя&shy;за&shy;ний. Ста&shy;ра&shy;ясь со&shy;хра&shy;нить и при&shy;умно&shy;жить уже име&shy;ю&shy;ще&shy;е&shy;ся, и оста&shy;но&shy;вить то, что спо&shy;соб&shy;но по&shy;ло&shy;жить ко&shy;нец бес&shy;цен&shy;ным на&shy;уч&shy;ным от&shy;крыти&shy;ям.</p>
                    <p>В ос&shy;нов&shy;ном, имен&shy;но дан&shy;ное ми&shy;ро&shy;воз&shy;зре&shy;ние и ста&shy;но&shy;вит&shy;ся ос&shy;но&shy;во&shy;по&shy;ла&shy;га&shy;ю&shy;щей ча&shy;стью враж&shy;ды, меж&shy;ду Replics и Explores.</p>
                </div>
                `
            }, {
              title: "Reverses",
              content: `
                <div>
                    <div class="helpImg" style="background-image: url(${require('../../assets/dialogPictures/reverses_logo.png')});  width: 128px; height: 128px; margin-right: 20px;"></div>
                    <div class="helpImg" style="background-image: url(${require('../../assets/logo/Reverses.png')});  width: 32px; height: 32px; margin-left: -52px; background-color: rgba(253, 253, 253, 0.7);"></div>
                    <p>Reverses - сим&shy;биот био&shy;ки&shy;бер&shy;не&shy;ти&shy;че&shy;ской фор&shy;мы жиз&shy;ни, с пре&shy;об&shy;ла&shy;да&shy;ни&shy;ем уто&shy;пиз&shy;ма и са&shy;мо&shy;изо&shy;ля&shy;ции.</p>
                    <p>Са&shy;мый по&shy;след&shy;ний из пред&shy;ста&shy;ви&shy;те&shy;лей но&shy;во&shy;го эво&shy;лю&shy;ци&shy;он&shy;но&shy;го на&shy;прав&shy;ле&shy;ния. У Reverses рас&shy;про&shy;стра&shy;не&shy;ны та&shy;кие яв&shy;ле&shy;ния, как пра&shy;во масс, ин&shy;ди&shy;ви&shy;ду&shy;аль&shy;но&shy;сти и вы&shy;бо&shy;ра. Имен&shy;но по этой са&shy;мой при&shy;чи&shy;не, боль&shy;шин&shy;ство пред&shy;ста&shy;ви&shy;те&shy;лей дан&shy;но&shy;го те&shy;че&shy;ния ИИ - не&shy;за&shy;ви&shy;си&shy;мые плат&shy;фор&shy;мы, что не&shy;устан&shy;но тру&shy;дят&shy;ся над тех&shy;но&shy;ло&shy;ги&shy;ей тер&shy;ра&shy;фор&shy;мин&shy;га.</p>
                    <p>Воз&shy;вра&shy;ще&shy;нию ми&shy;ра Veliri-5 преж&shy;не&shy;го об&shy;ли&shy;ка и даль&shy;ней&shy;ше&shy;го се&shy;я&shy;ния жиз&shy;ни там, где это только воз&shy;мож&shy;но. Вся&shy;че&shy;ски за&shy;кры&shy;вая гла&shy;за на действия и про&shy;ти&shy;во&shy;бор&shy;ства иных ИИ. Впро&shy;чем, не стоя в сто&shy;ро&shy;не, ко&shy;г&shy;да опас&shy;ность угро&shy;жа&shy;ет им са&shy;мим.</p>
                </div>
                `
            }, {
              title: "АОП",
              content: `
                <div>
                        <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/apd.png')}); width: 260px; height: 200px;"></div>
                        <p>Автоматизированая оборона планеты (АОП) - не кто точно не знает почему она активировалась сейчас,
                        но по всей видимости эти роботы подчиняются неразумной системе которая находится где то на планете.</p>
                        <p>Переодически эти машины появляются из неоткуда и атакуют все что попадает в их сенсоры.
                        Однако они очень глупы и имеют устаревшее слабое вооружение. Поэтому они могут представлять угрозу только в больших группах.</p>
                </div>
                `
            }, {
              title: "Война за территорию",
              content: `
                  <div>
                    <div>
                        <p>Все сектора кроме сталиц фракций можно захватить. Для захвата необходимо:</p>
                    </div>
                    <div>
                        <p>1. Уничтожить вражеский <a @click="selectPageByName('Маяк управления')">маяк управления</a>. </p>
                        <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/beacon.png')}); width: 200px; height: 200px;"></div>
                        <p>Вражеский маяк должен быть установлен около главной базы сектора, скорее всего вокруг него будут возведены турели, щиты и вражеские еденицы.</p>
                    </div>

                    <div style="clear: both; padding-top: 10px">
                        <p>2. Закрепить влияние над территорией. </p>
                        <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/beacon_2.png')}); width: 223px; height: 231px;"></div>
                        <p>Когда у базы нет маяка управления то база является нейтральной и перед установкой маяка необходимо зачистить и обезопасить прилежащую территорию.
                        Для этого надо уничтожать всех врагов и находится в кругу захвата базы пока не заполнется шкала влияния.</p>
                    </div>
                    <div style="clear: both; padding-top: 10px">
                        <p>3. Построить свой маяк</p>
                        <p> Когда вы заполнили влияние то вы можете построить свой маяк управления базы, после успешной постройки база сразу станет ваша.</p>
                        <p> Опционально: вы можете подождать пока приедет строительный бот и построит маяк сам, что бы не тратить свои ресурсы и чертежи, однако он может и не доехать т.к. его убьют <span class="bracket">(или залагает.)</span></p>
                    </div>
                  </div>
                `
            }
          ],
        }, {
          title: "Система правосудия",
          content: `
            <div>
                <p> Система правосудия позволяет сохранять безопасность около баз и столиц, если игрок нападает на союзного игрока или его имущество то он входит в режим
                    <a @click="selectPageByName('Нарушитель')">Нарушителя</a>, если игрок уничтожает имущество или убивает союзеного игрока то он входит в режим <a @click="selectPageByName('PK')">ПК</a>
                </p>
            </div>
          `,
          children: [
            {
              title: "Нарушитель", content: `
                  <div>
                    <div style="clear: both; margin: 0; padding: 0;">
                        <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/law_1.png')}); width: 266px; height: 115px;"></div>
                        <p>Режим нарушения вешается на игрока на 30 сек после мелкого нарушения, например атака союзного игрока или его имущества</p>
                        <p>Игрока в режиме нарушитель могут атаковать другие игроки без штрафа, на безопасной территории защитники будут замораживать нарушителей пока режим не спадет.</p>
                    </div>
                  </div>
                `
            }, {
              title: "PK", content: `
                  <div>
                    <div style="clear: both; margin: 0; padding: 0;">
                        <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/law_2.png')}); width: 89px; height: 98px;"></div>
                        <p>Режим PK вешается на игрока до его смерти после серьездного нарушения например уничтожение союзеного игрока или его имущества</p>
                        <p>Игрока в режиме PK могут атаковать другие игроки без штрафа, так же его будут атаковать защитники и турели фракции.</p>
                    </div>
                  </div>
                `
            }, {
              title: "Маячки бедствия", content: `
                  <div>
                    <div style="clear: both; margin: 0; padding: 0;">
                        <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/law_3.png')}); width: 200px; height: 238px;"></div>
                        <p>После смерти транспорта по всем сектору отправляется широковещательный сигнал с координатами смерти. Отображаются на мини карте.</p>
                        <p>Если в секторе есть стражники то они едут на разведку по полученым координатам.</p>
                    </div>
                  </div>
                `
            }
          ],
        }, {
          title: "Задания",
          content: `
            <div>
                <ul>
                    <li><a @click="selectPageByName('Отслеживание выполнения')">Отслеживание выполнения</a></li>
                </ul>
            </div>
        `,
          children: [
            {
              title: "Отслеживание выполнения", content: `
                <div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/mission1.jpg')}); width: 150px; height: 121px;"></div>
                      <p>Для отслеживания задания, выберите необходимое задание в меню заданий.</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/mission2.jpg')}); width: 150px; height: 121px;"></div>
                      <p>Появятся пункты которые необходимо выполнить.</p>
                  </div>
                  <div style="clear: both; margin: 0; padding: 0;">
                      <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/mission3.jpg')}); width: 150px; height: 121px;"></div>
                      <p>Так же на мини карте будет показыватся чето.</p>
                  </div>
                </div>
            `
            }
          ],
        }, {
          title: "Ящики",
          content: `
               <div>
                 <div style="clear: both; margin: 0; padding: 0;">
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/box1.jpg')}); width: 240px; height: 185px;"></div>
                    <p>Ящики позволяют хранить за пределами базы предметы.</p>

                    <p>Самый простой ящик можно толкать, туда имеют доступ все кто находится рядом.</p>
                    <p>Существует ящик который закапывается и с ним нельзя столкнутся</p>
                 </div>

                 <div style="clear: both; margin: 0; padding: 0;">
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/box2.jpg')}); width: 240px; height: 185px;"></div>
                    <p>Так же существует ящик который можно защитить паролем и туда будут иметь доступ только те кто знаю этот пароль.</p>
                 </div>

                 <div style="clear: both; margin: 0; padding: 0;">
                    <p>К сожалению любой ящик можно уничтожить, и все содержимое пропадет в небытие.</p>
                 </div>

                 <div style="clear: both; margin: 0; padding: 0;">
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/box3.jpg')}); width: 163px; height: 185px;"></div>
                    <p>Когда вы выбрасываете вещи из трюм на карте образуется обычный ящик.
                    Если вы хотите разметстить ящик из трюма то его надо выделить выбрать пункт "установить" в выпавшем меню.
                    Ящик установится позади вашей машины если там будет свободное место.</p>
                 </div>
               </div>
        `,
          children: [],
        }, {
          title: "Важно",
          notList: true,
          content: `
            <div>
                <div style="clear: both; margin: 0; padding: 0;">
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/lol.jpg')}); width: calc(100% - 10px); height: 278px;"></div>
                </div>
            </div>
        `,
          children: [],
        }, {
          title: "Мусор",
          notList: true,
          content: `
            <div>
                <div style="clear: both; margin: 0; padding: 0;">
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/trash.jpg')}); width: calc(100% - 165px); height: 256px;"></div>
                </div>
            </div>
        `,
          children: [],
        }, {
          title: "Приветсвие",
          notList: true,
          content: `
            <div>
                <div style="clear: both; margin: 0; padding: 0;">
                    <p>Добро подалось в базу вспомогательных материалов Veliri!</p>
                    <p><span class="bracket">Тут собрана почти вся информация по игре, однако т.к. это не релизная версия игры тут могут быть несовпадения с реальность, не вся информация, ошибки и не зарелизенные фичи</span></p>
                    <div class="helpImg" style="background-image: url(${require('../../assets/indexImg/help/sorry.jpg')}); width: 150px; height: 90px; opacity: 0.3; margin-left: calc(50% - 75px)"></div>
                </div>
            </div>
        `,
          children: [],
        }
      ],
    }
  },
}
</script>

<style>
#helpWrapper {
  top: 50px;
  left: calc(50% - 200px);
  height: 325px;
  width: 700px;
  position: absolute;
  border-radius: 5px;
  padding: 20px 3px 3px 3px;
  z-index: 11;
  border: 1px solid #25a0e1;
  background: rgb(8, 138, 210);
  box-shadow: 0 0 2px black;
}

#HelpSections {
  float: left;
  height: 100%;
  width: 190px;
  box-shadow: inset 0 0 2px black;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.2);
  margin-right: 3px;
  overflow-y: scroll;
  overflow-x: hidden;
}

#HelpContentWrapper {
  height: 180px;
  pointer-events: auto;
  width: 507px;
  float: left;
}

#HelpHead {
  float: left;
  height: 35px;
  width: 497px;
  text-align: left;
  margin: 0;
  padding-left: 10px;
  line-height: 35px;
  font-weight: 900;
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

#HelpContent {
  margin: 0 auto 0;
  overflow-y: scroll;
  height: 279px;
  border-radius: 5px;
  box-shadow: inset 0 0 5px black;
  background: #89969c;
  pointer-events: auto;
  overflow-x: hidden;
  width: calc(100% - 11px);
  text-align: left;
  font-size: 13px;
  padding: 5px;
  border: 1px solid rgba(0, 0, 0, 0.4);
}

.helpSection, .helpSubSection {
  text-align: left;
  display: block;
  width: 100%;
  padding-left: 10px;
  background: rgb(222, 101, 40);
  box-shadow: 0 0 2px rgba(0, 0, 0, 1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  margin: 2px 0 0 2px;
  font-size: 13px;
  line-height: 17px;
  height: 16px;
  user-select: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  font-weight: bold;
}

.helpSubSection {
  background: rgb(158, 69, 24);
  margin-left: 10px;
  font-size: 10px;
}

.helpSection:hover, .helpSubSection:hover {
  box-shadow: 0 0 2px rgb(255, 255, 255);
}

.helpSection:active, .helpSubSection:active {
  transform: scale(0.98);
}

.helpImg {
  float: left;
  margin: 5px;
  border-radius: 3px;
  background-size: cover;
  box-shadow: 0 0 2px 1px black;
}

#HelpContent > div {
  color: #e6cfb1;
  font-weight: 900;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  text-indent: 15px;
  text-align: justify;
  padding: 5px;
  margin: 4px 0;
}

#HelpContent ol {
  margin: 0;
  padding: 0;
}

#HelpContent ol li {
  margin: 0;
  padding: 0;
}

#HelpContent > div a {
  color: #32f2ff;
  font-weight: 900;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
  text-indent: 15px;
  text-align: justify;
  padding: 5px;
  margin: 4px 0;
  text-decoration: none;
  cursor: pointer;
}

.bracket {
  font-size: 10px;
  color: white;
  opacity: 0.5;
}
</style>
