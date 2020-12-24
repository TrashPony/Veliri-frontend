<template>
  <div v-if="training.point <= 9">
    <div class="mask" v-if="(training.point === 2 && !training.needIntoHangar) || training.point === 7"/>

    <template v-if="training.point === 1 || training.needIntoHangar">
      <div class="dialogBlock Training" style="left: 15px; top: 60px; height: 183px;">
        <div class="dialogPicture">
          <div class="nameDialog">training</div>
          <div class="pictureBack"></div>
        </div>
        <div class="dialogText">
          <div class="wrapperText" style="height: 160px;">
            <p>Начнём свой путь с незаменимых вещей: ангара и инвентаря.</p>
            <p>Чтобы открыть и ознакомиться с меню “ангара”, нажмите на “жёлтую” кнопку интерфейса с соответствующим
              названием.</p>
            <p>Если вы желаете ознакомиться с меню “инвентаря”, нажмите на “зелёную” кнопку интерфейса</p>
          </div>
        </div>
      </div>
    </template>

    <template v-if="training.point === 2 && !training.needIntoHangar">
      <div id="training1Block" class="dialogBlock Training" style="top: 5%">
        <div class="dialogPicture">
          <div class="nameDialog">training</div>
          <div class="pictureBack"></div>
        </div>
        <div class="dialogText">
          <div class="wrapperText"><p>Пре­вос­ход­но, вы спра­ви­лись! Мно­гие ИИ, уже сда­ют­ся
            кон­крет­но на дан­ном эта­пе. Те­перь да­вай­те бо­лее де­таль­но
            рас­смот­рим осо­бен­но­сти каж­дой вклад­ки</p></div>
        </div>
        <div class="asks">
          <div class="wrapperAsk" @click="progressTraining(2)">Продолжить</div>
        </div>
      </div>

      <div id="training1SquadsBlock" class="dialogBlock Training" style="width: 275px; height: 80px;">
        <div class="dialogText">
          <div class="wrapperText" style="width: 250px; height: 57px;"><p>
            <span class="definition">Ангар</span> - На
            дан­ной вклад­ке,
            отоб­ра­же­на чис­лен­ность ак­тив­ных от­ря­дов, ко­то­рые
            име­ют­ся в твоём рас­по­ря­же­нии. Помни, что управ­лять ты мо­жешь только
            ка­ким-то од­ним от­ря­дом. Де­лай свой вы­бор, с умом.</p></div>
        </div>
      </div>

      <div id="training1ParamsBlock" class="dialogBlock Training" style="width: 275px; height: 110px;">
        <div class="dialogText">
          <div class="wrapperText" style="width: 250px; height: 87px;"><p><span
            class="definition">Панель характеристик</span> - Дан­ная па­нель,
            отоб­ра­жа­ет те­ку­щее со­сто­я­ние от­ря­да. Сю­да вхо­дит:
            па­ра­мет­ры, свойства, осо­бые мо­ди­фи­ка­то­ры.</p></div>
        </div>
      </div>

      <div id="training1InvBlock" class="dialogBlock Training" style="width: 235px; height: 200px;">
        <div class="dialogText">
          <div class="wrapperText" style="width: 210px; height: 177px;">
            <p><span class="definition">Склад</span> Стра­те­ги­че­ский
              склад ба­зы, где хра­нит­ся всё куп­лен­ное, най­ден­ное, со­з­дан­ное
              и пе­ре­ра­бо­тан­ное. Не­за­ви­си­мо от по­лез­но­сти
              или спе­ци­а­ли­за­ции ве­щей.</p>
            <p>

            </p>
            <p><span class="definition">Трюм</span> - На дан­ной вклад­ке,
              отоб­ра­же­ны все ве­щи,что хра­нят­ся и на­хо­дят­ся в твоём рас­ по­ря­же­нии.
              У них име­ет­ся раз­мер и вес, и они не ак­тив­ны, ес­ли
              не за­действо­ва­ны с ка­ким-то от­ря­дом. <br><br>(вклад­ка трю­ма отоб­ра­зит­ся ког­да бу­дет
              выбра­на плат­фор­ма)</p>
          </div>
        </div>
      </div>
    </template>

    <template v-if="training.point === 3 && !training.needIntoHangar">
      <div id="training1SquadBlock" class="dialogBlock Training" style="width: 275px; height: 150px;">
        <div class="dialogPicture">
          <div class="nameDialog">training</div>
          <div class="pictureBack"></div>
        </div>
        <div class="dialogText">
          <div class="wrapperText" style="width: 250px; height: 127px;">
            <p>
              От­лич­но, ты узнал пер­вич­ную по­лез­ную ин­фор­ма­цию,
              и те­перь го­тов ак­ти­ви­ро­вать свою мо­биль­ную плат­фор­му.
            </p>
            <p>
              Для это­го действия, те­бе при по­мо­щи кур­со­ра по­тре­бу­ет­ся
              пе­ре­та­щить «икон­ку» кор­пу­са мо­биль­ной плат­фор­мы из вклад­ки
              «склад», в цен­траль­ный эле­мент гра­фи­че­ско­го ин­тер­фей­са –
              «ме­сто для кор­пу­са»
            </p>
          </div>
        </div>
      </div>
    </template>

    <template v-if="training.point === 4 && !training.needIntoHangar">
      <div id="training1ThoriumBlock" class="dialogBlock Training" style="width: 300px; height: 160px;">
        <div class="dialogText">
          <div class="wrapperText" style="width: 275px; height: 137px;"><p><span
            class="definition">Слоты для топлива</span> - Об­ра­ти
            вни­ма­ние на за­го­рев­ши­е­ся ячейки под мо­биль­ной
            плат­фор­мой. Это – сло­ты для топ­ли­ва</p>
            <p>Ты мо­жешь за­действо­вать их все (1 – 3), та­ким об­ра­зом
              мак­си­маль­но уве­ли­чив ско­рость хо­да. А мо­жешь ис­
              поль­зо­вать ме-нь-ше. Та­ким об­ра­зом,
              умень­шив ско­рость хо­да, но сэко­но­мив топ­ли­во.</p>
          </div>
        </div>
      </div>

      <div id="training2SquadBlock" class="dialogBlock Training" style="width: 275px; height: 110px;">
        <div class="dialogPicture">
          <div class="nameDialog">training</div>
          <div class="pictureBack"></div>
        </div>
        <div class="dialogText">
          <div class="wrapperText" style="width: 250px; height: 87px;">
            <p>За­меть, ко­г­да мо­биль­ная плат­фор­ма
              ак­ти­ви­
              ро­ва­на, она не спо­соб­на пе­ре­дви­гать­ся без топ­ли­ва.
              По­это­му, да­вай обо­ру­ду­ем на­шу мо­биль­ную плат­фор­му
              ядер­ным топ­ли­вом - <span class="definition">То­ри­ем</span>. </p>
            <p> Пе­рей­ди во вклад­ку <span class="definition">"Склад"</span> и
              пе­ре­та­щи пик­то­гра­му <span class="definition">то­рия</span> в слот</p>
          </div>
        </div>
      </div>
    </template>

    <template v-if="training.point === 5 && !training.needIntoHangar">
      <div id="training3SquadBlock" class="dialogBlock Training" style="width: 275px; height: 130px;">
        <div class="dialogPicture">
          <div class="nameDialog">training</div>
          <div class="pictureBack"></div>
        </div>
        <div class="dialogText">
          <div class="wrapperText" style="width: 250px; height: 107px;"><p>Дви­га­ем­ся даль­ше. На­ста­ла оче­редь
            сна­ря­дить
            на­шу мо­биль­ную плат­фор­му раз­лич­ным обо­ру­до­ва­ни­ем.
            В за­ви­си­мо­сти от сво­ей спе­ци­фи­ки, обо­ру­до­ва­ние,
            мо­жет быть: до­бы­ва­ю­щее, обо­ро­ни­тель­ное, или да­же
            ра­бо­та­ю­щее в ка­че­стве средств на­па­де­ния</p>
            <p><span class="definition">Перетащи иконку добывающего лазера на желтый слот транспорта</span></p>
          </div>
        </div>
      </div>

      <div id="training1PowerBlock" class="dialogBlock Training" style="width: 275px; height: 105px;">
        <div class="dialogText">
          <div class="wrapperText" style="width: 250px; height: 82px;">
            <p><span class="definition">Реактор</span> -
              Учти, те­бе сле­ду­ет
              сле­дить за на­груз­кой уста­нов­лен­но­го обо­ру­до­
              ва­ния на ре­ак­тор. В про­тив­ном слу­чае, ес­ли уста­нов­лен­ное обо­ру­до­ва­ние бу­дет пре­вы­шать
              ли­мит энер­гии ре­ак­то­ра, то оно по­про­сту не ста­нет
              функ­ци­о­ни­ро­вать.</p>
            <p><span class="definition">Иконка батарейки снизу</span></p>
          </div>
        </div>
      </div>

      <div id="training1EquipBlock" class="dialogBlock Training" style="width: 255px; height: 220px;">
        <div class="dialogText">
          <div class="wrapperText" style="width: 230px; height: 197px;">
            <p>
              <span class="definition">Ячейки для обо­ру­до­ва­ния</span>
              – Ячейки
              обо­ру­до­ва­ния де­лят­ся на три тех­но­ло­ги­че­ских ти­па. Это
              озна­ча­ет, что ты не су­ме­ешь вло­жить обо­ру­до­ва­ние I тех­но­ло­ги­че­ско­го ти­па, в ячейку II
              тех­но­ло­ги­че­ско­го ти­па.
            </p>

            <p>
              При­ме­няя со­о­т­вет­ству­ю­щее тех­но­ло­ги­че­ско­му
              уров­ню обо­ру­до­ва­ние, на ис­клю­чи­тель­но под­хо­дя­щей ячей­ке.
            </p>
            <p>
              <span class="definition">Если навести мышкой на слот то в инвентаре покажется
                снаряжение которе можно в него поставить</span>
            </p>
          </div>
        </div>
      </div>
    </template>

    <template v-if="training.point === 6 && !training.needIntoHangar">
      <div id="training4SquadBlock" class="dialogBlock Training" style="width: 275px; height: 130px;">
        <div class="dialogPicture">
          <div class="nameDialog">training</div>
          <div class="pictureBack"></div>
        </div>
        <div class="dialogText">
          <div class="wrapperText" style="width: 250px; height: 107px;">
            <p>Преды­ду­щая за­да­ча бы­ла слож­ной, но к
              сча­стью, мы с ней спра­ви­лись!</p>
            <p>
              При­шло вре­мя на­учить­ся уста­нав­ли­вать во­ору­же­ние.
              Для это­го, ис­поль­зуй спе­ци­аль­ные сло­ты, что под­све­чи­ва­ют­ся
              “крас­ным” цве­том в ин­тер­фей­се.
            </p>
            <p>
              Не за­бы­вая и про бо­е­при­па­сы, без ко­их ни од­но во­ору­же­ние не
              ста­нет ве­сти огонь. Уста­нав­ли­вая их в ма­лый слот, около сло­та во­ору­же­ния
            </p>
            <p>
              Так же советую оставшиеся боеприпасы положить в <span class="definition">"Трюм"</span>
              тогда ты не останешся без них в бою, а оружие автоматически перезарядится
            </p>
            <p>
              Что бы положить вещи в <span class="definition">"Трюм"</span> необходимо перетащить предмет во вкладку
              Трюма.
            </p>
          </div>
        </div>
      </div>

      <div id="training1WeaponBlock" class="dialogBlock Training" style="width: 255px; height: 243px;">
        <div class="dialogText">
          <div class="wrapperText" style="width: 230px; height: 220px;">
            <p>
              <span class="definition">За­мет­ка о раз­ме­ре ору­жия</span>
              – Важ­но пом­нить, что у лю­бо­го
              во­ору­же­ния име­ют­ся свои раз­ме­ры. А это озна­ча­ет, что ес­ли
              кор­пус мо­биль­ной плат­фор­мы не под­хо­дит для то­го или ино­го ти­па
              во­ору­же­ния, то “ору­жие” на дан­ный кор­пус, по­ста­вить бу­дет нель­зя.
            </p>

            <p>
              <span class="definition">Если навести мышкой на слот снарядов орудия то в инвентаре покажется
                типы боеприпаса которые можно снарядить</span>
            </p>
          </div>
        </div>
      </div>
    </template>

    <template v-if="training.point === 7">
      <div id="training2Block" class="dialogBlock Training"
           style="right: calc(50% - 125px); top: calc(20%); left: auto;">
        <div class="dialogPicture">
          <div class="nameDialog">module</div>
          <div class="pictureBack"></div>
        </div>
        <div class="dialogText">
          <div class="wrapperText">
            <p>
              Ну вот и всё. Ты осво­ил азы управ­ле­ния снаряжением и те­перь го­тов по­ко­рить
              <span class="definition">Veliri-5.</span>
            </p>
            <p>Зай­ди в штаб у глав­но­ко­ман­ду­ю­ще­го есть для те­бя за­да­ние.</p></div>
        </div>
        <div class="asks">
          <div class="wrapperAsk" @click="progressTraining(7)">Продолжить.</div>
        </div>
      </div>
    </template>

    <template v-if="training.point === 8">
      <div class="dialogBlock Training" style="left: 15px; top: 60px;">
        <div class="dialogPicture">
          <div class="nameDialog">module</div>
          <div class="pictureBack"></div>
        </div>
        <div class="dialogText">
          <div class="wrapperText">
            <p>Что бы войти в штаб нажми желтую пиктограмму.</p>
          </div>
        </div>
      </div>
    </template>

    <template v-if="training.point === 9">
      <div id="training1IntoDepartmentOfEmployment" class="dialogBlock Training" style="left: 15px; top: 60px;">
        <div class="dialogPicture">
          <div class="nameDialog">module</div>
          <div class="pictureBack"></div>
        </div>
        <div class="dialogText">
          <div class="wrapperText">
            <p>Для того что бы выйти из базы - нажми эту пиктограмму.</p>
            <p>
              <span class="definition">Убедись перед выходом что ты не забыл топливо, оружие и боеприпасы!</span>
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {gameStore} from "../../game/store";

