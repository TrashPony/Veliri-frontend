<template>
  <div id="gallery">

  </div>
</template>

<script>
export default {
  name: "Gallery"
}
</script>

<style scoped>
#gallery {
  margin-top: 20px;
  padding: 0 75px;
}

#galleryBlock {
  position: relative;
  padding-bottom: 20px;
}

#leftArrow, #rightArrow {
  position: absolute;
  height: 30px;
  width: 30px;
  left: 25px;
  top: 50px;
  border: solid white;
  border-width: 0 6px 6px 0;
  border-radius: 30%;
  transition: 0.2s;
  transform: scale(1) rotate(135deg);
}

#leftArrow:hover, #rightArrow:hover {
  border-color: #ffc588;
}

#leftArrow:active {
  transform: scale(0.9) rotate(135deg)
}

#rightArrow:active {
  transform: scale(0.9) rotate(315deg)
}

#rightArrow {
  transform: scale(1) rotate(315deg);
  right: 25px;
  left: unset;
}

#screenShot {
  height: 400px;
  width: 800px;
  margin: 0 auto;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
