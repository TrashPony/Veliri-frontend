<template>
  <section>
    <h3 class="headSection">Системные требования: </h3>
    <table class="system_requirements">
      <tr>
        <td colspan="2">1. Клавиатура, мышь</td>
      </tr>
      <tr>
        <td>2. Браузер:</td>
        <td>Google Chrome</td>
      </tr>
      <tr>
        <td colspan="2" style="color: orange">3. Поддерка апаратного ускания в браузере</td>
      </tr>
      <tr>
        <td>4. Разреншение экрана:</td>
        <td>не менее 1280 x 720</td>
      </tr>
    </table>
  </section>
</template>

<script>
export default {
  name: "NecessaryRequirements"
}
</script>

<style scoped>
.headSection {
  color: #ffc588;
}
@media (max-width: 650px) {
  .headSection {
    font-size: 13px;
  }
  .system_requirements {
    font-size: 10px;
  }
}
</style>
