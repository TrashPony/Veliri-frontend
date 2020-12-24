import {Scene} from "../create";

function MoveNetworkInterpolation(sprite, x, y, ms, scale) {

  // x_current = x_source + (x_destination - x_source) * current_frame_no / total_frames_count
  /*
    x_current - текущее (искомое) значение координаты;
    x_source - начальное значение координаты; (откуда движемся);
    x_destination - конечное значение координаты; (куда движемся);
    current_frame_no - номер текущего кадра;
    total_frames_count - сколько всего кадров в анимации
  */

  if (sprite.interpolation) {
    clearInterval(sprite.interpolation)
  }

  let totalFrames = ms / 16;
  let currentFrame = 1;

  let setState = function () {
    sprite.x = sprite.x + (x - sprite.x) * currentFrame / totalFrames;
    sprite.y = sprite.y + (y - sprite.y) * currentFrame / totalFrames;
    //sprite.setScale(sprite.scale + (scale - sprite.scale) * currentFrame / totalFrames);
  };

  //console.log(sprite.scale + (scale - sprite.scale) * currentFrame / totalFrames)
  //setState();

  sprite.interpolation = setInterval(function () {
    currentFrame++;

    setState();

    if (totalFrames === currentFrame) {
      clearInterval(sprite.interpolation);
      sprite.interpolation = null;
    }

  }, ms / totalFrames);
}

function MoveSprite(sprite, x, y, ms, size) {
  if (size) {
    sprite.moveTween = Scene.tweens.add({
      targets: sprite,
      x: x,
      y: y,
      scale: size,
      ease: 'Linear',
      duration: ms,
      // onComplete: function () {
      //   tween.remove();
      //   tween = null;
      // }
    });
  } else {
    sprite.moveTween = Scene.tweens.add({
      targets: sprite,
      x: x,
      y: y,
      ease: 'Linear',
      duration: ms,
      // onComplete: function () {
      //   tween.remove();
      //   tween = null;
      // }
    });
  }
}

export {MoveSprite, MoveNetworkInterpolation}
