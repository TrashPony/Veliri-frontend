<template>
  <ul class="content_list">
    <li>
      <div class="content_button disable">Мир</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub" @click="toPath('sector')">Сектор</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('teleports')">Телепорты</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('base')">База</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('defenders')">Защитники</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('Npc')">Боты</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('Structures')">Временные структуры</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('expedition')">Экспедиции</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('law')">Система правосудия</div>
        </li>
      </ul>
    </li>
    <li>
      <div class="content_button disable">Транспорт и снаряжение</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub" @click="toPath('bodies')">Корпуса</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('weapons')">Оружие</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('equips')">Снаряжение</div>
        </li>
      </ul>
    </li>
    <li>
      <div class="content_button disable">Бой и управление</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub disable" @click="toPath('scouting')">Разведка</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('control')">Управление</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('ballistic')">Стрельба и баллистика</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('auto_pilot')">Автопилот</div>
        </li>
      </ul>
    </li>
    <li>
      <div class="content_button disable">Добыча ресурсов</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub" @click="toPath('mining')">Добыча руды</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('')">Добыча нефти</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('salvage')">Сбор обломков</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('anomaly')">Поиск аномалий</div>
        </li>
      </ul>
    </li>
    <li>
      <div class="content_button disable">Производство</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub" @click="toPath('processing')">Центр переработки</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('parts_production')">Детали</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('blueprints')">Чертежи</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('craft_items')">Создание предметов на базе</div>
        </li>
      </ul>
    </li>
    <li>
      <div class="content_button disable">Управление имуществом</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub disable" @click="toPath('boxes')">Ящики</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('map_items')">Предметы на земле</div>
        </li>
      </ul>
    </li>
    <li>
      <div class="content_button disable">Экономика</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub disable" @click="toPath('market')">Рынок</div>
        </li>
      </ul>
    </li>
    <li>
      <div class="content_button disable">Строительство</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub disable" @click="toPath('map_blueprint')">Чертеж</div>
        </li>
        <li>
          <div class="content_button sub" @click="toPath('install_and_dismantling')">Установка и демонтаж</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('structure_type')">Типы строений</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('special_cell')">Инвентарь и специльные ячейки</div>
        </li>
      </ul>
    </li>
    <li>
      <div class="content_button disable">Фракции</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub disable" @click="toPath('Replics')">Replics</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('Explores')">Explores</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('Reverses')">Reverses</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('aop')">АОП</div>
        </li>
      </ul>
    </li>
    <li>
      <div class="content_button" @click="toPath('fraction_war')">Фракционная война</div>
    </li>
    <li>
      <div class="content_button" @click="toPath('missions')">Задания</div>
    </li>
    <li>
      <div class="content_button disable">Навыки персонажа</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub disable" @click="toPath('fine')">Штрафы</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('bonus')">Бонусы корпусов</div>
        </li>
      </ul>
    </li>
    <li>
      <div class="content_button disable">Социальность</div>
      <ul class="content_list" style="margin-top: 5px">
        <li>
          <div class="content_button sub disable" @click="toPath('clusters')">Кластеры</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('squad')">Отряды</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('chat')">Чат</div>
        </li>
        <li>
          <div class="content_button sub disable" @click="toPath('friends')">Друзья</div>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: "ContentList",
  methods: {
    toPath(path) {
      this.$parent.tab = path;
      this.$router.push({path: `/wiki/${path}`});
    },
    getUrlImg(imgName, format) {
      return require('../../../assets/indexImg/index_detail/' + imgName + '.' + format)
    }
  },
}
</script>

<style scoped>
.head {
  margin: 0 0 7px;
  background: #dd7034;
  color: hsla(0, 0%, 100%, .8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 19px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px #000;
  font-weight: 700;
  box-shadow: 0 0 2px #000;
  margin-top: 10px;
}

.content_button {
  text-indent: 5px;
  pointer-events: auto;
  text-align: left;
  transition: .1s;
  box-shadow: 0 0 2px #000;
  height: 15px;
  width: 200px;
  background: rgba(255, 129, 0, .75);
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 10px;
  line-height: 16px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.content_button.sub {
  background: rgba(243, 129, 11, 0.5);
}

.content_button:active {
  transform: scale(.98);
}

.content_button:hover {
  background: #ff8100;
}

.disable {
  pointer-events: none !important;
  background: grey !important;
}
</style>
