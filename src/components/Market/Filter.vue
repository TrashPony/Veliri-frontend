<template>
  <div id="listItem">

    <div class="categoryItem" id="ammoCategoryItem">

      <span @click="selectFilter('ammo', '', 0, 0)">
        {{ filters.selectType === 'ammo' ? '▼' : '▶' }}
        {{ language === 'RU' ? 'Боеприпасы' : 'Ammunition' }}
      </span>

      <div class="scrollFilter" v-if="filters.selectType === 'ammo'">

        <span v-for="ammo in ammoTypes" @click.stop="selectFilter('ammo', ammo.type, 0, 0)" class="category">
          {{ filters.ammo.type === ammo.type ? '▼' : '▶' }} {{ ammo.title }}

          <div class="scrollFilter" @click.stop="" v-if="filters.ammo.type === ammo.type">

            <template v-for="type in sizeTypes">
              <span @click.stop="selectFilter('ammo', ammo.type, type.size, 0)" class="category">
                      {{ filters.ammo.size === type.size ? '▼' : '▶' }} {{ type.title }}

                <div class="scrollFilter items" @click.stop="" v-if="filters.ammo.size === type.size">
                  <div v-for="item in filterItems"
                       @click.stop="selectFilter('ammo', ammo.type, type.size, item.id, item)">
                          {{ handbook['ammo'][language][item.name].name }}
                  </div>
                </div>
              </span>
            </template>
          </div>
        </span>
      </div>
    </div>

    <div class="categoryItem" id="weaponCategoryItem">

      <span @click="selectFilter('weapon', '', 0, 0)">
        {{ filters.selectType === 'weapon' ? '▼' : '▶' }}
        {{ language === 'RU' ? 'Оружие' : 'Weapon' }}
      </span>

      <div class="scrollFilter" v-if="filters.selectType === 'weapon'">
        <span v-for="weapon in weaponsTypes" @click.stop="selectFilter('weapon', weapon.type, 0, 0)" class="category">
              {{ filters.weapon.type === weapon.type ? '▼' : '▶' }} {{ weapon.title }}

          <div class="scrollFilter" @click.stop="" v-if="filters.weapon.type === weapon.type">
                <template v-for="type in sizeTypes">
                  <span @click.stop="selectFilter('weapon', weapon.type, type.size, 0)" class="category">
                    {{ filters.weapon.size === type.size ? '▼' : '▶' }} {{ type.title }}
                    <div class="scrollFilter items" @click.stop="" v-if="filters.weapon.size === type.size">
                      <div v-for="item in filterItems"
                           @click.stop="selectFilter('weapon', weapon.type, type.size, item.id, item)">
                       {{ handbook['weapon'][language][item.name].name }}
                      </div>
                    </div>
                  </span>
                </template>
          </div>
        </span>
      </div>
    </div>

    <div class="categoryItem" id="cabsCategoryItem">

      <span @click="selectFilter('body', '', 0, 0)">
        {{ filters.selectType === 'body' ? '▼' : '▶' }}
        {{ language === 'RU' ? 'Корпуса' : 'Bodies' }}
      </span>

      <div class="scrollFilter" @click.stop="" v-if="filters.selectType === 'body'">
          <span v-for="body in bodyTypes" @click.stop="selectFilter('body', '', body.size, 0)" class="category">
              {{ filters.body.size === body.size ? '▼' : '▶' }} {{ body.title }}
              <div class="scrollFilter items" @click.stop="" v-if="filters.body.size === body.size">
                <div v-for="item in filterItems" @click.stop="selectFilter('body', '', body.size, item.id, item)">
                  {{ handbook['body'][language][item.name].name }}
                </div>
              </div>
            </span>
      </div>
    </div>

    <div class="categoryItem" id="equipCategoryItem">
          <span @click="selectFilter('equip', '', 0, 0)">
            {{ filters.selectType === 'equip' ? '▼' : '▶' }}
            {{ language === 'RU' ? 'Снаряжение' : 'Equipment' }}
          </span>

      <div class="scrollFilter" @click.stop="" v-if="filters.selectType === 'equip'">
          <span v-for="equip in equipTypes" @click.stop="selectFilter('equip', '', equip.size, 0)" class="category">
              {{ filters.equip.size === equip.size ? '▼' : '▶' }} {{ equip.title }}
              <div class="scrollFilter items" @click.stop="" v-if="filters.equip.size === equip.size">
                <div v-for="item in filterItems" v-if="item.unit"
                     @click.stop="selectFilter('equip', '', equip.size, item.id, item)">
                  {{ handbook['equip'][language][item.name].name }}
                </div>
              </div>
            </span>
      </div>
    </div>

    <div class="categoryItem" id="resCategoryItem">

      <span @click="selectFilter('resource', '', 0, 0)">
        {{ filters.selectType === 'resource' ? '▼' : '▶' }}
        {{ language === 'RU' ? 'Ресурсы' : 'Resources' }}
      </span>

      <div class="scrollFilter" @click.stop="" v-if="filters.selectType === 'resource'">
          <span v-for="resource in resourceTypes" @click.stop="selectFilter('resource', resource.type, 0, 0)"
                class="category">
              {{ filters.resource.type === resource.type ? '▼' : '▶' }} {{ resource.title }}
              <div class="scrollFilter items" @click.stop="" v-if="filters.resource.type === resource.type">
                <div v-for="item in filterItems"
                     @click.stop="selectFilter('resource', resource.type, 0, item.id, item)">
                  {{ handbook[resource.type][language][item.name].name }}
                </div>
              </div>
            </span>
      </div>
    </div>

    <div class="categoryItem" id="bpCategoryItem">

      <span @click="selectFilter('blueprints', '', 0, 0)">
        {{ filters.selectType === 'blueprints' ? '▼' : '▶' }}
        {{ language === 'RU' ? 'Чертежи' : 'Blueprints' }}
      </span>

      <div class="scrollFilter" @click.stop="" v-if="filters.selectType === 'blueprints'">
        <span v-for="blueprint in bpTypes" @click.stop="selectFilter('blueprints', blueprint.type, 0, 0)"
              class="category">
                {{ filters.blueprints.type === blueprint.type ? '▼' : '▶' }} {{ blueprint.title }}
                <div class="scrollFilter items" @click.stop="" v-if="filters.blueprints.type === blueprint.type">
                  <div v-for="item in filterItems"
                       @click.stop="selectFilter('blueprints', blueprint.type, 0, item.id, item)">
                    {{ handbook[item.item_type][language][item.item_name].name }}
                  </div>
                </div>
        </span>
      </div>
    </div>

    <div class="categoryItem" id="boxCategoryItem">
      <span @click="selectFilter('boxes', '', 0, 0)">
        {{ filters.selectType === 'boxes' ? '▼' : '▶' }}
        {{ language === 'RU' ? 'Ящики' : 'Boxes' }}
      </span>

      <div class="scrollFilter items" @click.stop="" v-if="filters.selectType === 'boxes'">
        <div v-for="item in filterItems" @click.stop="selectFilter('boxes', '', 0, item.id, item)">
          {{ handbook['boxes'][language][item.name].name }}
        </div>
      </div>
    </div>

    <div class="categoryItem" id="trashCategoryItem">
      <span @click="selectFilter('trash', '', 0, 0)">
        {{ filters.selectType === 'trash' ? '▼' : '▶' }}
        {{ language === 'RU' ? 'Хлам' : 'Rubbish' }}
      </span>

      <div class="scrollFilter items" @click.stop="" v-if="filters.selectType === 'trash'">
        <div v-for="item in filterItems" @click.stop="selectFilter('trash', '', 0, item.id, item)">
          {{ handbook['trash'][language][item.name].name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Filter",
  data() {
    return {
      openTables: {}
    }
  },
  methods: {
    selectFilter(main, type, size, id, item) {

      let newSelectType = '';
      let newType = '';
      let newSize = 0;

      if (main === this.filters.selectType && type === '' && size === 0 && id === 0) {
      } else {
        newSelectType = main;
      }

      if (main === this.filters.selectType && type === this.filters[main].type && size === 0 && id === 0) {
      } else {
        newType = type;
      }

      if (main === this.filters.selectType && type === this.filters[main].type && size === this.filters[main].size && id === 0) {
      } else {
        newSize = size;
      }

      this.$store.commit({
        type: 'setMarketFilter',
        main: newSelectType,
        item: item,
        filterType: newType,
        size: newSize,
        id: id,
      });
    },
  },
  computed: {
    filters() {
      return this.$store.getters.getMarketFilter
    },
    market() {
      return this.$store.getters.getMarket
    },
    language() {
      return this.$store.getters.getSettings.Language
    },
    handbook() {
      return this.$store.getters.getHandBook
    },
    sizeTypes() {
      return [
        {title: this.language === "RU" ? "Малые" : "Small", size: 1},
        {title: this.language === "RU" ? "Средние" : "Medium", size: 2},
        {title: this.language === "RU" ? "Большие" : "Large", size: 3},
      ]
    },
    bodyTypes() {
      return [
        {title: this.language === "RU" ? "Легкие" : "Light", size: 1},
        {title: this.language === "RU" ? "Средние" : "Medium", size: 2},
        {title: this.language === "RU" ? "Тяжелые" : "Heavy", size: 3},
      ]
    },
    equipTypes() {
      return [
        {title: 'I', size: 1},
        {title: 'II', size: 2},
        {title: 'III', size: 3},
      ]
    },
    bpTypes() {
      // ['ammo', 'body', 'weapon', 'equip', 'detail', 'boxes', 'map']
      return [
        {title: this.language === "RU" ? "Боеприпасы" : "Ammunition", type: 'ammo'},
        {title: this.language === "RU" ? "Корпуса" : "Bodies", type: 'body'},
        {title: this.language === "RU" ? "Оружие" : "Weapons", type: 'weapon'},
        {title: this.language === "RU" ? "Снаряжение" : "Equipments", type: 'equip'},
        {title: this.language === "RU" ? "Детали" : "Details", type: 'detail'},
        {title: this.language === "RU" ? "Ящики" : "Boxes", type: 'boxes'},
        {title: this.language === "RU" ? "Структуры" : "Structures", type: 'map'},
      ]
    },
    resourceTypes() {
      return [
        {title: this.language === "RU" ? "Ископаемые" : "Fossils", type: 'resource'},
        {title: this.language === "RU" ? "Сырье" : "Raw", type: 'recycle'},
        {title: this.language === "RU" ? "Детали" : "Details", type: 'detail'},
      ]
    },
    ammoTypes() {
      return [
        {title: this.language === "RU" ? "Лазерные" : "Laser", type: 'laser'},
        {title: this.language === "RU" ? "Ракетные" : "Missile", type: 'missile'},
        {title: this.language === "RU" ? "Балистические" : "Ballistic", type: 'firearms'},
      ]
    },
    weaponsTypes() {
      return [
        {title: this.language === "RU" ? "Лазерное" : "Laser", type: 'laser'},
        {title: this.language === "RU" ? "Ракетное" : "Missile", type: 'missile'},
        {title: this.language === "RU" ? "Балистическое" : "Ballistic", type: 'firearms'},
      ]
    },
    filterItems() {
      let items = [];

      if (this.filters.selectType === '' || !this.market.assortment) return [];

      let filterType = this.filters[this.filters.selectType];

      if (this.filters.selectType === 'resource') {
        for (let i in this.market.assortment[this.filters[this.filters.selectType].type]) {
          let item = this.market.assortment[this.filters[this.filters.selectType].type][i];
          items.push(item)
        }
      } else {

        if (!this.market.assortment[this.filters.selectType]) return [];

        for (let i in this.market.assortment[this.filters.selectType]) {
          let item = this.market.assortment[this.filters.selectType][i];

          if (this.filters.selectType === 'ammo' || this.filters.selectType === 'weapon') {
            if (filterType.type === item.type && filterType.size === item.standard_size) {
              items.push(item)
            }
          }

          if (this.filters.selectType === 'body') {
            if (filterType.size === item.standard_size) {
              items.push(item)
            }
          }

          if (this.filters.selectType === 'equip') {
            if (filterType.size === item.type_slot) {
              items.push(item)
            }
          }

          if (this.filters.selectType === 'blueprints') {
            if (filterType.type === 'map' && item.in_map) {
              items.push(item)
            } else if (filterType.type === item.item_type) {
              items.push(item)
            }
          }

          if (this.filters.selectType === 'boxes' || this.filters.selectType === 'trash') {
            items.push(item)
          }
        }
      }

      return items
    },
  }
}
</script>

<style scoped>
#listItem {
  border-radius: 4px;
  height: 387px;
  width: 150px;
  margin: 0 5px 5px 2px;
  padding-top: 4px;
  overflow-y: scroll;
  overflow-x: hidden;
  box-shadow: inset 0 0 5px black;
  background: #5d5d5d;
}

