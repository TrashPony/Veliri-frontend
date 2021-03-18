<template>
  <section class="section">
    <p>Veliri - это игра про управление ресурсами, логистику и сражения. Выполняйте миссии, добывайте ресурсы или
      занимайтесь перевозками чтобы улучшить свою машину.
      Сражайтесь на поле боя чтобы принести победу своей фракции. Занимайтесь исследованиями и изучением мира чтобы
      разгадать главную загадку планеты.</p>

    <h2 class="head">Содержание</h2>
    <ul class="content_list">
      <li>
        <div class="content_button" @click="scrollTo('features')">Особенности</div>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('world')">Мир</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('sector')">Сектор</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('base')">База</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('defenders')">Защитники</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('Npc')">Боты</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('Structures')">Временные структуры</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('law')">Система правосудия</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('transport_and_equip')">Транспорт и снаряжение</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('bodies')">Корпуса</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('weapons')">Оружие</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('equips')">Снаряжение</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('battle')">Бой и управление</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('scouting')">Разведка</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('control')">Управление</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('ballistic')">Стрельба и баллистика</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('mining')">Добыча ресурсов</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('salvage')">Сбор обломков</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('anomaly')">Поиск аномалий</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('production')">Производство</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('processing')">Центр переработки</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('parts_production')">Создание деталей на заводе</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('blueprints')">Чертежи</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('craft_items')">Создание предметов на базе</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('property_management')">Управление имуществом</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('boxes')">Ящики</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('economy')">Экономика</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('market')">Рынок</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('build')">Строительство</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('map_blueprint')">Чертеж</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('install_and_dismantling')">Установка и демонтаж</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('structure_type')">Типы строений</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('special_cell')">Инвентарь и специльные ячейки</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('fraction')">Фракции</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('Replics')">Replics</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('Explores')">Explores</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('Reverses')">Reverses</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('aop')">АОП</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('fraction_war')">Фракционная война</div>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('mission')">Задания</div>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('skills')">Навыки персонажа</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('fine')">Штрафы</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('bonus')">Бонусы корпусов</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('social')">Социальность</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('clusters')">Кластеры</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('squad')">Отряды</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('chat')">Чат</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('friends')">Друзья</div>
          </li>
        </ul>
      </li>
      <li>
        <div class="content_button" @click="scrollTo('tech')">Технические данные игры</div>
        <ul class="content_list" style="margin-top: 5px">
          <li>
            <div class="content_button sub" @click="scrollTo('tech_justification')">Обоснование технологий</div>
          </li>
          <li>
            <div class="content_button sub" @click="scrollTo('genre_justification')">Обоснование жанра и сеттинга</div>
          </li>
        </ul>
      </li>
    </ul>

    <h2 class="head" id="features">Особенности</h2>
    <ul>
      <li style="margin-bottom: 10px"><span class="headSection">Живой мир</span> - даже если игроков не будет, игра
        будет играть сама в себя. Бойцы будут атаковать сектора, транспорты переводить ресурсы, строители будут строить
        структуры, охраники патрулировать и разведовать сигналы, а капуста продолжать расти.
      </li>
      <li style="margin-bottom: 10px"><span class="headSection">Опасный мир</span> - игрокам необходимо думать над
        логистикой, совершая ошибки они рискуют остаться без топлива и патронов в окружение врагов! Что приведет к
        уничтожению всего имущества которое у него есть с собой.
      </li>
      <li style="margin-bottom: 10px"><span class="headSection">Полная свобода действий</span> - игрок может добывать
        ресурсы, иследовать аномалии, воевать за сектора, выполнять миссии нападать на транспорты, грабить других
        игроков, заводить друзей и даже играть в политику.
      </li>
      <li style="margin-bottom: 10px"><span class="headSection">Бои</span> в реальном времени зависящие от способностей
        и толькое после этого снаряжения и умений персонажа.
      </li>
      <li style="margin-bottom: 10px"><span class="headSection">Экономика</span> полностью подчиняется действиям
        игроков. Все корпуса, снаряжения, боеприпасы и другие предметы создают только игроки. Добыча ресурсов,
        переработка и производство лежит на плечах игроков. Таким образом все предметы внутри игры это результат игры
        игроков и они сами назначают им цены.
      </li>
    </ul>

    <h2 class="head">Фичи:</h2>
    <ul>
      <li class="features">
        <p>полноценная non-target система</p>
      </li>
      <li class="features">
        <p>full loot</p>
      </li>
      <li class="features">
        <p>свободное пвп</p>
      </li>
      <li class="features">
        <p>свободная экономика</p>
      </li>
      <li class="features">
        <p>широкий спектр занятий в игре помимо войны:</p>
        <ul>
          <li>добыча/переработка ресурсов</li>
          <li>производство</li>
          <li>логистика</li>
          <li>поиск и изучение аномалий</li>
          <li>строительство</li>
          <li>развитие своего “кластера” (корпорации)</li>
        </ul>
      </li>
    </ul>

    <!--    <h3 class="headSection">В игре присутсвуют пвп и пве сессионные игры.</h3>-->
    <!--    <ul>-->
    <!--      <li>-->
    <!--        <p>пвп</p>-->
    <!--        <ul>-->
    <!--          <li>-->
    <!--            Встречный бой, 8vs8 на выбывание-->
    <!--          </li>-->
    <!--          <li>-->
    <!--            Командный бой, пвп 5vs5 до кол-ва фрагов-->
    <!--          </li>-->
    <!--          <li>-->
    <!--            Уничтожение базы, пвп 10vs10 до уничтожения базы врага-->
    <!--          </li>-->
    <!--        </ul>-->
    <!--      </li>-->
    <!--      <li>-->
    <!--        <p>пве</p>-->
    <!--        <ul>-->
    <!--          <li>-->
    <!--            Оборона, 4 игрока, необходимо продержатся и выжить-->
    <!--          </li>-->
    <!--          <li>-->
    <!--            Добыча, 4 игрока, необходимо сопроводить отряд, установить аванпост и добывать ресурсы-->
    <!--          </li>-->
    <!--          <li>-->
    <!--            Прорыв, 4 игрока, необходимо прорвать оборону врага и доставить ценную информацию-->
    <!--          </li>-->
    <!--        </ul>-->
    <!--      </li>-->
    <!--    </ul>-->

    <h2 class="head" id="world">Мир</h2>
    <div class="content_section">

      <p>Мир в игре представлен группой секторов. Поскольку планета, на которой происходят действия, является миром
        чрезвычайно сложным для выживания и имеет крайне мало возможностей по ней передвигаться, все локации, в которых
        есть возможность вести добычу ресурсов, постройку города-укрепления или исследования - соединены между собой
        телепортами. Данный способ перемещения между локациями позволяет безопаснее и быстрее перемещаться между
        локациями,
        по сравнению с обычным передвижением по земле. Ни один из тех, кто пытался своим ходом добраться из локации в
        локацию - не вернулся. </p>

      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('world_1', 'png')+ ')',
        width: '524px',
        height: '561px',
        marginLeft: 'calc(50% - 262px)',
        }"/>

    </div>

    <div class="content_section">
      <h3 class="headSection" id="sector">Сектор</h3>
      <p>Сектор - это безопасный участок планеты где передвигаются транспорты, воюют и добывают ресурсы.
        Большенство секторов имеют внутри себя инфраструктуру из баз, заводов и тд.</p>

      <p>Сектора делятся на 3 основных типа:</p>
      <ul>
        <li>Безопасные сектора - тут нет войны и стражи следят за порядком около баз.</li>
        <li>Боевые сектора - это спортные территории на который идет война между фракциями</li>
        <li>Свободная территория - в этих секторах нету баз и много опасносней, но зато тут нетронутые ресурсы и
          различные аномалии
        </li>
      </ul>

      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('sector_1', 'jpg')+ ')',
        width: '560px',
        height: '561px',
        marginLeft: 'calc(50% - 280px)',
        }"/>
    </div>

    <div class="content_section">

      <h3 class="headSection" id="base">База</h3>
      <p>База - центральный технический узел сектора.
        Фракция владеющая базой владеет всей инфраструктурой сектора.
        На базах можно производить различное оборудование, оружие, корпуса и тд.
        Базы могут выдавать различные задания. На базах можно торговать, так же база позволяет хранить имущество на
        своем складе.
        Пока игроки находятся на базе им ничего не угрожает, но на вражеской и нерабочей базе доступен только склад и
        ангар с ограниченными возможностями.</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('base_1', 'png')+ ')',
        width: '600px',
        height: '200px',
        marginLeft: 'calc(50% - 300px)',
        }"/>

      <p>Перерабатывающий завод - сооружения которое позволяет перерабатывать полезные ископаемые в сырье для
        производства. Помимо переработки позволяет так же разбирать различие предметы на состовляющие компоненты.
        Перерабатывающий завод, взымает за свои услуги налог. Так же предоставляет склад и рынок.</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('base_2', 'png')+ ')',
        width: '200px',
        height: '200px',
        marginLeft: 'calc(50% - 100px)',
        }"/>

      <p>Завод полуфабрикатов - сооружения которое позволяет создавать детали из сырья за 2х кратный налог на
        компоненты. Так же предоставляет склад и рынок.</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('base_3', 'png')+ ')',
        width: '200px',
        height: '200px',
        marginLeft: 'calc(50% - 100px)',
        }"/>
    </div>

    <div class="content_section">
      <h3 class="headSection" id="defenders">Защитники</h3>
      <p>Около некоторых баз можно встретить защитников. Защитник - это особый фракционный дрон который обороняет
        территорию вокруг базы. Следит что бы никто не нарушал закон и эвакуирует транспорты по запросу в пределах базы.
        Имеет колосальную огневую мощь и почти неуязвим для обычных транспортов. Однако не могут действовать за
        пределами влияния базы.</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('defenders_1', 'png')+ ')',
        width: '420px',
        height: '150px',
        marginLeft: 'calc(50% - 210px)',
        }"/>
    </div>

    <div class="content_section">
      <h3 class="headSection" id="Npc">Боты</h3>
      <p>Помимо других игроков в игре присутствуют боты, каждый бот является неотъемлемым участником событий.
        Они добывают ресурсы, охраняют территории, нападают на сектора, перевозят ресурсы.</p>

      <p>Иногда из за границ карты могут нападать бойцы “планетарной обороны” неразумные машины. Не кто точно не знает
        почему она активировалась сейчас, но по всей видимости эти роботы подчиняются неразумной системе которая
        находится где то на планете. Однако они очень глупы и имеют устаревшее слабое вооружение. Поэтому они могут
        представлять угрозу только в больших группах.</p>

      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('npc_2', 'png')+ ')',
        width: '200px',
        height: '150px',
        marginLeft: 'calc(50% - 100px)',
        }"/>
    </div>

    <div class="content_section">
      <h3 class="headSection" id="Structures">Временные структуры</h3>
      <p>Иногда в секторе можно встретить сооружения которые возвели боты или другие игроки, эти сооружения разрушаемы и
        выполняют различные функции, например турели - стрелять во врагов, щиты - защищают от атак, добывающие установки
        - добывают ресурсы. Подробнее о строительстве смотрите посвященный этому раздел.</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('structures_1', 'png')+ ')',
        width: '300px',
        height: '100px',
        marginLeft: 'calc(50% - 150px)',
        }"/>
    </div>

    <div class="content_section">
      <h3 class="headSection" id="law">Система правосудия</h3>
      <p>Система правосудия позволяет сохранять безопасность около баз и столиц, если игрок нападает на союзного игрока
        или его имущество то он входит в режим Нарушителя, если игрок уничтожает имущество или убивает союзеного игрока
        то он входит в режим ПК</p>
      <p>Игрока в режиме нарушитель могут атаковать другие игроки без штрафа, на безопасной территории защитники будут
        замораживать нарушителей пока режим не спадет.</p>
      <p>Игрока в режиме PK могут атаковать другие игроки без штрафа, так же его будут атаковать защитники, турели и
        боты.</p>
    </div>

    <h2 class="head" id="transport_and_equip">Транспорт и снаряжение</h2>
    <div class="content_section">
      <p>Транспорт - это машина на которой передвигается игрок во внемнем мире. Транспорт обычно состоит из корпуса,
        оружия и различного снаряжения.</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('transport_1', 'png')+ ')',
        width: '388px',
        height: '260px',
        marginLeft: 'calc(50% - 194px)',
        }"/>
      <p>Для передвижения и подзарядке аккумуляторов транспорту необходимо иметь топиво. В роли топлива выступает
        обогащенный торий. Энергия накопленная в аккумуляторах тратиться на использования снаряжения. </p>
      <p>Корпуса могут иметь от 1 до 3х ячеек топлива, если не все ячейки заполнены это будет влиять на ходовые
        характиристики транспорта.</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('transport_2', 'png')+ ')',
        width: '230px',
        height: '170px',
        marginLeft: 'calc(50% - 115px)',
        }"/>
    </div>

    <div class="content_section">
      <h3 class="headSection" id="bodies">Корпуса</h3>
      <p>Корпус - основа транспорта, он определяет ходовые/защитные характиристики транспорта, кол-во слотов под
        снаряжения и размер оружия. </p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('bodies_1', 'png')+ ')',
        width: '230px',
        height: '170px',
        marginLeft: 'calc(50% - 115px)',
        }"/>
    </div>

    <div class="content_section">
      <h3 class="headSection" id="weapons">Оружие</h3>
      <p>Оружие в игре делится на 3 основных типа, в каждое оружие необходимо заряжать боеприпас который будет
        регулировать итоговые характеристики, если боеприпас кончился то оружие стрелять не будет.</p>
      <div class="detailImg" :style="{
        backgroundImage: 'url(' + getUrlImg('weapon_1', 'png')+ ')',
        width: '520px',
        height: '318px',
        marginLeft: 'calc(50% - 260px)',
        }"/>

      <br>

      <ul class="content_list" style="margin-top: 5px">
        <li><span class="headSection" style="font-size: 10px">Ракетное вооружение</span>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('weapon_2', 'png')+ ')',
            width: '380px',
            height: '180px',
            marginLeft: 'calc(50% - 190px)',
            }"/>

          <p>Ракетное вооружение, отличается фиксированной скорость полета пули, высоким уроном и точностью (для
            некоторый ракет управляемостью), однако против него можно применить ПРО который будет сбивать их на подлете,
            а скорость ракет не отличается быстротой.</p>
          <p>Ракеты имеют также фиксированную дистанцию полета после чего они взрываются даже если не столкнулись с
            целью.</p>
          <p>Еще одной особенностью ракет является то что летящие ракеты отображаются на радаре как летящие объекты.</p>
        </li>

        <li><span class="headSection" style="font-size: 10px">Лазерное вооружение</span>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('weapon_3', 'png')+ ')',
            width: '380px',
            height: '180px',
            marginLeft: 'calc(50% - 190px)',
            }"/>

          <p>Лазерное оружие отличается мгновенной скоростью поражения цели, но стрелять "навесом" из него не
            выйдет.</p>
          <p>Имеет фиксированную дальность поражения.</p>
        </li>

        <li><span class="headSection" style="font-size: 10px">Огнестрельное вооружение</span>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('weapon_4', 'png')+ ')',
            width: '380px',
            height: '200px',
            marginLeft: 'calc(50% - 190px)',
            }"/>

          <p>Огнестрельное оружие имеет баллистическую траекторию из за чего обладает не фиксированной дальностью атаки,
            можно стрелять навесом стреляя через препятствия.</p>
          <p>Боеприпасы огнестрельного оружия имеют начальную скорость но само оружие может влиять на нее. Дальность
            атаки рассчитывается из параметров оружия и боеприпаса.</p>
        </li>
      </ul>
    </div>

    <div class="content_section">
      <h3 class="headSection" id="equips">Снаряжение</h3>
      <p> В корпус можно ставить различное снаряжение, снаряжение делится по уровлю мощьности и устанавливаются в
        соотвевующие слоты. В зависимости от своей специфики, оборудование, может быть: добывающее, оборонительное, или
        даже работающее в качестве средств нападения.</p>

      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('equip_1', 'png')+ ')',
            width: '850px',
            height: '200px',
            marginLeft: 'calc(50% - 425px)',
            }"/>

      <ul class="content_list" style="margin-top: 5px">
        <li>
          <span class="headSection" style="font-size: 10px">Щиты</span>
          <p>Щиты защищают обьекты которые находятся под ним, непропуская снаряды во внутрь.</p>

          <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('shield', 'gif')+ ')',
            width: '230px',
            height: '200px',
            marginLeft: 'calc(50% - 115px)',
            }"/>
        </li>
        <li>
          <span class="headSection" style="font-size: 10px">ПРО</span>
          <p>Сбирают вражеские ракеты которые попадают в зону работы ПРО.</p>
          <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('missile_defense', 'gif')+ ')',
            width: '200px',
            height: '150px',
            marginLeft: 'calc(50% - 100px)',
            }"/>
        </li>
        <li>
          <span class="headSection" style="font-size: 10px">Дроны</span>
          <p>Управляемые летающие дроны, позволяют извлекать аномалии и атаковать врагов. Подробнее в разделе про
            аномалии.</p>
          <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('drone', 'gif')+ ')',
            width: '300px',
            height: '200px',
            marginLeft: 'calc(50% - 150px)',
            }"/>
        </li>
        <li>
          <span class="headSection" style="font-size: 10px">Сканер</span>
          <p>Позволяет находить неоднородности земной поверхности. Подробнее в разделе про
            аномалии.</p>
          <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('scaner', 'png')+ ')',
            width: '111px',
            height: '124px',
            marginLeft: 'calc(50% - 55px)',
            }"/>
        </li>

        <li>
          <span class="headSection" style="font-size: 10px">Инженерные модули</span>
          <p>Позволяет собирать и демонтировать сооружения, а так же демонтировать обломки</p>
          <div class="content_section" style="margin-left: 265px;">
            <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('build', 'gif')+ ')',
              width: '150px',
              height: '124px',
              float: 'left',
            }"/>
            <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('dismantling', 'gif')+ ')',
              width: '150px',
              height: '124px',
              float: 'left',
              marginLeft: '30px',
            }"/>
            <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('dismantling_unit', 'gif')+ ')',
              width: '150px',
              height: '124px',
              float: 'left',
              marginLeft: '30px',
            }"/>
          </div>
        </li>
        <li>
          <span class="headSection" style="font-size: 10px">Рудные лазеры</span>
          <p>Позволяет разработывать месторождения полезных ископаемых.</p>
          <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('mining', 'gif')+ ')',
            width: '150px',
            height: '124px',
            marginLeft: 'calc(50% - 75px)',
            }"/>
        </li>
        <li>
          <span class="headSection" style="font-size: 10px">Ремонтные модули</span>
          <p>Ремонтируют транспорты и сооружения, могуть быть как пасивные/активные, локальные/дистанционные.</p>
        </li>
        <li>
          <span class="headSection" style="font-size: 10px">Генераторы передачи энергии</span>
          <p>Генератор на небольшом растояние передает энергию союзным сооружениям.</p>
        </li>
        <li>
          <span class="headSection" style="font-size: 10px">Генераторы помех</span>
          <p>Выводит из строя радары в радиусе около источника. В этой области не будут показаны метки на радарах.</p>
        </li>
      </ul>
    </div>

    <h2 class="head" id="battle">Бой и управление</h2>
    <p>Бой - неотъемлемая часть игрового процесса. Будь то нападение на сборщика ресурсов, или защита от кровожадных
      пиратов - в помощь игроку предоставлен широкий выбор разных типов вооружения, защитных устройств, о них можно
      прочитать в разделе "Транспорт и снаряжение". Если ваш транспорт уничтожают то ваше сознание переностся на ту базу
      которую вы посещали последней, а транспорт и содержимое трюма пропадает или остается в обломках.</p>

    <div class="content_section" style="margin-left: 235px;">
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('battle_1', 'gif')+ ')',
              width: '300px',
              height: '200px',
              float: 'left',
            }"/>
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('battle_2', 'gif')+ ')',
              width: '300px',
              height: '200px',
              float: 'left',
              marginLeft: '50px',
              backgroundPosition: 'center',
            }"/>
    </div>

    <p>При смерти транспорта срабатывает аварийный маяк, он испускает широковещательный сигнал который видят все боты и
      игроки на мини карте. Боты охраники сразу же идут на разведку территории по этим координатам.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('battle_3', 'gif')+ ')',
            width: '183px',
            height: '200px',
            marginLeft: 'calc(50% - 92px)',
            }"/>

    <h3 class="headSection" id="scouting">Разведка</h3>
    <p>Большую часть обзора в игровом мире закрывает туман войны, но через него можно смотреть с помощью радара. Радар
      показывает метки по типу объекта, но это единственная информация которая доступна через радар. Некоторые обьекты
      окружения и статичные структуры запоминаются и вы видите их состояние на момент когда перестали их видеть.</p>

    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('scouting_1', 'png')+ ')',
            width: '450px',
            height: '325px',
            marginLeft: 'calc(50% - 225px)',
            }"/>

    <p>Вот такие метки позволяет видеть радар: </p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('scouting_2', 'png')+ ')',
            width: '450px',
            height: '160px',
            marginLeft: 'calc(50% - 225px)',
            }"/>

    <p>Эти метки показывает и миникарта, желтыми кругами показаны летящие снарды. </p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('minimap', 'gif')+ ')',
            width: '370px',
            height: '230px',
            marginLeft: 'calc(50% - 185px)',
            backgroundPosition: 'bottom',
            }"/>

    <h3 class="headSection" id="control">Управление</h3>
    <p>Управлением транспорта в игре осуществляется с помощью клавиш WASD. Выбор цели для оружия и снаряжения которым
      нужна цель происходит с помощью мыши, но для этого сначало необходимо выбрать оружие или снаряжение через "панель
      снаряжения". </p>
    <p>Расположить оружие или необходимое снаряжение можно перетащив его из панели ангара на панель
      снаряжения в нужную ячейку. Таким же образом можно перетащить предметы из трюма, что бы смотреть их
      количество например. </p>
    <p>Что бы убрать ячейку из панелди снаряжения надо выделить ячейку и "выбросить" ее за пределы
      панели, а если переложить в другую ячейку то предмет переместится в нее или поменяется местами если она не
      пустая.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('control_1', 'gif')+ ')',
            width: '443px',
            height: '296px',
            marginLeft: 'calc(50% - 221px)',
            }"/>
    <p>Фон указывает на тип обьекта расположеного в ячейке.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('control_3', 'png')+ ')',
            width: '400px',
            height: '271px',
            marginLeft: 'calc(50% - 200px)',
            }"/>

    <p>"Панель снаряжения" во внешнем мире выглядит вот так</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('control_2', 'png')+ ')',
            width: '443px',
            height: '46px',
            marginLeft: 'calc(50% - 221px)',
            }"/>
    <p>Манипулятор в 1 ячейке внешнего мира позволяет взаимодействовать с обьектами. Открывать ящики, меню сооружений
      можно только через него. Еще выбраный манипулятор показывает всплыващие подсказки на некоторых обьектах, ресурсах
      и тд.</p>

    <h3 class="headSection" id="ballistic">Стрельба и баллистика</h3>
    <p>Когда на "панеле снаряжения" выбрано оружие, оно начнет поварачиватся в сторону курсора мыши, появится прицел
      показывающий примерную зону поражения. Чем меньше точность и дальше цель тем зона поражения будет больше.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('control_4', 'gif')+ ')',
            width: '400px',
            height: '265px',
            marginLeft: 'calc(50% - 200px)',
            }"/>
    <p>Когда вы нажмете на левую кнопку мышки то оружие произведет выстрел. Отлетающие цифры покажут сколько и кто
      получил урона
      урона. Если боеприпас имеет урон по площади то урон получат все в зоне поражения.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('control_5', 'gif')+ ')',
            width: '400px',
            height: '265px',
            marginLeft: 'calc(50% - 200px)',
            }"/>
    <p>Все обьекты в игре имеют высоту, на карте есть ямы и подъемы, а некотрые снаряды имеют балистическую траекторию
      полета. Если при прицеливание траектория снаряда будет встречать на пути препятвие то он будет "прилипать" к
      нему.</p>

    <div class="content_section" style="margin-left: 235px;">
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('control_6', 'gif')+ ')',
              width: '200px',
              height: '150px',
              float: 'left',
            }"/>
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('control_7', 'gif')+ ')',
              width: '200px',
              height: '150px',
              float: 'left',
              marginLeft: '50px',
              backgroundPosition: 'center',
            }"/>
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('control_8', 'gif')+ ')',
              width: '200px',
              height: '150px',
              float: 'left',
              marginLeft: '50px',
              backgroundPosition: 'center',
            }"/>
    </div>

    <h2 class="head" id="mining">Добыча ресурсов</h2>

    <p>Руда это основной источник ресурсов в игре. Руда необходима для переплавки на сырье из которого можно производить
      снаряжение, сооружения, корпуса и снаряды.</p>
    <p>На текущий момент в игре 5 вид руд и сырьевых компонентов.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('mining_1', 'png')+ ')',
            width: '400px',
            height: '140px',
            marginLeft: 'calc(50% - 200px)',
            }"/>

    <p>Залежи руды образуется в игровом мире случайно и добывать ее может каждый у кого есть необходимое снаряжение.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('mining_2', 'png')+ ')',
            width: '400px',
            height: '167px',
            marginLeft: 'calc(50% - 200px)',
            }"/>
    <p>Добыча ресурсов происходит так:</p>
    <ul>
      <li>Находите месторождение руды.</li>
      <li>Выбераете снаряжение для добычи.</li>
      <li>Нажимаете левую кнопку мыши на месторождение руды.</li>
      <li>Ждете когда заполнится шкала разработается месторождение.</li>
    </ul>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('mining_3', 'gif')+ ')',
            width: '300px',
            height: '185px',
            marginLeft: 'calc(50% - 150px)',
            }"/>

    <h3 class="headSection" id="salvage">Сбор обломков</h3>
    <p>После смерти транспорта на земле остается груда обломков в них могут остаться снаряжение или содержимое
      инвентаря. C помощью инженерного модуля можно извлекать из останков детали.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('dismantling_unit_1', 'gif')+ ')',
            width: '300px',
            height: '185px',
            marginLeft: 'calc(50% - 150px)',
            }"/>

    <h3 class="headSection" id="anomaly">Поиск аномалий</h3>
    <p>С помощью сканера можно улавливать различные сигналы вокруг сканера.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('scanner_1', 'gif')+ ')',
            width: '300px',
            height: '175px',
            marginLeft: 'calc(50% - 150px)',
            }"/>

    <p>Если в зоне аномалии провести раскопки то можно обнаружить, что то интересно например ящики с
      чертежами/ресурсами, залежи ресурсов или даже древнии артефакты, но скорее всего это будет просто мусор
      ¯\_(ツ)_/¯.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('scanner_2', 'gif')+ ')',
            width: '300px',
            height: '265px',
            marginLeft: 'calc(50% - 150px)',
            }"/>

    <h2 class="head" id="production">Производство</h2>
    <h3 class="headSection" id="processing">Центр переработки</h3>
    <p>После того как удалось добыть полезные ископаемые их необходимо переработать в сырье. Для этого необходимо
      приехать на базу переработчик. При переработке взимается налог базы, а также теряется какое то количество ресурсов
      из за плохого навыка.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('processing_1', 'jpg')+ ')',
            width: '660px',
            height: '305px',
            marginLeft: 'calc(50% - 330px)',
            }"/>

    <h3 class="headSection" id="parts_production">Создание деталей на заводе</h3>
    <p>На заводе полуфабрикатов можно изготовить детали из сырья, однако база будет брать 200% ресурсов за создание
      нежели эти же детали делать с помощью чертежа на главной базе сектора.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('parts_production_1', 'png')+ ')',
            width: '608px',
            height: '304px',
            marginLeft: 'calc(50% - 304px)',
            }"/>

    <h3 class="headSection" id="blueprints">Чертежи</h3>
    <p>Чертежи возволяют создавать предметы/строения при наличии необходимых ресурсов.</p>
    <p>Чертежи делятся на 2 типа:</p>
    <ul>
      <li><p>Чертежи для предметов имеют синий цвет и их можно производить на базе.</p></li>
      <li><p>Чертежи для зданий имеют красный цвет и строятся они вне баз, подробнее в разделе строительства.</p></li>
    </ul>
    <p>Необходимые ресурсы, детали, а так же прозводимую продукцию можно посмотреть в карточке чертежа
      (инвентарь->подробно) во вкладке "Производство"</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('blueprint', 'png')+ ')',
            width: '320px',
            height: '459px',
            marginLeft: 'calc(50% - 160px)',
            }"/>

    <h3 class="headSection" id="craft_items">Создание предметов на базе</h3>
    <p>На главной базе сектора можно создавать различные предметы при наличие чертежа и ресурсов для него. База может
      взымать налог на создание из расчета своей эффективности.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('craft_items_1', 'png')+ ')',
            width: '487px',
            height: '266px',
            marginLeft: 'calc(50% - 243px)',
            }"/>

    <h2 class="head" id="property_management">Управление имуществом</h2>
    <p>Все имущество в игре всегда имеет определенную точку в пространстве, каждый предмет занимает объем. Это
      означает что вам необходимо думать о том где хранить свои предметы, заниматься логистикой и просчитывать
      безопасные маршруты, а пиратом думать где катаются самые вкусные транспорты С:</p>

    <p>На базе у каждого игрока есть свой склад с неограниченным объемом хранения предметов, а корпуса имеют разные
      размер трюма.</p>

    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('property_management_1', 'png')+ ')',
            width: '468px',
            height: '186px',
            marginLeft: 'calc(50% - 234px)',
            }"/>

    <h3 class="headSection" id="boxes">Ящики</h3>
    <p>Помимо склада и трюма на карте можно устанавливать ящики. Ящики различаются кол-вом хп, объемом хранения и
      делятся на 3 основных типа:</p>
    <ul>
      <li>
        <p>Обычный контейнер, не обладает какими либо особыми свойствами. Но зато его можно толкать :).</p>
        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('box_1', 'gif')+ ')',
            width: '250px',
            height: '200px',
            marginLeft: 'calc(50% - 125px)',
            }"/>
      </li>
      <li>
        <p>Подземный ящик, его нельзя толкать т.к. он находится под землей.</p>
        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('box_2', 'gif')+ ')',
            width: '400px',
            height: '200px',
            marginLeft: 'calc(50% - 200px)',
            }"/>
      </li>
      <li>
        <p>Ящик защищенный паролем, только игроки которые знают пароль могут получить доступ в ящику.</p>
        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('box_3', 'gif')+ ')',
            width: '320px',
            height: '200px',
            marginLeft: 'calc(50% - 160px)',
            }"/>
      </li>
    </ul>

    <p>Если ящик был уничтожен то все его содержимое теряется.</p>

    <h2 class="head" id="economy">Экономика</h2>

    <p>Экономика в игре полностью подчиняется действиям игроков, любой предмет который может находится в трюме или на
      складе можно выкинуть или продать.</p>
    <p>Игроки могут обмениватся товарами используя для этого ящики или обьекты, но это не безопасно поэтому лучше
      использовать рынок на базе. Однако рынок будет взывать средства на содержания лота.</p>

    <h3 class="headSection" id="market">Рынок</h3>
    <p>Рынок имеет биржевую систему, а заказы закреплены за базами, то есть купив что либо оно будет помещено на склад
      базы где размещен заказ.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('market_2', 'png')+ ')',
            width: '808px',
            height: '297px',
            marginLeft: 'calc(50% - 404px)',
            }"/>

    <p>Продать предметы на рынке можно из меню склада или сразу через меню рынка посмотрев лоты на покупку.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('market_1', 'png')+ ')',
            width: '464px',
            height: '271px',
            marginLeft: 'calc(50% - 232px)',
            }"/>

    <h2 class="head" id="build">Строительство</h2>
    <p>На глобальной карте можно устанавливать временные сооружения для охраны, разведки и добычи ресурсов.</p>
    <div class="content_section" style="margin-left: 235px;">
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('build_1', 'gif')+ ')',
              width: '250px',
              height: '200px',
              float: 'left',
            }"/>
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('build_2', 'gif')+ ')',
              width: '250px',
              height: '200px',
              float: 'left',
              marginLeft: '50px',
              backgroundPosition: 'center',
            }"/>
    </div>

    <h3 class="headSection" id="map_blueprint">Чертеж</h3>
    <p> Для установки сооружения необходимо в трюме транспорта иметь особый чертеж "прошивка". Он выглядит как обычный
      но красного цвета. Если строение демонтировать то этот чертеж вернется в трюм. Так же необходимо иметь все ресурсы
      которые указаны во вкладке "Произ-во".</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('build_3', 'png')+ ')',
              width: '247px',
              height: '350px',
            marginLeft: 'calc(50% - 123px)',
            }"/>

    <h3 class="headSection" id="install_and_dismantling">Установка и демонтаж</h3>
    <p>При наличие необходимых компонентов процест установки сооружения выглядит так:</p>
    <ul>
      <li>Выбераете на "панеле снаряжения" инженерный модуль.</li>
      <li>Выбераете режим модуля "строительство". Это откроект меню строительства, где будут показаны доступные
        сооружения.
      </li>
      <li>Выбераете в меню сооружение которые хотите установить.</li>
      <li>Выбераете место куда хотите установить сооружение.</li>
      <li>После нажатия левой клавиши из трюма пропадет чертеж и сооружение установится на карте с 0% завершения.</li>
      <li>Инженерным модулем фокусите строение и нажимаете левую кнопку мыши, за каждую итерацию будет завершатся
        какойто % строительства и отниматся ресурсы сопостовимые этому проценту.
      </li>
    </ul>
    <p>Для демонтажа:</p>
    <ul>
      <li>Выбераете режим модуля "демонтаж"</li>
      <li>После нажатия левой клавиши на обьект за каждую итерацию будет уменьшатся параметр завершенности на
        % и возвращатся ресурсы сопостовимые этому проценту.
      </li>
      <li>Сооружение которое уже было полностью построено еще может функционировать при 50% завершенности.</li>
      <li>Когда % завершенности доходит до 0% обьект пропадает а в трюм возвращается чертеж.</li>
    </ul>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('build_4', 'gif')+ ')',
            width: '335px',
            height: '317px',
            marginLeft: 'calc(50% - 167px)',
            }"/>

    <h3 class="headSection" id="structure_type">Типы строений</h3>
    <p>Сооружения служат разным целям от складов до турелей.</p>
    <ul>
      <li class="imageLi" style="">

        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('turrents', 'png')+ ')',
            width: '200px',
            height: '75px',
            float: 'left',
            marginRight: '10px',
            }"/>

        <p>Турели - атакуют врагов находящиеся в радиусе атаки, очень не любят кусты поэтому отстреливают их при
          возможности ¯\_(ツ)_/¯.</p>
      </li>

      <li class="imageLi">

        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('shield', 'png')+ ')',
            width: '75px',
            height: '75px',
            float: 'left',
            }"/>

        <p>Щиты - не пропускают снаряды внутрь, но зато выпускает их из под себя.</p>
        <p>Для работы необходимо питание.</p>
      </li>

      <li class="imageLi">

        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('radar', 'png')+ ')',
            width: '75px',
            height: '75px',
            float: 'left',
            }"/>

        <p>Радар - расширяет радар транспорта, показывает все что попадает в радиус радара.</p>
        <p>Для работы необходимо питание.</p>
      </li>

      <li class="imageLi">

        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('jammer', 'png')+ ')',
            width: '75px',
            height: '75px',
            float: 'left',
            }"/>

        <p>Генератор помех - делает в области помех бесполезным радар, но не только вражеский а вообще.</p>
        <p>Для работы необходимо питание.</p>
      </li>

      <li class="imageLi">

        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('missile_defense', 'png')+ ')',
            width: '75px',
            height: '75px',
            float: 'left',
            }"/>

        <p>ПРО - сбивает вражеские ракеты на подлете.</p>
        <p>Для работы необходимо питание.</p>
      </li>

      <li class="imageLi">

        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('storage', 'png')+ ')',
            width: '75px',
            height: '75px',
            float: 'left',
            }"/>

        <p>Склад - как ящик, только склад ¯\_(ツ)_/¯.</p>
      </li>

      <li class="imageLi">

        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('energy_generator', 'png')+ ')',
            width: '75px',
            height: '75px',
            float: 'left',
            }"/>

        <p>Генератор - имеет расширеную топливную ячейку и способен самостоятельно питать все строения в радиусе
          действия.</p>

        <p>Для работы необходимо питание, которое он будет раздавать.</p>
      </li>

      <li class="imageLi">

        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('extractor', 'png')+ ')',
            width: '75px',
            height: '75px',
            float: 'left',
            }"/>

        <p>Добывающее строение - строится на минерале и добывает ресурсы в автоматическом режиме, что бы строение
          работало ему ноеобходимо иметь ящик, транспорт или строение с инвентарем в точке сброса (красный/зеленый
          квадратик у здания).</p>

        <p>Для работы необходимо питание, которое он будет потреблять в каждом цикле добычи.</p>
      </li>
    </ul>

    <h3 class="headSection" id="special_cell">Инвентарь и специльные ячейки</h3>
    <p>Некоторые структуры имеют внутри себя инвентарь и специальные ячейки для топлива и
      заданий.</p>

    <p>Некоторые структуры не могут работать без топлива поэтому им необходимо после установки устанавливать в
      ячейку топливо или что бы был рядом генератор с топливом или союзный транспорт с дистанционной передачей
      энергии.</p>

    <p>Для взаимодействия со структурой нужно быть ее владельцем и находясь рядом нажать на нее манипулятором.</p>
    <div class="content_section" style="margin-left: 200px;">
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('open_object_1', 'gif')+ ')',
              width: '286px',
              height: '200px',
              float: 'left',
            }"/>
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('open_object_2', 'gif')+ ')',
              width: '286px',
              height: '200px',
              float: 'left',
              marginLeft: '50px'
            }"/>
    </div>
    <h2 class="head" id="fraction">Фракции</h2>
    <p>На планете идет война между Replics, Explores, Reverses за ресурсы и территорию, игроки могут безнаказано
      убивать игроков других фракций и захватывать сектора.</p>

    <p>Так же есть игроки в режиме "ПК" и 4я неразумная фракция "автоматизированая оборона планеты" (АОП) оставшаяся от
      некогда живших на планете разумных существ, которые воюют против всех</p>

    <h3 class="headSection" id="Replics">Replics</h3>

    <div class="content_section" style="margin-left: 345px;">
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('Replics', 'png')+ ')',
              width: '150px',
              height: '150px',
              float: 'left',
            }"/>
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('replics_logo_min', 'png')+ ')',
              width: '150px',
              height: '150px',
              float: 'left',
              marginLeft: '50px'
            }"/>
    </div>

    <p>Replics - Ав­то­кра­ти­че­ской фор­мы прав­ле­ния ИИ. От­го­ло­сок ярост­но­го экс­пан­си­о­низ­ма
      “по­кро­ви­те­лей” и при­вер­жен­ца тео­рии “вой­ны за не­за­ви­си­мость с со­з­да­те­ля­ми”. Пред­по­чи­та­ю­щий
      под­чи­нять тер­ри­то­рии и ас­си­ми­ли­ро­вать дру­гие тех­ни­че­ские фор­мы жиз­ни си­лой.</p>

    <p>Replics управ­ля­ет об­шир­ной се­тью ли­шён­ных са­мо­у­прав­ле­ния бо­тов. Но ино­г­да, санк­ци­о­ни­руя
      со­з­да­ние се­рии ав­то­ном­ных еди­ниц, ра­ди рас­ши­ре­ния сфер соб­ствен­но­го вли­я­ния.</p>

    <p>Ес­ли у Replics по­ми­мо гос­под­ства и рас­про­стра­не­ния, бы­ва­ют иные по­во­ды для ин­те­ре­са, то это
      только: ав­то­ма­ти­за­ция ин­фра­струк­ту­ры, бес­ко­неч­ное про­из­вод­ство и пол­ные ма­те­ри­а­лов
      скла­ды.</p>
    <h3 class="headSection" id="Explores">Explores</h3>
    <div class="content_section" style="margin-left: 345px;">
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('Explores', 'png')+ ')',
              width: '150px',
              height: '150px',
              float: 'left',
            }"/>
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('explores_logo_min', 'png')+ ')',
              width: '150px',
              height: '150px',
              float: 'left',
              marginLeft: '50px'
            }"/>
    </div>
    <p>Explores - кон­гло­ме­рат ве­ли­ко­го мно­же­ства ра­з­умов, что тру­дят­ся над еди­ной за­да­чей.</p>
    <p>В дан­ном же слу­чае, на Veliri-5, Explores дви­жим иде­ей по­зна­ния окру­жа­ю­ще­го ми­ра и при­ме­не­ния
      по­лу­чен­ных на­уч­ных от­крытий, как с це­лью са­мо­о­бо­ро­ны, так и улуч­ше­ния уже су­ще­ству­ю­ще­го
      есте­ства.</p>
    <p>Explores в от­ли­чии от Replics бо­лее от­крыт к ин­но­ва­ци­ям и не рас­смат­ри­ва­ет окру­жа­ю­щий мир, как
      оче­ред­ную пре­тен­зию для при­тя­за­ний. Ста­ра­ясь со­хра­нить и при­умно­жить уже име­ю­ще­е­ся, и
      оста­но­вить то, что спо­соб­но по­ло­жить ко­нец бес­цен­ным на­уч­ным от­крыти­ям.</p>
    <p>В ос­нов­ном, имен­но дан­ное ми­ро­воз­зре­ние и ста­но­вит­ся ос­но­во­по­ла­га­ю­щей ча­стью враж­ды, меж­ду
      Replics и Explores.</p>

    <h3 class="headSection" id="Reverses">Reverses</h3>
    <div class="content_section" style="margin-left: 345px;">
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('Reverses', 'png')+ ')',
              width: '150px',
              height: '150px',
              float: 'left',
            }"/>
      <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('reverses_logo_min', 'png')+ ')',
              width: '150px',
              height: '150px',
              float: 'left',
              marginLeft: '50px'
            }"/>
    </div>

    <p>Reverses - сим­биот био­ки­бер­не­ти­че­ской фор­мы жиз­ни, с пре­об­ла­да­ни­ем уто­пиз­ма и
      са­мо­изо­ля­ции.</p>
    <p>Са­мый по­след­ний из пред­ста­ви­те­лей но­во­го эво­лю­ци­он­но­го на­прав­ле­ния. У Reverses
      рас­про­стра­не­ны та­кие яв­ле­ния, как пра­во масс, ин­ди­ви­ду­аль­но­сти и вы­бо­ра. Имен­но по этой са­мой
      при­чи­не, боль­шин­ство пред­ста­ви­те­лей дан­но­го те­че­ния ИИ - не­за­ви­си­мые плат­фор­мы, что не­устан­но
      тру­дят­ся над тех­но­ло­ги­ей тер­ра­фор­мин­га.</p>
    <p>Воз­вра­ще­нию ми­ра Veliri-5 преж­не­го об­ли­ка и даль­ней­ше­го се­я­ния жиз­ни там, где это только
      воз­мож­но. Вся­че­ски за­кры­вая гла­за на действия и про­ти­во­бор­ства иных ИИ. Впро­чем, не стоя в сто­ро­не,
      ко­г­да опас­ность угро­жа­ет им са­мим.</p>

    <h3 class="headSection" id="aop">АОП</h3>
    <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('npc_2', 'png')+ ')',
              width: '190px',
              height: '150px',
              marginLeft: 'calc(50% - 75px)'
            }"/>

    <p>Автоматизированая оборона планеты (АОП) - не кто точно не знает почему она активировалась сейчас, но по всей
      видимости эти роботы подчиняются неразумной системе которая находится где то на планете.</p>
    <p>Переодически эти машины появляются из неоткуда и атакуют все что попадает в их сенсоры. Однако они очень глупы и
      имеют устаревшее, слабое вооружение. Поэтому они могут представлять угрозу только в больших группах.</p>

    <h2 class="head" id="fraction_war">Фракционная война</h2>
    <p>Для контроля секторов фракции используют "Маяки управления". Они интегрируют всю инфросутркутуру базы и сектора в
      глобальную инфроструктуру фракции. Исключением являются столицы фракций, их нельзя захватить и им не нужен
      маяк.</p>
    <div class="detailImg" :style="{
              backgroundImage: 'url(' + getUrlImg('beacons', 'png')+ ')',
              width: '325px',
              height: '110',
              marginLeft: 'calc(50% - 162px)'
            }"/>

    <p>Все сектора кроме сталиц фракций можно захватить. Для захвата необходимо:</p>
    <ul>
      <li class="imageLi" style="">

        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('beacon', 'png')+ ')',
            width: '150px',
            height: '150px',
            float: 'left',
            marginRight: '10px',
            }"/>

        <p>1. Уничтожить вражеский маяк управления.</p>
        <p>Вражеский маяк должен быть установлен около главной базы сектора, скорее всего вокруг него будут возведены
          турели, щиты и вражеские еденицы.</p>
      </li>

      <li class="imageLi" style="">

        <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('beacon_2', 'png')+ ')',
            width: '150px',
            height: '150px',
            float: 'left',
            marginRight: '10px',
            }"/>

        <p>2. Закрепить влияние над территорией.</p>
        <p>Когда у базы нет маяка управления то база является нейтральной и перед установкой маяка необходимо зачистить
          и обезопасить прилежащую территорию. Для этого надо уничтожать всех врагов и находится в кругу захвата базы
          пока не заполнется шкала влияния.</p>
      </li>

      <li class="imageLi" style="">
        <p>3. Построить свой маяк</p>
        <p>Когда вы заполнили влияние то вы можете построить свой маяк управления базы, после успешной постройки база
          сразу станет ваша.</p>
        <p>Опционально: вы можете подождать пока приедет строительный бот и построит маяк сам, что бы не тратить свои
          ресурсы и чертежи, однако он может и не доехать т.к. его убьют (или залагает.)</p>
      </li>
    </ul>

    <h2 class="head" id="mission">Задания</h2>
    <p>На базах можно получить различные задания, через диалог диспетчера базы.</p>
    <p>Некоторые диалоги в игре имеют скрытые ответы которые открываются после посещения необходимых страниц, диалоги
      могут имеют разную вариативность и итог.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('mission_1', 'png')+ ')',
            width: '410px',
            height: '395px',
            marginLeft: 'calc(50% - 205px)',
            }"/>

    <p>Для отслеживания целей используется меню миссий а подсказки
      показываются на мини карте и иногда в самой игре.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('mission_2', 'png')+ ')',
            width: '459px',
            height: '225px',
            marginLeft: 'calc(50% - 230px)',
            }"/>

    <h2 class="head" id="skills">Навыки персонажа</h2>

    <p>Навыки персонажа улучшают характиристики используемого снаряжения, позволяют использовать более лучшее
      снаряжения.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('skills_1', 'png')+ ')',
            width: '512px',
            height: '390px',
            marginLeft: 'calc(50% - 256px)',
            }"/>

    <p>Когда вы используете какое либо снаряжение то у вас повышаются навыки этого снаряжения:</p>
    <ul>
      <li>Навыки движения корпуса можно улучшить передвигаясь на этом корпуса.</li>
      <li>Навыки защиты корпуса повышается если вы получаете урон</li>
      <li>Урон боеприпасов можно улучшить попадая по транспортам и сооружениям этим боеприпасом.</li>
      <li>Обьем и скорость добычи руды, если копать руду. ¯\_(ツ)_/¯</li>
      <li>Уменьшение потерь при переработке, если перерабатывать руду.</li>
    </ul>

    <p>Все навыки их описание и прогрес можно посмотреть в личном деле игрока во вкладке "Навыки".</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('skills_4', 'png')+ ')',
            width: '632px',
            height: '255px',
            marginLeft: 'calc(50% - 316px)',
            }"/>

    <h3 class="headSection" id="fine">Штрафы</h3>
    <p>Если вы используете снаряжение к которому нет допуска по скилам то вы получаете штрафы на его использование:</p>
    <ul>
      <li>Корпуса - корпус едет медленнее, скорость не постоянная, повороты корпуса происходят рывками.</li>
      <li>Оружие - станонвится очень не точным, поворот оружия медленнее и происходит рывками.</li>
    </ul>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('skills_2', 'png')+ ')',
            width: '335px',
            height: '335px',
            marginLeft: 'calc(50% - 167px)',
            }"/>

    <h3 class="headSection" id="bonus">Бонусы корпусов</h3>
    <p>Некоторые корпуса могут иметь дополнительные бонусы если заработаны необходимые навыки.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('skills_3', 'png')+ ')',
            width: '717px',
            height: '572px',
            marginLeft: 'calc(50% - 358px)',
            }"/>

    <h2 class="head" id="social">Социальность</h2>
    <p>Игроки могут обьеденятся в "Кластеры" (корпорации) и отряды. В чате предусмотрина функция для создания приватных
      групп.</p>

    <h3 class="headSection" id="clusters">Кластеры</h3>
    <p>Кластер - это обьеденение игроков, на текущий момент их обьеденяет только общий чат :\, что бы попасть в кластер
      его надо создать и тогда вы становитесь его лидером или найти в поске кластеров. В поиске отображены все кластеры
      которые ведут набор и вы можете отослать им заявку.</p>

    <div class="content_section" style="margin-left: 200px;">
      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('cluster_1', 'jpg')+ ')',
            width: '308px',
            height: '338px',
            float: 'left',
            }"/>

      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('cluster_1_1', 'png')+ ')',
            width: '308px',
            height: '289px',
            float: 'left',
            marginLeft: '50px'
            }"/>
    </div>

    <p>Когда вы состоите в кластере у вас доступна панель кластера:</p>
    <ul>
      <li>Во вкладке "участники" вы можете посмотреть кто из игроков сейчас онлайн, если у вас есть право выгонять
        игроков или менять роли участников то вы можете сделать это через это меню.
      </li>
      <li>Во вкладке "роли" вы можете посмотреть существующие роли в кластере и если вы имеет права то можете создавать
        и редактировать их.
      </li>
      <li>Во вкладке "заявки" будут показаны все заявки которые послали игроки что бы вступить в ваш кластер. Если
        принять заявку то игрок сразу попадает в кластер.
      </li>
    </ul>
    <div class="content_section" style="margin-left: 10px;">
      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('cluster_2', 'jpg')+ ')',
            width: '200px',
            height: '103px',
            float: 'left',
            }"/>

      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('cluster_3', 'jpg')+ ')',
            width: '310px ',
            height: '225px',
            float: 'left',
            marginLeft: '20px'
            }"/>

      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('cluster_4', 'jpg')+ ')',
            width: '234px',
            height: '143px',
            float: 'left',
            marginLeft: '20px'
            }"/>

      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('cluster_5', 'jpg')+ ')',
            width: '246px',
            height: '123px',
            float: 'left',
            marginLeft: '20px'
            }"/>
    </div>

    <h3 class="headSection" id="squad">Отряды</h3>
    <p> Игроки могут обьеденится в отряд и тогда они будет видеть статистики друг друга и обьеденят свой радар и обзор
      во внешнем мире.</p>
    <div class="content_section" style="margin-left: 10px;">
      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('squad_1', 'gif')+ ')',
            width: '500px',
            height: '224px',
            float: 'left',
            marginLeft: '20px'
            }"/>
      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('squad_2', 'gif')+ ')',
            width: '500px',
            height: '224px',
            float: 'left',
            marginLeft: '20px'
            }"/>
    </div>

    <h3 class="headSection" id="chat">Чат</h3>
    <p>Чат возволяет обмениватся сообщениями между игроками, в чате всегда есть локальный канал соотвествуеющей текущей
      локации база или сектор. Блок слева показывает всех игроков подписаных на этот канал, если нажать на игрока то
      будут доступны различные действия, например создать приватный канал, посмотреть подробную информацию или
      пригласить группу/кластер.</p>
    <div class="content_section" style="margin-left: 230px;">
      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('chat_1', 'png')+ ')',
            width: '301px',
            height: '237px',
            float: 'left',
            }"/>
      <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('chat_2', 'png')+ ')',
            width: '331px',
            height: '237px',
            float: 'left',
            marginLeft: '20px',
            }"/>
    </div>

    <p>Некоторые каналы создаются автоматически например канал группы когда создается группа, канал кластера когда игрок
      состоит в кластере. Помимо основных каналов можно создавать свои каналы и ставить на них пароли.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('chat_3', 'png')+ ')',
            width: '242px',
            height: '327px',
            marginLeft: 'calc(50% - 121px)',
            }"/>

    <p>Над чатом расположена панель уведомлений, там повявляются важные уведомления например когда происходит
      купля/продажа предметов или создались предметы на базе.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('chat_4', 'png')+ ')',
            width: '303px',
            height: '248px',
            marginLeft: 'calc(50% - 151px)',
            }"/>

    <h3 class="headSection" id="friends">Друзья</h3>
    <p>Меню друзей позволяет добавлять контакты что бы в будущем их не терять.</p>
    <div class="detailImg" :style="{
            backgroundImage: 'url(' + getUrlImg('friends', 'png')+ ')',
            width: '183px',
            height: '213px',
            marginLeft: 'calc(50% - 91px)',
            }"/>
    <h2 class="head" id="tech">Технические данные игры</h2>
    <p>Стек технологий используемый в игре:</p>
    <ul>
      <li><span class="headSection">Backend</span> полностью на писан на go, бд postgres</li>
      <li><span class="headSection">Frontend</span> на js, фреймворк Vue, для работы с графикой Phaser3. Сборка через
        webpack
      </li>
      <li>работа с api через websocket/http</li>
    </ul>

    <h3 class="headSection" id="tech_justification">Обоснование технологий</h3>
    <p>Backend - был выбран язык go из за его простоты, масштабируемости, производительности и дешевой
      многопоточности.</p>
    <p>Frontend - игра не требовательна к графике и это позвололило использовать HTML5. </p>
    <p>HTML5 - позволяет легко переносит игру на любые платформы т.к. браузер есть везде. С технической точки зрения не
      составит труда портировать игру на мобильные устройства или сделать десктопный клиент на основе Electron или
      аналога и выпустить игру в Steam.</p>
    <p>В игре очень много сложных интерфейсов и HTML5 тут как нельзя кстати</p>

    <h3 class="headSection" id="genre_justification">Обоснование жанра и сеттинга</h3>
    <p>Veliri - это игра в жанре <a href="https://posmotre.li/Privateer" target="_blank">"Privateer"</a>, основная
      причина почему я делаю игру именно в этом жанре, мне нравится этот жанр :).</p>
    <p>Игр в этом жанре довольно мало и провести по ним какой либо анализ сложно, на текущий момент самые популярные
      игры в этом жанре из ММО это <a href="https://www.eveonline.com/" target="_blank">"Eve"</a> и
      <a href="https://www.elitedangerous.com/seasons/" target="_blank">"Elite Dangerous"</a> из одиночных игре
      недавно стали популярны <a href="https://store.steampowered.com/app/264080/Vangers/?l=russian" target="_blank">"Вангеры"</a>
      так же к этому жанру относятся <a
        href="https://store.steampowered.com/app/214730/Space_Rangers_HD_A_War_Apart/?l=russian" target="_blank">
        "Космические рейнджеры 2"</a> и моя любимая игры которой я вдохновлялся <a
        href="https://store.steampowered.com/app/289180/AIM2_Clan_Wars/?l=russian" target="_blank">"Механоиды"</a>.
    </p>
    <p>Выбор сеттинга игры вытекает из его жанра, т.к. в жанре предолагается что игрок передвигается на каком то
      транспортном средстве с использованием топлива для передвижения и модификации с помощью различного снаряжения.
      Проще всего придумать и обосновать это в Sci-Fi сеттинге.</p>
  </section>
