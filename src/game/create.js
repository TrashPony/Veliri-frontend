import Phaser from "phaser";
import {preload} from "./preload"
import {update} from "./update"
import {gameStore} from "./store";
import store from "../store/store";

let Game = {};
let Scene = null;

function CreateGame() {
  if (!gameStore.gameInit) {

    if (!gameStore.mapEditor) {
      store.commit({
        type: 'setVisibleLoader',
        visible: true,
        text: 'Загружаем картинки...'
      });
    }

    gameStore.gameInit = true;

    let config = {
      type: Phaser.WEBGL,
      width: '100',
      height: '100',
      parent: 'game-container',
      scene: {
        preload: preload,
        create: create,
        update: update
      },
      render: {
        //pixelArt: true,
        antialias: true,
        antialiasGL: true,
        desynchronized: true,
        //roundPixels: true,
        //clearBeforeRender: false,
        //failIfMajorPerformanceCaveat: true,
        powerPreference: "high-performance",
        batchSize: 16000,
      },
      fps: {
        target: 60,
        min: 30,
        forceSetTimeOut: true
      }
    };

    Game = new Phaser.Game(config);
  } else {
    gameStore.gameReady = false;
    gameStore.unitReady = false;
  }

  gameStore.reload = false
}

function create() {
  Scene = this;

  // параметры смещения тени игры
  this.shadowXOffset = 6;
  this.shadowYOffset = 8;

  this.cameras.main.setBackgroundColor('#000000');
  this.input.topOnly = false; // нажатия по всем обьектам под мышкой

  this.wasd = this.input.keyboard.addKeys({
    up: 'W',
    down: 'S',
    left: 'A',
    right: 'D',
    ctrl: 'CTRL'
  }, false, false);

  // уровень обьектов которые под юнитом
  this.floorObjectLayer = this.add.group({
    classType: Phaser.GameObjects.Sprite,
  });

  // UNITS
  this.unitLayer = this.add.group({
    classType: Phaser.GameObjects.Sprite,
  });

  // уровень обьектов которые над юнитом
  this.floorOverObjectShadowLayer = this.add.group({
    classType: Phaser.GameObjects.Sprite,
  });
  this.floorOverObjectLayer = this.add.group({
    classType: Phaser.GameObjects.Sprite,
  });
  // уровень пуль
  this.artilleryLayer = this.add.group({
    classType: Phaser.GameObjects.Sprite,
  });

  this.flyObjectsLayer = this.add.group({
    classType: Phaser.GameObjects.Sprite,
  });

  this.cloudsLayer = this.add.group({
    classType: Phaser.GameObjects.Sprite,
  });

  for (let i = 0; i < 500; i++) {

    let text = this.add.text(0, 0, i, {
      font: "44px Arial Black",
      fill: "#fff"
    });
    text.setStroke('#000', 8);

    let rt = this.add.renderTexture(0, 0, 128, 64);
    rt.draw(text, 0, 0);
    rt.saveTexture("number_" + i);

    rt.destroy();
    text.destroy();
  }

  this.redactorButton = this.add.group();
  this.SelectLayer = this.add.group();

  createSelectSprite(this);

  let outlineConfig = {
    game: this.game,
    renderer: this.game.renderer,
    fragShader: `
            precision mediump float;
            uniform sampler2D uMainSampler;
            varying vec2 outTexCoord;
            void main(void) {

                vec4 color = texture2D(uMainSampler, outTexCoord);
                vec4 colorU = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y - 0.01));
                vec4 colorD = texture2D(uMainSampler, vec2(outTexCoord.x, outTexCoord.y + 0.01));
                vec4 colorL = texture2D(uMainSampler, vec2(outTexCoord.x + 0.01, outTexCoord.y));
                vec4 colorR = texture2D(uMainSampler, vec2(outTexCoord.x - 0.01, outTexCoord.y));

                gl_FragColor = color;

                if (color.a == 0.0 && (colorU.a != 0.0 || colorD.a != 0.0 || colorL.a != 0.0 || colorR.a != 0.0)  ) {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, .2);
                }
            }`  // GLSL shader
  };
  let outline = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline(outlineConfig);
  this.game.renderer.addPipeline('outline', outline);

  // https://labs.phaser.io/edit.html?src=src/camera/camera%20blur%20shader.js&v=3.22.0
  let blurConfig = {
    game: this.game,
    renderer: this.game.renderer,
    fragShader: `
            precision mediump float;

            //in attributes from our vertex shader
            varying vec4 outColor;
            varying vec2 outTexCoord;

            //declare uniforms
            uniform sampler2D u_texture;
            uniform vec2 dir;

            float resolution = 400.0;
            float radius = 2.0;

            void main() {
                //this will be our RGBA sum
                vec4 sum = vec4(0.0);

                //our original texcoord for this fragment
                vec2 tc = outTexCoord;

                //the amount to blur, i.e. how far off center to sample from
                //1.0 -> blur by one pixel
                //2.0 -> blur by two pixels, etc.
                float blur = radius/resolution;

                //the direction of our blur
                //(1.0, 0.0) -> x-axis blur
                //(0.0, 1.0) -> y-axis blur
                float hstep = 1.0;
                float vstep = 2.0;

                //apply blurring, using a 9-tap filter with predefined gaussian weights,

                sum += texture2D(u_texture, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;
                sum += texture2D(u_texture, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;
                sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;
                sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;

                sum += texture2D(u_texture, vec2(tc.x, tc.y)) * 0.2270270270;

                sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;
                sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;
                sum += texture2D(u_texture, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;
                sum += texture2D(u_texture, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;

                gl_FragColor = sum;
            }
       `
  };

  let blurShader = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline(blurConfig);
  this.game.renderer.addPipeline('blur', blurShader);

  let bloomConfig = {
    game: this.game,
    renderer: this.game.renderer,
    fragShader: `
            precision lowp float;
            varying vec2 outTexCoord;
            varying vec4 outTint;
            uniform sampler2D uMainSampler;
            uniform float time;

            float alpha = 1.3;

            void main() {

                vec4 sum = vec4(0);
                vec2 texcoord = outTexCoord;

                for(int xx = -4; xx <= 4; xx++) {
                    for(int yy = -4; yy <= 4; yy++) {

                        float dist = sqrt(float(xx*xx) + float(yy*yy));
                        float factor = 0.0;

                        if (dist == 0.0) {
                            factor = 2.0;
                        } else {
                            factor = 2.0/abs(float(dist));
                        }

                        sum += texture2D(uMainSampler, texcoord + vec2(xx, yy) * 0.002) * (abs(sin(time))+0.06);
                    }
                }

                gl_FragColor = sum * 0.025 + texture2D(uMainSampler, texcoord)*alpha;
            }
       `
  };

  let bloomShader = new Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline(bloomConfig);
  this.game.renderer.addPipeline('bloom', bloomShader);
}

