<template>
  <div class="content_section">
    <h2 class="head">Автопилот</h2>
    <div class="content_section">
      <p>Автопилот - позволяет перемещатся между секторами и внутри сектора нажатием мышки до цели, однако в этом режиме
        нельзя использовать оружие и снаряжение из панели.</p>

      <p>Для активации/деактивации автопилота необходимо нажать кнопку на нижней панеле:</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + $parent.getUrlImg('auto_pilot', 'png')+ ')',
        width: '600px',
        height: '76px',
        marginLeft: 'calc(50% - 300px)',
        }"/>

      <p>Когда автопилот включен то кнопка будет гореть зеленым а на эккране будет оповещающая надпись "Autopilot"</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + $parent.getUrlImg('auto_pilot_2', 'png')+ ')',
        width: '600px',
        height: '140px',
        marginLeft: 'calc(50% - 300px)',
        }"/>

      <p>Что бы отправится в другой сектор надо отрыть карту мира, навести на нужный сектор и карта покажет маршрут по
        которому пойдет автопилот, после нажать на сектор и транспорт последует в сектор.</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + $parent.getUrlImg('auto_pilot_3', 'png')+ ')',
        width: '600px',
        height: '558px',
        marginLeft: 'calc(50% - 300px)',
        }"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "AutoPilot"
}
</script>

<style scoped>

</style>
