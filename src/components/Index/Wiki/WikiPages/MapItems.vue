<template>
  <div class="content_section">
    <h2 class="head">Предметы на земле</h2>
    <p> Когда кто то выкидывает предметы из трюма то они попадают на землю. Эти предметы никак не клияют на акружающую
      среду, но сама среда может на них влиять, при столкновение с транспортами, обьектами и между собой они будут
      отталкиватся, на них взаимодейтсвует гравипушка и их можно поднять манипулятором.</p>

    <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('map_items', 'png')+ ')',
            width: '250px',
            height: '200px',
            marginLeft: 'calc(50% - 125px)',
    }"/>
  </div>
</template>

<script>
export default {
  name: "MapItems"
}
</script>

<style scoped>

</style>