.categoryItem {
  text-align: left;
  display: block;
  width: calc(100% - 11px);
  padding-left: 2px;
  background: linear-gradient(22deg, rgb(221, 112, 52), #6c6c6c) center top / 190px 15px no-repeat;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 4px;
  font-size: 9px;
  line-height: 14px;
  min-height: 15px;
  user-select: none;
  margin: 2px auto;
}

.categoryItem:hover {
  background: linear-gradient(22deg, rgb(251, 142, 82), #6c6c6c) center top / 190px 15px no-repeat;
}

.category {
  display: block;
  min-height: 15px;
  user-select: none;
  background: linear-gradient(22deg, rgba(183, 195, 201, 0.29), rgba(183, 195, 201, 0.29)) center top / 190px 15px no-repeat;
  margin: 2px auto;
  padding-left: 4px;
  border-radius: 2px;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 1px;
}

.category:hover {
  background: linear-gradient(22deg, rgba(183, 195, 201, 0.59), rgba(183, 195, 201, 0.59)) center top / 190px 15px no-repeat;
}

.categoryItem div > div {
  background-color: rgba(255, 255, 255, 0.2);
  text-indent: 3px;
  padding: 1px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-radius: 2px;
  margin: 1px 0;
  font-weight: 900;
  text-shadow: 0 -1px 1px #000000, 0 -1px 1px #000000, 0 1px 1px #000000, 0 1px 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px 0 1px #000000, 1px 0 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000, -1px -1px 1px #000000, 1px -1px 1px #000000, -1px 1px 1px #000000, 1px 1px 1px #000000;
}

.categoryItem div > div:hover {
  background-color: rgba(255, 255, 255, 0.4);
}


.categoryItem span {
  height: 100%;
  display: block;
}

.scrollFilter.items {
  font-size: 9px;
  color: #ffde09;
  margin-top: 3px;
}

</style>