function createSelectSprite(scene) {

  let graphics = scene.add.graphics();
  graphics.setDefaultStyles({
    lineStyle: {
      width: 12,
      color: 0xFFFFFF,
      alpha: 0.5
    },
    fillStyle: {
      color: 0xFFFFFF,
      alpha: 0.1
    }
  });

  let circle = {x: 312, y: 312, radius: 300};
  graphics.fillCircleShape(circle);
  graphics.strokeCircleShape(circle);
  graphics.generateTexture("select_sprite", 624, 624);
  graphics.destroy();

  let select_rect = scene.add.graphics();
  select_rect.setDefaultStyles({
    lineStyle: {
      width: 6,
      color: 0xFFFFFF,
      alpha: 0.5
    },
    fillStyle: {
      color: 0xFFFFFF,
      alpha: 0.1
    }
  });

  select_rect.fillRoundedRect(0, 0, 128, 128, 16);
  select_rect.strokeRoundedRect(3, 3, 122, 122, 16);
  select_rect.generateTexture("select_rect", 128, 128);
  select_rect.destroy();

  let deniedSprite = scene.add.graphics();
  deniedSprite.setDefaultStyles({
    lineStyle: {
      width: 60,
      color: 0xFF0000,
      alpha: 0.8
    },
    fillStyle: {
      color: 0x000000,
      alpha: 0.3
    }
  });

  let deniedCircle = {x: 300, y: 300, radius: 300 - 60};
  deniedSprite.fillCircleShape(deniedCircle);
  deniedSprite.strokeCircleShape(deniedCircle);
  deniedSprite.lineBetween(100, 400, 500, 200);
  deniedSprite.generateTexture("denied_rect", 600, 600);
  deniedSprite.destroy();
}

export {CreateGame, Game, Scene}
