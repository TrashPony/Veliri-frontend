<template>
  <div class="content_section">
    <h2 class="head">Защитники</h2>
    <p>Около некоторых баз можно встретить защитников. Защитник - это особый фракционный дрон который обороняет
      территорию вокруг базы. Следит что бы никто не нарушал закон и эвакуирует транспорты по запросу в пределах базы.
      Имеет колосальную огневую мощь и почти неуязвим для обычных транспортов. Однако не могут действовать за
      пределами влияния базы.</p>

    <div class="detailImg" :style="{
        backgroundImage: 'url(' + $parent.getUrlImg('defenders_1', 'png')+ ')',
        width: '420px',
        height: '150px',
        marginLeft: 'calc(50% - 210px)',
        }"/>

    <div class="content_section">
      <p>Защитники замораживают всех игроков которые находятся в статуесе "PVP" и атакуют игроков в статусе "PK"</p>
      <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('guard_1', 'gif')+ ')',
            width: '320px',
            height: '185px',
            marginLeft: 'calc(50% - 160px)',
            }"/>
    </div>

    <div class="content_section">
      <p>Защитники могут эвакуировать ваш транспорт по запросу если он находится на территории базы.</p>
      <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('defender2', 'gif')+ ')',
            width: '320px',
            height: '185px',
            marginLeft: 'calc(50% - 160px)',
            }"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Defenders"
}
</script>

<style scoped>

</style>
