<template>
  <div class="content_section">
    <h2 class="head">Добыча руды</h2>

    <p>Руда это основной источник ресурсов в игре. Руда необходима для переплавки на сырье из которого можно производить
      снаряжение, сооружения, корпуса и снаряды.</p>
    <p>На текущий момент в игре 5 вид руд и сырьевых компонентов.</p>

    <p>Обычная руда:</p>
    <ul>
      <li>Медная руда</li>
      <li>Железная руда</li>
      <li>Ториевая руда</li>
    </ul>

    <p>Редкая руда (можно найти в боевой или свободной зоне):</p>
    <ul>
      <li>Титановая руда</li>
      <li>Кремниевая руда</li>
    </ul>

    <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('mining_1', 'png')+ ')',
            width: '400px',
            height: '140px',
            marginLeft: 'calc(50% - 200px)',
            }"/>

    <p>Залежи руды образуется в игровом мире случайно и добывать ее может каждый у кого есть необходимое снаряжение.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('mining_2', 'png')+ ')',
            width: '400px',
            height: '167px',
            marginLeft: 'calc(50% - 200px)',
            }"/>

    <h3 class="headSection">Добыча руды c помощью промышленого лазера:</h3>
    <ul>
      <li>Находите месторождение руды.</li>
      <li>Выбераете снаряжение для добычи.</li>
      <li>Нажимаете левую кнопку мыши на месторождение руды.</li>
      <li>Ждете когда заполнится шкала разработается месторождение.</li>
    </ul>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('mining_3', 'gif')+ ')',
            width: '300px',
            height: '185px',
            marginLeft: 'calc(50% - 150px)',
            }"/>

    <h3 class="headSection">Добыча руды c помощью строения:</h3>
    <ul>
      <li>Постройте экстрактор ресурсов над залежами реды.</li>
      <li>Заправте экстрактор топливом и он начнет автоматически добывать ресурсы</li>
      <li>Когда экстратор выполнить 1 цикл добычи он сбросить ресурсы в ящик/транспорт/склад которые расположены над
        зеленым квадратом
      </li>
      <li>Если ресурсы сбросить некуда добыча пекращается пока кто то не заберет ресурсы</li>
    </ul>

    <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('extractor_mining', 'gif')+ ')',
            width: '300px',
            height: '250px',
            marginLeft: 'calc(50% - 150px)',
            }"/>
  </div>
</template>

<script>
export default {
  name: "Mining"
}
</script>

<style scoped>

</style>