/** модуль костыль для интерактивного обучения **/
export default {
  name: "Training",
  mounted() {
    this.trainingLogics()
  },
  methods: {
    trainingLogics() {
      let app = this;

      if (app.training.point > 9) {
        return
      }

      let training = setInterval(function () {

        let hangarButton = $('#hangarButton');
        let inventoryButton = $('#inventoryButton');

        if (app.training.point === 1 || app.training.needIntoHangar) {
          hangarButton.css("animation", "selectMenu 1500ms infinite");
          inventoryButton.css("animation", "selectMenu2 1500ms infinite");

          if (app.training.point === 1 && app.checkHangarAndInventory()) {
            $("#wrapperInventoryAndStorage").css('left', $('#inventoryBox').position().left + 340);
            app.progressTraining(1)
          }
        } else {
          hangarButton.css("animation", "unset");
          inventoryButton.css("animation", "unset");
        }

        if (app.training.point === 2 && app.checkHangarAndInventory()) {
          app.setPos($('#SquadsList'), "training1SquadsBlock", -30, 0);
          app.setPos($('#SquadsList'), "training1ParamsBlock", 190, 0);
          app.setPos($('#Inventory'), "training1InvBlock", 0, 0);
          app.setPos($('#Inventory'), "training1InvBlock", 0, 0);
        }

        if (app.training.point === 3 && app.checkHangarAndInventory()) {
          app.setPos($('#wrapperInventoryAndStorage'), "training1SquadBlock", 200, 0);
          if (app.inventory.unit && app.inventory.unit.body) {
            app.$store.commit({
              type: 'setFindFilter',
              filters: null,
            });
            app.progressTraining(3)
          } else {
            if (!app.inventory.findFilter || app.inventory.findFilter.type !== 'body') {
              app.$store.commit({
                type: 'setFindFilter',
                filters: {
                  type: 'body',
                }
              });
            }
          }
        }

        if (app.training.point === 4 && app.checkHangarAndInventory()) {
          app.setPos($('#wrapperInventoryAndStorage'), "training2SquadBlock", 170, 0);
          app.setPos($('#ConstructorMS'), "training1ThoriumBlock", 20, 15);
          $('.bodyThoriumWrapper').css("animation", "selectMenu2 1500ms infinite");

          let find = false;
          if (app.inventory.unit && app.inventory.unit.body) {
            for (let i in app.inventory.unit.thorium_slots) {
              if (app.inventory.unit.thorium_slots[i].count > 0) find = true;
            }
          }

          if (find || app.baseStatus.state.type === 'lobby') {
            $('.bodyThoriumWrapper').css("animation", "unset");
            app.progressTraining(4)
          }
        }

        if (app.training.point === 5 && app.checkHangarAndInventory()) {
          app.setPos($('#wrapperInventoryAndStorage'), "training3SquadBlock", 170, 0);
          app.setPos($('#powerIcon'), "training1PowerBlock", -115, -210);
          app.setPos($('#MSIcon'), "training1EquipBlock", -60, -335);

          if (!app.inventory.findFilter || app.inventory.findFilter.type !== 'equip') {
            app.$store.commit({
              type: 'setFindFilter',
              filters: {
                type: 'equip',
                type_slot: 0,
              }
            });
          }

          if (app.inventory.unit && app.inventory.unit.body) {
            let find = false;

            for (let slotNumber in app.inventory.unit.equip_slots) {
              if (app.inventory.unit.equip_slots[slotNumber].equip) {
                find = true
              }
            }

            if (find) {
              app.$store.commit({
                type: 'setFindFilter',
                filters: null,
              });
              app.progressTraining(5)
            }
          }
        }

        if (app.training.point === 6 && app.checkHangarAndInventory()) {
          app.setPos($('#wrapperInventoryAndStorage'), "training4SquadBlock", 170, 0);
          app.setPos($('#MSWeaponPanel'), "training1WeaponBlock", 0, -270);

          if (app.inventory.unit && app.inventory.unit.body) {

            let find = false;
            for (let slotNumber in app.inventory.unit.weapon_slots) {
              if (app.inventory.unit.weapon_slots[slotNumber].weapon && app.inventory.unit.weapon_slots[slotNumber].ammo) {
                find = true
              }
            }

            if (find) {
              app.progressTraining(6)
            }
          }
        }

        if (app.training.point === 8) {
          $('#DepartmentOfEmploymentButton').css("animation", "selectMenu 1500ms infinite");
          if (app.dialog.page || app.baseStatus.state.type === 'lobby') {
            $('#DepartmentOfEmploymentButton').css("animation", "unset");
            app.progressTraining(8)
          }
        }

        if (app.training.point === 9) {
          $('#OutBaseButton').css("animation", "selectMenu 1500ms infinite");
          if (app.openComponents['ExitMenu'] && app.openComponents['ExitMenu'].open) {
            $('#OutBaseButton').css("animation", "unset");
            app.progressTraining(9);
            clearInterval(training);
          }
        }
      }, 100);
    },
    setPos(toInfoBlock, id, offsetY, offsetX) {
      let SquadsBlock = document.getElementById(id);
      if (SquadsBlock) {
        SquadsBlock.style.top = Number(toInfoBlock.offset().top + offsetY) + "px";
        SquadsBlock.style.left = Number(toInfoBlock.offset().left + offsetX) + "px";
      }
    },
    progressTraining(lvl) {
      lvl++;
      this.$store.getters.getWSByService('chat').socket.send(JSON.stringify({
        event: "training",
        count: lvl,
      }));
      this.$store.commit({
        type: 'setTraining',
        training: lvl,
      });
    },
    checkHangarAndInventory() {

      let open = this.openComponents['wrapperInventoryAndStorage'] &&
        this.openComponents['wrapperInventoryAndStorage'].open &&
        this.openComponents['inventoryBox'] &&
        this.openComponents['inventoryBox'].open;

      this.$store.commit({
        type: 'setTrainingIntoHangar',
        need: !open,
      });

      return open
    }
  },
  computed: {
    training() {
      return this.$store.getters.getUserTraining
    },
    openComponents() {
      return this.$store.getters.getNeedOpenComponents
    },
    inventory() {
      return this.$store.getters.getInventory
    },
    dialog() {
      return this.$store.getters.getOpenDialog;
    },
    baseStatus() {
      return this.$store.getters.getBaseStatus
    },
  }
}
</script>

