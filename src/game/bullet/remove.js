import {gameStore} from "../store";

function deleteBullet(bullet, id) {

  if (bullet.ttl) {
    clearInterval(bullet.ttl.inspector);
    bullet.ttl = null;
  }

  if (bullet.debugText) {
    bullet.debugText.setVisible(false);
  }

  if (bullet.shadow) {
    bullet.shadow.setVisible(false);
  }

  if (bullet.fairy) {
    bullet.fairy.setVisible(false);
    bullet.fairy.emitter.stop();
  }

  delete gameStore.bullets[id];

  if (bullet.sprite) {
    bullet.sprite.setVisible(false);

    if (!gameStore.cacheSpriteBullets.hasOwnProperty(bullet.sprite.frame.name)) {
      gameStore.cacheSpriteBullets[bullet.sprite.frame.name] = [];
    }

    // что бы эмиторы успокоились
    setTimeout(function () {
      gameStore.cacheSpriteBullets[bullet.sprite.frame.name].push(bullet);
    }, 200);
  }
}

export {deleteBullet}