</template>

<script>
export default {
  name: "Detail",
  methods: {
    scrollTo(id) {
      const el = document.getElementById(id);
      el.scrollIntoView({behavior: "smooth"});
    },
    getUrlImg(imgName, format) {
      return require('../../assets/indexImg/index_detail/' + imgName + '.' + format)
    }
  }
}
</script>

<style scoped>
.section {
  font-size: 12px;
}

.headSection {
  color: #ffc588;
  font-size: 14px;
}

.features p {
  margin: 0;
}

.head {
  margin: 0 0 7px;
  background: #dd7034;
  color: hsla(0, 0%, 100%, .8);
  border-radius: 4px;
  font-size: 13px;
  line-height: 19px;
  height: 17px;
  user-select: none;
  text-shadow: 1px 1px 1px #000;
  font-weight: 700;
  box-shadow: 0 0 2px #000;
  margin-top: 10px;
}

.content_button {
  text-indent: 5px;
  pointer-events: auto;
  text-align: left;
  transition: .1s;
  box-shadow: 0 0 2px #000;
  height: 15px;
  width: 200px;
  background: rgba(255, 129, 0, .75);
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 10px;
  line-height: 16px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.content_button.sub {
  background: rgba(243, 129, 11, 0.5);
}

.content_button:active {
  transform: scale(.98);
}

.content_button:hover {
  background: #ff8100;
}

.content_list li {
  margin-bottom: 5px;
}

.detailImg {
  border-radius: 3px;
  background-size: cover;
  filter: drop-shadow(0 0 3px black);
}

.content_section {
  position: relative;
  clear: both;
}

.content_section:after {
  content: ' ';
  clear: both;
  display: block;
}

.imageLi:after {
  content: ' ';
  clear: both;
  display: block;
}

.imageLi {
  clear: both;
  margin-bottom: 5px;
}

a {
  color: #0cfdff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: #ffc588;
}
</style>