<style scoped>
.dialogBlock {
  position: absolute;
  display: block;
  width: 300px;
  height: 100px;
  z-index: 999;
  bottom: calc(50% + 150px);
  left: calc(50% - 150px);
  pointer-events: none;
}

.dialogBlock .dialogPicture {
  border-radius: 5px;
  height: 75px;
  width: 75px;
  border: 1px solid #25a0e1;
  background-color: rgba(33, 176, 255, 0.6);
  float: right;
  margin-bottom: 5px;
  position: absolute;
  right: -85px;
  pointer-events: auto;
}

.dialogBlock.Training .dialogText, .dialogBlock.Training .asks, .dialogBlock.Training .dialogPicture {
  border: 1px dashed #F8FF00;
  background-color: #E8651E;
  box-shadow: 0 0 4px 2px;
}

.dialogBlock .dialogText {
  border-radius: 5px;
  height: 100%;
  width: 100%;
  border: 1px solid #25a0e1;
  background-color: rgba(33, 176, 255, 0.6);
  padding: 19px 0 0;
  pointer-events: auto;
}

.dialogBlock.Training .dialogText, .dialogBlock.Training .asks, .dialogBlock.Training .dialogPicture {
  border: 1px dashed #F8FF00;
  background-color: #E8651E;
  box-shadow: 0 0 4px 2px;
}

