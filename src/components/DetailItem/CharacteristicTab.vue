<template>
  <div>
    <table v-if="type === 'resource' || type === 'recycle' || type === 'detail' || type === 'trash'">
      <tr>
        <td>Занимаемый объем</td>
        <td>{{ item.size }} м^3</td>
      </tr>
    </table>

    <table v-if="type === 'boxes'">
      <tr>
        <td>Вместимость</td>
        <td>{{ item.capacity_size }} м^3</td>
      </tr>

      <tr>
        <td>Прочность</td>
        <td>{{ item.hp }}</td>
      </tr>

      <tr>
        <td>Занимаемый объем в трюме</td>
        <td>{{ item.fold_size }} м^3</td>
      </tr>

      <tr v-if="item.protect">
        <td colspan="2">Защищен паролем</td>
      </tr>

      <tr v-if="item.underground">
        <td colspan="2">Находится под землей</td>
      </tr>
    </table>

    <table v-if="type === 'body'">
      <tr>
        <td>Размер корпуса</td>
        <td>{{ getStandardSizeName(item.standard_size) }}</td>
      </tr>
      <tr>
        <td>Объем трюма</td>
        <td>{{ item.capacity_size }}</td>
      </tr>
      <tr>
        <!--        15 это округленная доля от секунды которую состовляет серсвер тик, смотри пакет на бекенде _const.ServerTickSecPart-->
        <td>Макс. скорость</td>
        <td>{{ Math.round((item.speed / 15) * 29) }} км/сек</td>
      </tr>
      <tr>
        <!--        15 это округленная доля от секунды которую состовляет серсвер тик, смотри пакет на бекенде _const.ServerTickSecPart-->
        <td>Разгон</td>
        <td>+{{ Math.round((item.power_factor / 15) * 29) }} км/сек</td>
      </tr>
      <tr>
        <!--        15 это округленная доля от секунды которую состовляет серсвер тик, смотри пакет на бекенде _const.ServerTickSecPart-->
        <td>Скорость поворота</td>
        <td>{{ Math.round(((item.turn_speed / 15) * 64) * 180 / Math.PI) }} гр/сек</td>
      </tr>
      <tr>
        <td>Дальность обзора</td>
        <td>{{ item.range_view }}</td>
      </tr>
      <tr>
        <td>Дальность радара</td>
        <td>{{ item.range_radar }}</td>
      </tr>
      <tr>
        <td>Структура</td>
        <td>{{ item.max_hp }}</td>
      </tr>
      <tr>
        <td>Броня</td>
        <td>{{ item.armor }} %</td>
      </tr>
      <tr>
        <td colspan="2" style="text-align: left;color: black;text-shadow: none;">
          Уязвимости:
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="vul">
            <div :style="{background: '#666666', width: item.vul_to_kinetics + '%'}"></div>
            <span>{{ item.vul_to_kinetics }} %</span>
          </div>
          <div class="vul">
            <div :style="{background: '#de5011', width: item.vul_to_thermo + '%'}"></div>
            <span>{{ item.vul_to_thermo }} %</span>
          </div>
          <div class="vul">
            <div :style="{background: '#f8ff0d', width: item.vul_to_explosion + '%'} "></div>
            <span>{{ item.vul_to_explosion }} %</span>
          </div>
        </td>
      </tr>
      <tr>
        <td>Вместимость аккамулятора</td>
        <td>{{ item.max_power }}</td>
      </tr>
    </table>

    <table v-if="type === 'ammo'">
      <tr>
        <td>{{ language === 'RU' ? 'Размер боеприпаса' : 'Ammunition size' }}</td>
        <td>{{ getStandardSizeName(item.standard_size) }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Тип оружия' : 'Weapon type' }}</td>
        <td>{{ getWeaponTypeName(item.type) }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Тип атаки' : 'Attack type' }}</td>
        <td>{{ getTypeAttackName(item.type_attack) }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Урон' : 'Damage' }}</td>
        <td>{{ item.min_damage }} - {{ item.max_damage }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Радиус поражения' : 'Damage radius' }}</td>
        <td>{{ item.area_covers }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Скорость полета пули' : 'Bullet speed' }}</td>
        <td>{{ item.bullet_speed }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Занимаемый объем' : 'Occupied volume' }}</td>
        <td>{{ item.size }} м^3</td>
      </tr>

      <tr v-if="item.chase_target">
        <td colspan="2">{{ language === 'RU' ? 'Управляемый снаряд' : 'Guided projectile' }}</td>
      </tr>
    </table>

    <table v-if="type === 'equip'">

      <template v-if="item.applicable === 'passive'">
        <tr v-for="effect in item.effects">
          <td>{{ getParameterName(effect.parameter) }}</td>
          <td>{{ getEffectSymbol(effect.type) }} {{ effect.quantity }}</td>
        </tr>
      </template>

      <template v-if="item.applicable === 'energy_shield'">
        <tr>
          <td>Макс. прочность</td>
          <td>{{ item.max_hp }}</td>
        </tr>
        <tr>
          <td>Радиус щита</td>
          <td>{{ item.radius }}</td>
        </tr>
        <tr>
          <td>Востановление прочности</td>
          <td>{{ item.recovery }}</td>
        </tr>
        <tr>
          <td>Потребляемая энергия</td>
          <td>{{ item.use_power * 2 }}</td>
        </tr>
        <tr>
          <td>Потребляемая энергия в простое</td>
          <td>{{ item.use_power }}</td>
        </tr>
        <tr>
          <td>Время такта</td>
          <td>{{ item.recovery_cycle / 1000 }} сек.</td>
        </tr>
        <tr>
          <td>Время востановления после урона</td>
          <td>{{ item.reload }} сек.</td>
        </tr>
      </template>

      <template v-if="item.applicable === 'hide_radar'">
        <tr>
          <td>Радиус мемех</td>
          <td>{{ item.radius }}</td>
        </tr>
        <tr>
          <td>Потребляемая энергия за такт</td>
          <td>{{ item.use_power }}</td>
        </tr>
        <tr>
          <td>Время перезарядки</td>
          <td>{{ item.reload / 1000 }} сек.</td>
        </tr>
      </template>

      <template v-if="item.applicable === 'missile_defense'">
        <tr>
          <td>Радиус защиты</td>
          <td>{{ item.radius }}</td>
        </tr>
        <tr>
          <td>Потребляемая энергия за сбитие</td>
          <td>{{ item.use_power }}</td>
        </tr>
        <tr>
          <td>Время перезарядки</td>
          <td>{{ item.reload / 1000 }} сек.</td>
        </tr>
      </template>

      <template v-if="item.applicable === 'repair'">
        <tr>
          <td>Дальность ремонта</td>
          <td>{{ item.radius }}</td>
        </tr>
        <tr>
          <td>Время перезарядки</td>
          <td>{{ item.reload / 1000 }} сек.</td>
        </tr>
        <tr>
          <td>Потребляемая энергия</td>
          <td>{{ item.use_power }}</td>
        </tr>
        <tr>
          <td>Кол-во востанавливаемой прочности</td>
          <td>{{ item.count }}</td>
        </tr>
      </template>

      <template v-if="item.applicable === 'ore'">
        <tr>
          <td>Кол-во добываемой руды</td>
          <td>{{ item.region }}</td>
        </tr>
        <tr>
          <td>Кол-во тактов до добычи</td>
          <td>{{ Math.round(100 / item.count) }}</td>
        </tr>
        <tr>
          <td>Дальность добычи</td>
          <td>{{ item.radius }}</td>
        </tr>
        <tr>
          <td>Скорость перезарядки</td>
          <td>{{ item.reload / 1000 }} сек.</td>
        </tr>
        <tr>
          <td>Потребление энергии за такт</td>
          <td>{{ item.use_power }}</td>
        </tr>
      </template>

      <template v-if="item.applicable === 'digger'">
        <tr>
          <td>Дальность управления</td>
          <td>{{ item.radius }}</td>
        </tr>
        <tr>
          <td>Радиус раскопок</td>
          <td>{{ item.region }}</td>
        </tr>
        <tr>
          <td>Перезарядка дрона</td>
          <td>{{ item.reload }} сек.</td>
        </tr>
        <tr>
          <td>Энергия для активации дрона</td>
          <td>{{ item.use_power }}</td>
        </tr>
      </template>

      <template v-if="item.applicable === 'build'">
        <tr>
          <td>Дальность строительства</td>
          <td>{{ item.radius }}</td>
        </tr>
        <tr>
          <td>Скорость перезарядки</td>
          <td>{{ item.reload / 1000 }} сек.</td>
        </tr>
        <tr>
          <td>Потребление энергии за такт</td>
          <td>{{ item.use_power }}</td>
        </tr>
        <tr>
          <td>Пополнение прочности за такт</td>
          <td>{{ item.count }}</td>
        </tr>
      </template>

      <template v-if="item.applicable === 'generator'">
        <tr>
          <td>Дальность передачи энергии</td>
          <td>{{ item.radius }}</td>
        </tr>
        <tr>
          <td>Передаваемая энергия за такт</td>
          <td>{{ item.count }}</td>
        </tr>
        <tr>
          <td>Скорость перезарядки</td>
          <td>{{ item.reload / 1000 }} сек.</td>
        </tr>
      </template>

      <template v-if="item.applicable === 'geo_scan'">
        <tr>
          <td>Чувствительность датчика</td>
          <td>{{ item.radius }}</td>
        </tr>
        <tr>
          <td>Потребление энергии за сканирование</td>
          <td>{{ item.use_power }}</td>
        </tr>
        <tr>
          <td>Перезарядка</td>
          <td>{{ item.reload / 1000 }} сек.</td>
        </tr>
      </template>

      <tr>
        <td>Занимаемый объем</td>
        <td>{{ item.size }} м^3</td>
      </tr>
    </table>

    <table v-if="type === 'weapon'">
      <tr>
        <td>{{ language === 'RU' ? 'Размер оружия' : 'Weapon size' }}</td>
        <td>{{ getStandardSizeName(item.standard_size) }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Тип оружия' : 'Weapon type' }}</td>
        <td>{{ getWeaponTypeName(item.type) }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Скорость поворота' : 'Swing speed' }}</td>
        <td>{{ item.rotate_speed }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Модификатор урона' : 'Damage modifier' }}</td>
        <td>x {{ item.damage_modifier }}</td>
      </tr>

      <template v-if="item.type === 'firearms'">
        <tr>
          <td>{{ language === 'RU' ? 'Доступные углы атаки' : 'Available angles of attack' }}</td>
          <td>{{ item.min_angle }} - {{ item.max_angle }}</td>
        </tr>
        <tr>
          <td>{{ language === 'RU' ? 'Влияние на скорость пули' : 'Effect on bullet speed' }}</td>
          <td>{{ item.bullet_speed }}</td>
        </tr>
        <tr>
          <td>{{ language === 'RU' ? 'Дальность стрельбы' : 'Range attack' }}</td>
          <td>{{ language === 'RU' ? 'зависит от снаряда' : 'depends on the projectile' }}</td>
        </tr>
      </template>
      <template v-if="item.type !== 'firearms'">
        <tr>
          <td>{{ language === 'RU' ? 'Дальность стрельбы' : 'Range attack' }}</td>
          <td>{{ item.max_range }}</td>
        </tr>
      </template>


      <tr>
        <td>{{ language === 'RU' ? 'Очередь' : 'Queue' }}</td>
        <td>{{ item.count_fire_bullet }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Скорострельность' : 'Rate of fire' }}</td>
        <td>{{ Math.round(60000 / item.reload_time) }} (выс./мин)</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Боезапас' : 'Ammunition' }}</td>
        <td>{{ item.ammo_capacity }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Время перезарядки' : 'Reload time' }}</td>
        <td>{{ item.reload_ammo_time / 1000 }} сек.</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Необходимо энергии' : 'Energy Needed' }}</td>
        <td>{{ item.power }}</td>
      </tr>
      <tr>
        <td>{{ language === 'RU' ? 'Занимаемый объем' : 'Occupied volume' }}</td>
        <td>{{ item.size }} м^3</td>
      </tr>

      <tr v-if="item.artillery">
        <td colspan="2">артилерия</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "CharacteristicTab",
  props: ['type', 'item'],
  methods: {
    getStandardSizeName(size) {
      if (this.language === 'RU') {
        if (size === 1) return "малый";
        if (size === 2) return "average";
        if (size === 3) return "large";
      } else {
        if (size === 1) return "small";
        if (size === 2) return "средний";
        if (size === 3) return "большой";
      }
    },
    getWeaponTypeName(type) {
      if (this.language === 'RU') {
        if (type === "firearms") return "огнестрельное";
        if (type === "missile") return "ракетное";
        if (type === "laser") return "лазерное";
      } else {
        if (type === "firearms") return "firearms";
        if (type === "missile") return "missile";
        if (type === "laser") return "laser";
      }
    },
    getTypeAttackName(type) {
      if (this.language === 'RU') {
        if (type === "kinetics") return "кинетическое";
        if (type === "explosion") return "взрывное";
        if (type === "thermo") return "термическое";
      } else {
        if (type === "kinetics") return "kinetic";
        if (type === "explosion") return "explosive";
        if (type === "thermo") return "thermal";
      }
    },
    getParameterName(name) {
      if (name === 'armor') {
        return 'Броня'
      }
    },
    getEffectSymbol(type) {
      if (type === 'enhances') return '+';
      if (type === 'reduced') return '-';
    }
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.Language
    },
  }
}
</script>

<style scoped>
.detailItemInfoBody table {
  font-size: 11px;
  width: 100%;
  border-collapse: collapse;
}

.detailItemInfoBody tr {
  transition: 200ms;
}

.detailItemInfoBody tr td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.detailItemInfoBody tr td:last-child {
  color: #ffef0f;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
  text-align: right;
}

.vul {
  width: calc(33% - 3px);
  height: 20px;
  float: left;
  background: rgba(122, 127, 122, 0.4);
  margin-left: 3px;
  box-shadow: inset 0 0 2px black;
  position: relative;
}

.vul div {
  height: 100%;
  box-shadow: inset 0 0 2px 1px black;
}

.vul span {
  position: absolute;
  top: calc(50% - 6px);
  left: calc(50% - 6px);
  color: white;
}

.detailItemInfoBody tr:hover {
  background: rgba(179, 179, 179, 0.5);
}
</style>
