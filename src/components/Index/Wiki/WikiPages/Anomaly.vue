<template>
  <div class="content_section">
    <h2 class="head">Аномалии</h2>

    <p>Аномалии это ящики с различным лутом которые спрятаны под землей, чем опаснее сектор тем там больше аномалий и
      больше нагада за их обнаружение.</p>

    <p>Типы аномалий:</p>
    <ul>
      <li>ящик с ресурсами и деталями</li>
      <li>ящик с блюпринтами</li>
      <li>ящик с залежами руды</li>
      <li>ящик с патронами</li>
      <li>ящик с лорным текстом</li>
      <li>ящик с мусором</li>
      <li>ловушка взрыв</li>
      <li>ловушка нпс</li>
    </ul>

    <h3 class="headSection">Поиск аномалий</h3>

    <p>С помощью сканера можно улавливать различные сигналы вокруг сканера. Это и будут аномалии</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' +  $parent.getUrlImg('scanner_1', 'gif')+ ')',
            width: '300px',
            height: '175px',
            marginLeft: 'calc(50% - 150px)',
            }"/>

    <p>После того как удалось локализировать аномалию в этом месте надо провести раскопси в помощью дрона копателя.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' +  $parent.getUrlImg('scanner_2', 'gif')+ ')',
            width: '300px',
            height: '265px',
            marginLeft: 'calc(50% - 150px)',
            }"/>

  </div>
</template>

<script>
export default {
  name: "Anomaly"
}
</script>

<style scoped>

</style>