.dialogBlock .nameDialog {
  color: #ff7800;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  font-size: 11px;
  position: absolute;
  bottom: 5px;
  width: 100%;
  background-color: rgba(135, 140, 140, 0.86);
  height: 15px;
  line-height: 15px;
  box-shadow: 0 0 5px black;
}

.wrapperText, .pictureBack, .wrapperAsk {
  pointer-events: auto;
  padding: 10px;
  word-wrap: break-word;
  overflow-y: scroll;
  border-radius: 5px;
  text-align: justify;
  margin: auto auto 2px 3px;
  height: 77px;
  width: 274px;
  font-size: 12px;
  float: left;
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
  font-weight: 900;
}

.wrapperText, .pictureBack, .wrapperAsk {
  pointer-events: auto;
  padding: 10px;
  word-wrap: break-word;
  overflow-y: scroll;
  border-radius: 5px;
  text-align: justify;
  margin: auto auto 2px 3px;
  height: 77px;
  width: 274px;
  font-size: 12px;
  float: left;
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
  font-weight: 900;
}

.dialogBlock.Training .dialogText p {
  text-indent: 1.5em;
  margin-top: 0;
}

.pictureBack {
  padding: 0;
  height: 70px;
  width: 70px;
  overflow-y: hidden;
  margin: 3px;
  background-size: cover;
  background-image: url(../../assets/dialogPictures/training.png);
}

