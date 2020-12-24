<template>
  <section class="section">
    <h3 class="headSection">О игре</h3>
    <p> Veliri - это игра в жанре MMO Action-RPG в sci-fi сеттинге. </p>
    <p>На безымянной планете за территорию и
      ресурсы ведут сражения разумные дроны. В конфликте участвует три серии искусственного интеллекта.
      Каждая из них преследует свои цели, противоречащие целям других. Игроку предстоит искать ресурсы,
      захватывать территорию и сражаться за одну из трех фракций.</p>

    <div class="video">
      <iframe src="https://www.youtube.com/embed/GkI9daa8gyg" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
    </div>


  </section>
</template>

<script>
export default {
  name: "AboutGame"
}
</script>

<style scoped>
.headSection {
  color: #ffc588;
}

.video {
  margin: auto;
  margin-bottom: 10px;
  width: 560px;
  height: 315px;
}

.video iframe{
  width: 100%;
  height: 100%;
  margin-left: -24px;
}

@media (max-width: 602px) {
  .video {
    width: 320px;
    height: 250px;
  }
}

@media (max-width: 370px) {
  .video {
    width: 240px;
    height: 200px;
  }
}

@media (max-width: 650px) {
  .headSection {
    font-size: 13px;
  }
  .section {
    font-size: 10px;
  }
}
</style>
