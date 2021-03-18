<template>
  <div class="content_section">
    <h3 class="headSection">Телепорты</h3>
    <p>Для перемещения между секторами необходимо использовать телепорты.</p>

    <p>Телепорт представляет из себя строение или площадку. Если в такое строение или на площадку заехать то вы будете
      перенесены на одно из точеку выхода этого телепорта.</p>
    <div class="detailImg" :style="{
        backgroundImage: 'url(' + $parent.getUrlImg('teleport_1', 'png')+ ')',
        width: '595px',
        height: '294px',
        marginLeft: 'calc(50% - 294px)',
        }"/>

    <p>Выходы из телепорта выглядят вот так:</p>
    <div class="detailImg" :style="{
        backgroundImage: 'url(' + $parent.getUrlImg('teleport_2', 'png')+ ')',
        width: '595px',
        height: '202px',
        marginLeft: 'calc(50% - 294px)',
        }"/>

    <p>Телепорт может иметь несколько точек выхода, когда все точке выхода заняты то происходит выброс который
      отбрасывает все обьекты с телепорта.</p>

    <div class="detailImg" :style="{
        backgroundImage: 'url(' + $parent.getUrlImg('teleport_3', 'gif')+ ')',
        width: '340px',
        height: '230px',
        marginLeft: 'calc(50% - 170px)',
        }"/>

    <p>Обратите внимание на то что телепорты всегда работает в один конец, и если на другой стороне нет телепорта
      обратно то вы не сможете вернутся тем же путем. Для этого чаще сверяйтесь с картой на ней показаны все связи.</p>
  </div>
</template>

<script>
export default {
  name: "Teleports"
}
</script>

<style scoped>

</style>
