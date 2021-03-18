<template>
  <div class="content_section">
    <h3 class="headSection">Задания</h3>

    <p>На базах можно получить различные задания, через меню базы в разделе "Связь".</p>
    <p>У диспетчера задач можно получить ежедневное или простое задание. Сюжетные компании выделены как отдельные пункты
      меню связь, это несколько заданий связаные единым сюжетом.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('mission_3', 'png')+ ')',
            width: '226px',
            height: '95px',
            marginLeft: 'calc(50% - 113px)',
            }"/>

    <p>Задание представляет из себя набор диалого и задач которые необходимо выполнить игроку, подробно о активных
      заданиях игрока можно узнать в меню "Личное дело" вкладка "Задания".</p>
    <div class="detailImg" :style="{
        backgroundImage: 'url(' + $parent.getUrlImg('mission_4', 'png')+ ')',
        width: '577px',
        height: '610px',
        marginLeft: 'calc(50% - 288px)',
        }"/>


    <p>Некоторые диалоги в игре имеют скрытые ответы которые открываются после посещения необходимых страниц, диалоги и
      задания могут имеют разную вариативность и итог.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('mission_1', 'png')+ ')',
            width: '410px',
            height: '395px',
            marginLeft: 'calc(50% - 205px)',
            }"/>

    <p>Для отслеживания целей используется меню миссий а подсказки
      показываются на мини карте и иногда в самой игре.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('mission_2', 'png')+ ')',
            width: '459px',
            height: '225px',
            marginLeft: 'calc(50% - 230px)',
            }"/>
  </div>
</template>

<script>
export default {
  name: "Missions"
}
</script>

<style scoped>

</style>
