<template>
  <div class="content_section">
    <h2 class="head">Снаряжение</h2>

    <p> В корпус можно ставить различное снаряжение, снаряжение делится по уровлю мощьности и устанавливаются в
      соотвевующие слоты.</p>

    <p>Так же снаряжение делится на:</p>
    <ul>
      <li><span class="headSection">Пасивное</span> - не потребляет энергию накопиля и работет самостоятельно.</li>
      <li><span class="headSection">Активное без цели</span> - снаряжение не требует действий кроме активации,
        потребляет энергию за цикл или за действие.
      </li>
      <li><span class="headSection">Активно с целью</span> - снаряжение требует цель для активации, например добывающей
        лазер требует руду для добычи. Потребляет энергию за использование.
      </li>
    </ul>

    <p>Некоторому снаряжения необходимо устанавливатся снаружи корпуса, ячейки таких слотов помечены желтым цветом. В
      эти ячейки попрежнему можно установить внутрее снаряжение.</p>

    <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('equip_1', 'png')+ ')',
            width: '850px',
            height: '200px',
            marginLeft: 'calc(50% - 425px)',
            }"/>

    <h2 class="head">Активное снаряжение: </h2>
    <ul class="content_list" style="margin-top: 5px">
      <li>
        <h2 class="head">Щиты: </h2>
        <div class="content_section">

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_1', 'png')+ ')',
            width: '299px',
            height: '278px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('shield', 'gif')+ ')',
            width: '230px',
            height: '200px',
            float: 'right',
            marginLeft: '10px',
            }"/>

          <p>Щиты защищают обьекты которые находятся под ним, непропуская снаряды во внутрь.</p>
          <p>Характиристики щитов: </p>
          <ul>
            <li><span class="headSection">Макс. прочность</span> - hp щита.</li>
            <li><span class="headSection">Радиус щита</span> - зона покрытия щита.</li>
            <li><span class="headSection">Востановление прочности</span> - сколько будет востановлено хп за "Время
              такта" при условии что щит не был атакован.
            </li>
            <li><span class="headSection">Потребляемая энергия</span> - затраты энергии на востановление щита за 1 такт.
            </li>
            <li><span class="headSection">Потребляемая энергия в простое</span> - затраты энергии когда ненадо
              востанавливать щит за 1 такт.
            </li>
            <li><span class="headSection">Время такта</span> - время 1 такта щита, за это время щит востанавливается и
              потребляет энергию.
            </li>
            <li><span class="headSection">Время востановления после урона</span> - если щит получил урон то он не может
              востанавливатся это время.
            </li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
      <li>
        <h2 class="head">ПРО: </h2>

        <div class="content_section">

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_2', 'png')+ ')',
            width: '286px',
            height: '215px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('missile_defense', 'gif')+ ')',
            width: '200px',
            height: '150px',
            float: 'right',
            marginLeft: '10px',
            }"/>

          <p>Сбирают вражеские ракеты которые попадают в зону работы ПРО.</p>
          <p>Характиристики ПРО: </p>
          <ul>
            <li><span class="headSection">Радиус защиты</span> - радиус от источника на котором ПРО может перехватывать
              ракеты.
            </li>
            <li><span class="headSection">Потребляемая энергия за сбитие</span> - расход энергии на 1 сбитие ракеты.
            </li>
            <li><span class="headSection">Время перезарядки</span> - время востановления модуля после сбития ракеты.
            </li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
      <li>
        <h2 class="head">Дроны: </h2>
        <div class="content_section">

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_3', 'png')+ ')',
            width: '265px',
            height: '230px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('drone', 'gif')+ ')',
            width: '300px',
            height: '200px',
            float: 'right',
            marginLeft: '10px',
            }"/>

          <p>Управляемые летающие дроны, позволяют извлекать аномалии и атаковать врагов. Подробнее в разделе про
            аномалии.</p>
          <p>Характиристики дрона: </p>
          <ul>
            <li><span class="headSection">Дальность управления</span> - растояние на котором можно указать цель для
              дрона.
            </li>
            <li><span class="headSection">Радиус раскопок</span> - зона где будет произведены раскопки, если в этой зоне
              есть аномалия она будет раскрыта, так же все в этой зоне получат урон от взрыва.
            </li>
            <li><span class="headSection">Перезарядка дрона</span> - сколько требуется времени что бы дрон снова мог
              копать. Перезарядка дрона происходит только внутри корпуса.
            </li>
            <li><span class="headSection">Энергия для активации дрона</span> - энергия которая требуется для запуска
              дрона.
            </li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
      <li>
        <h2 class="head">Сканер: </h2>
        <div class="content_section">

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_4', 'png')+ ')',
            width: '320px',
            height: '214px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('scaner', 'png')+ ')',
            width: '111px',
            height: '124px',
            float: 'right',
            marginLeft: '10px',
            }"/>

          <p>Позволяет находить неоднородности земной поверхности. Подробнее в разделе про
            аномалии.</p>

          <p>Характиристики сканера: </p>
          <ul>
            <li><span class="headSection">Чувствительность датчика</span> - растояние на котором датчие может уловить
              сигнал об аномалии считается по пакой формуле "сила аномалии" + "чувствительно датчика", если растояние до
              аномалии меньше чем "чувствительно датчика" то сканер может определить тип аномалии.
            </li>
            <li><span class="headSection">Потребление энергии за сканирование</span></li>
            <li><span class="headSection">Перезарядка</span> - время за которое происходит 1 сканирование аномалий
              (обновляет данные на дисплее).
            </li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>

      <li>
        <h2 class="head">Инженерные модули: </h2>
        <p>Позволяет собирать и демонтировать сооружения, а так же демонтировать обломки</p>
        <div class="content_section" style="margin-left: 265px;">
          <div class="detailImg" :style="{
              backgroundImage: 'url(' + $parent.getUrlImg('build', 'gif')+ ')',
              width: '150px',
              height: '124px',
              float: 'left',
            }"/>
          <div class="detailImg" :style="{
              backgroundImage: 'url(' + $parent.getUrlImg('dismantling', 'gif')+ ')',
              width: '150px',
              height: '124px',
              float: 'left',
              marginLeft: '30px',
            }"/>
          <div class="detailImg" :style="{
              backgroundImage: 'url(' + $parent.getUrlImg('dismantling_unit', 'gif')+ ')',
              width: '150px',
              height: '124px',
              float: 'left',
              marginLeft: '30px',
            }"/>
        </div>

        <div class="content_section">
          <p>Характиристики инженерные модуля: </p>
          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_5', 'png')+ ')',
            width: '265px',
            height: '230px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <ul>
            <li><span class="headSection">Дальность</span> - дальность действия модуля.</li>
            <li><span class="headSection">Скорость перезарядки</span></li>
            <li><span class="headSection">Потребление энергии за такт</span></li>
            <li><span class="headSection">Влияние на прочность</span> - кол-во хп которое будет востановленно за 1 такт
              при строительстве или отнято при демонтаже.
            </li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
      <li>
        <h2 class="head">Рудные лазеры: </h2>
        <div class="content_section">

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_6', 'png')+ ')',
            width: '275px',
            height: '248px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('mining', 'gif')+ ')',
            width: '150px',
            height: '124px',
            float: 'right',
            marginLeft: '10px',
            }"/>

          <p>Позволяет разработывать месторождения полезных ископаемых.</p>
          <p>Характиристики рудных лазеров: </p>
          <ul>
            <li><span class="headSection">Объем добываемой руды</span> - обьем добываемой руды когда разработка
              месторождения доходит до 100%. Кол-во руды определяется по объему которое умещается в него.
            </li>
            <li><span class="headSection">Разработка руды за такт </span> - % на который разрабатывается месторождение
              за 1 такт работы лазера.
            </li>
            <li><span class="headSection">Дальность добычи </span></li>
            <li><span class="headSection">Скорость перезарядки </span></li>
            <li><span class="headSection">Потребление энергии за такт</span></li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
      <li>
        <h2 class="head">Ремонтные модули: </h2>
        <div class="content_section">

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_7', 'png')+ ')',
            width: '314px',
            height: '447px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_8', 'gif')+ ')',
            width: '150px',
            height: '124px',
            float: 'right',
            marginLeft: '10px',
            }"/>

          <p>Ремонтируют транспорты и сооружения, могуть быть как локальные/дистанционные. Дистанционные нельзя
            применить на себя а локальные на других.</p>
          <p>Характиристики ремонтных модулей: </p>
          <ul>
            <li><span class="headSection">Дальность ремонта</span></li>
            <li><span class="headSection">Время перезарядки</span></li>
            <li><span class="headSection">Потребляемая энергия</span></li>
            <li><span class="headSection">Кол-во востанавливаемой прочности</span></li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
      <li>
        <h2 class="head">Генераторы передачи энергии: </h2>
        <div class="content_section">

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_10', 'png')+ ')',
            width: '272px',
            height: '215px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_9', 'gif')+ ')',
            width: '200px',
            height: '190px',
            float: 'right',
            marginLeft: '10px',
            }"/>

          <p>Генератор на небольшом растояние передает энергию из транспорта союзным сооружениям.</p>

          <p>Характиристики генераторов: </p>
          <ul>
            <li><span class="headSection">Дальность передачи энергии</span></li>
            <li><span class="headSection">Передаваемая энергия за такт</span></li>
            <li><span class="headSection">Скорость перезарядки</span></li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
      <li>
        <h2 class="head">Генераторы помех: </h2>
        <div class="content_section">
          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_11', 'png')+ ')',
            width: '263px',
            height: '215px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <p>Выводит из строя радары в радиусе около источника. В этой области не будут показаны метки на радарах.</p>
          <p>Характиристики генераторов: </p>
          <ul>
            <li><span class="headSection">Радиус мемех</span></li>
            <li><span class="headSection">Потребляемая энергия за такт</span></li>
            <li><span class="headSection">Время работы такта</span></li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
      <li>
        <h2 class="head">Гравитационный колодец: </h2>
        <div class="content_section">
          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('gravity_square', 'gif')+ ')',
            width: '263px',
            height: '215px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <p>Гравитационный колодец притягивает все обьекты включая ракеты и балистические снаряды к источнику.</p>
          <p>Характиристики: </p>
          <ul>
            <li><span class="headSection">Радиус воздействия</span></li>
            <li><span class="headSection">Используемая энергия</span></li>
            <li>
              <span
                class="headSection">Сила притяжения</span> (сила у эпицентра, на границе радиуса эта сила стремится к 0)
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
      <li>
        <h2 class="head">Гравитационная пушка: </h2>
        <div class="content_section">
          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('gravity_gun', 'gif')+ ')',
            width: '263px',
            height: '215px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <p>Гравитационный пушка позволяет притягивать и отталкиваь предметы направленым воздействием. Помимо этого
            позволяет поймать ракету или балистический снаряд а потом запустить в обратную сторону.</p>
          <p>Характиристики: </p>
          <ul>
            <li><span class="headSection">Дальность воздействия</span></li>
            <li><span class="headSection">Используемая энергия</span></li>
            <li>
              <span
                class="headSection">Сила притяжения</span> (сила у эпицентра, на границе радиуса эта сила стремится к 0)
            </li>
            <li>
              <span
                class="headSection">Сила отталкивания</span> (сила у эпицентра, на границе радиуса эта сила стремится к 0)
            </li>
            <li><span class="headSection">Угол воздействия</span></li>
            <li><span class="headSection">Перезарядка после отталкивания</span> (пока идет перезарядка притяжение и оттаклкивание не работает)
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
    </ul>

    <h2 class="head">Пасивное снаряжение: </h2>
    <ul>
      <li>
        <h2 class="head">Улучшение брони: </h2>
        <div class="content_section">
          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_12', 'png')+ ')',
            width: '213px',
            height: '195px',
            float: 'right',
            marginLeft: '10px',
          }"/>
          <p>Пасивные модули улучшение брони, улучшают показать брони.</p>
          <p>Характиристики брони: </p>
          <ul>
            <li><span class="headSection">Броня</span> - на сколько % улучшает</li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
      <li>
        <h2 class="head">Регенерация: </h2>
        <div class="content_section">
          <div class="detailImg" :style="{
            backgroundImage: 'url(' + $parent.getUrlImg('wiki_equip_13', 'png')+ ')',
            width: '313px',
            height: '232px',
            float: 'right',
            marginLeft: '10px',
          }"/>

          <p>Пасивный модуль регенерации востанавливает хп без активации и потребления энергии.</p>
          <p>Характиристики Регенерация: </p>
          <ul>
            <li><span class="headSection">Дальность ремонта</span></li>
            <li><span class="headSection">Время перезарядки</span></li>
            <li><span class="headSection">Потребляемая энергия</span></li>
            <li><span class="headSection">Кол-во востанавливаемой прочности</span></li>
            <li><span class="headSection">Необходимо энергии</span> - сколько будет зарезервировано энергии в корпусе.
            </li>
            <li><span class="headSection">Занимаемый объем</span> - сколько места занимает 1 еденица в трюме.</li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Equip"
}
</script>

<style scoped>
.headSection.equip {

}
</style>