.asks {
  border-radius: 5px;
  width: 100%;
  border: 1px solid #25a0e1;
  background-color: rgba(33, 176, 255, 0.6);
  float: left;
  margin-top: 4px;
  min-height: 23px;
  transition: 100ms;
  text-align: left;
}

.dialogBlock.Training .asks {
  border: 1px solid #F8FF00;
}

.asks .wrapperAsk {
  min-height: 16px;
  max-height: 22px;
  overflow-y: hidden;
  width: calc(100% - 22px);
  margin: 1px;
  padding: 2px 10px;
  line-height: 22px;
  font-size: 14px;
}

.wrapperText, #pictureBack, .wrapperAsk {
  pointer-events: auto;
  padding: 10px;
  word-wrap: break-word;
  overflow-y: scroll;
  border-radius: 5px;
  text-align: justify;
  margin: auto auto 2px 3px;
  height: 77px;
  width: 274px;
  font-size: 12px;
  float: left;
  box-shadow: inset 0 0 5px black;
  background: #8cb3c7;
  font-weight: 900;
}

.mask {
  position: absolute;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7);
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

.dialogBlock.Training .asks:hover {
  border: 1px solid #959c00;
}

.asks:active {
  transform: scale(0.98);
}

.wrapperText .definition {
  color: #ff9400;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}
</style>
