<template>
  <section>
    <h3 class="headSection">Над игрой работали: </h3>
    <table class="table">
      <tr>
        <td> Concept Artist:</td>
        <td><a href="https://www.artstation.com/tripoltri">Константин Кеменов</a></td>
      </tr>
      <tr>
        <td> Сеттинг:</td>
        <td><a href="https://github.com/TrashPony">TrashPony</a></td>
      </tr>
      <tr>
        <td>Лор:</td>
        <td>Андрей Бабиченко</td>
      </tr>
      <tr>
        <td> Бэкенд/Фронтенд/UI/UX:</td>
        <td><a href="https://github.com/TrashPony">TrashPony</a></td>
      </tr>
      <tr>
        <td> Текст диалогов/заданий:</td>
        <td>Андрей Бабиченко</td>
      </tr>
      <tr>
        <td> Музыка:</td>
        <td>Антон Вильгоцкий</td>
      </tr>
      <tr>
        <td> Сюжет:</td>
        <td>-</td>
      </tr>
    </table>

    <h3 class="headSection">Используемые ресурсы: </h3>
    <table class="table">
      <tr>
        <td>Игровой движок:</td>
        <td><a href="https://phaser.io/phaser3">Phaser 3</a></td>
      </tr>
      <tr>
        <td>Иконки:</td>
        <td><a href="https://icons8.ru/license">icons8.ru</a></td>
      </tr>
      <tr>
        <td>Анимация щита:</td>
        <td><a href="https://www.shadertoy.com/view/XltGR2">www.shadertoy.com</a></td>
      </tr>
    </table>
  </section>
</template>

<script>
export default {
  name: "Authors"
}
</script>

<style scoped>
.headSection {
  color: #ffc588;
}

a {
  color: #0cfdff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: #ffc588;
}

@media (max-width: 650px) {
  .headSection {
    font-size: 13px;
  }
  .table {
    font-size: 10px;
  }
}
</style>
