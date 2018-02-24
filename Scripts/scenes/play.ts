module scenes {
  export class Play extends objects.Scene {
    // PRIVATE INSTANCE VARIABLES
    private _assetManager: createjs.LoadQueue;
    private _textureAtlas: createjs.SpriteSheet;

    private _plane: objects.Plane;
    private _ocean: objects.Ocean;
    private _island: objects.Island;
    private _clouds: objects.Cloud[];
    private _cloudNum: number;

    private _bullets: objects.Bullet[];
    private _bulletNum: number;
    private _bulletCounter: number;

    private _bigExplosions: objects.BigExplosion[];
    private _bigExplosionNum: number;
    private _bigExplosionCounter: number;


    private _livesLabel: objects.Label;
    private _scoreLabel: objects.Label;

    private _lives: number;
    private _score: number;

    private _engineSound: createjs.AbstractSoundInstance;

    // PUBLIC PROPERTIES

    // CONSTRUCTORS
    constructor(assetManager: createjs.LoadQueue, textureAtlas:createjs.SpriteSheet, currentScene: number) {
      super();
      this._assetManager = assetManager;
      this._currentScene = currentScene;
      this._textureAtlas = textureAtlas;

      this._bulletFire = this._bulletFire.bind(this);

      this.Start();


    }
    // PRIVATE METHODS

    // PUBLIC METHODS
    public Start(): void {
      this._engineSound = createjs.Sound.play("engine", 0, 0, 0, -1, 0.25, 0);

      this._plane = new objects.Plane(this._textureAtlas);
      this._ocean = new objects.Ocean(this._assetManager);
      this._island = new objects.Island(this._textureAtlas);

      this._bulletNum = 50;
      this._bullets = new Array<objects.Bullet>();
      this._bulletCounter = 0;

      this._cloudNum = 3;
      this._clouds = new Array<objects.Cloud>();

      this._bigExplosionNum = 10;
      this._bigExplosions = new Array<objects.BigExplosion>();
      this._bigExplosionCounter = 0;

      this._lives = 5;
      this._score = 0;

      this._livesLabel = new objects.Label("Lives: " + this._lives, "30px", "Dock51", "#FFFF00", 10, 10, false);
      this._scoreLabel = new objects.Label("Score: " + this._score, "30px", "Dock51", "#FFFF00", 350, 10, false);

      this.Main();
    }

    public Update(): number {
      this._plane.Update();
      this._ocean.Update();
      this._island.Update();
      this._checkCollision(this._island);

      this._bullets.forEach(bullet => {
        bullet.Update();
      });

      this._clouds.forEach(cloud => {
        cloud.Update();
        this._checkCollision(cloud);
      });

      this._bigExplosions.forEach(explosion => {
        explosion.Update();
      });



      return this._currentScene;
    }

    public Main(): void {
      this.addChild(this._ocean);
      this.addChild(this._island);
      this.addChild(this._plane);

      for (let count = 0; count < this._bulletNum; count++) {
        this._bullets[count] = new objects.Bullet(this._textureAtlas);
        this.addChild(this._bullets[count]);
      }

      for (let count = 0; count < this._cloudNum; count++) {
        this._clouds[count] = new objects.Cloud(this._textureAtlas);
        this.addChild(this._clouds[count]);
      }

      for (let count = 0; count < this._bigExplosionNum; count++) {
        this._bigExplosions[count] = new objects.BigExplosion(this._textureAtlas);
        this.addChild(this._bigExplosions[count]);
        
      }

      this.addChild(this._livesLabel);
      this.addChild(this._scoreLabel);

      //window.addEventListener("mousedown", () => {this._bulletFire()});
      window.addEventListener("mousedown", this._bulletFire);

    }

    private  _bulletFire():void {
        this._bullets[this._bulletCounter].x = this._plane.bulletSpawn.x;
        this._bullets[this._bulletCounter].y = this._plane.bulletSpawn.y;

        this._bulletCounter++;
        if(this._bulletCounter >= this._bulletNum -1) {
          this._bulletCounter = 0;
        }
    }

    private _createBigExplosion():void {
      this._bigExplosions[this._bigExplosionCounter].x = this._plane.x;
      this._bigExplosions[this._bigExplosionCounter].y = this._plane.y;

      this._bigExplosions[this._bigExplosionCounter].gotoAndPlay("bigExplosion");

      this._bigExplosionCounter++;
      if(this._bigExplosionCounter >= this._bigExplosionNum -1) {
        this._bigExplosionCounter = 0;
      }
    }




    private _checkCollision(other: objects.GameObject) {
      let P1: createjs.Point = new createjs.Point(this._plane.x, this._plane.y);
      let P2: createjs.Point = other.position;

      // compare the distance between P1 and P2 is less than half the height of each object
      if ((Math.sqrt(Math.pow(P2.x - P1.x, 2) + Math.pow(P2.y - P1.y, 2))) <
        (this._plane.halfHeight + other.halfHeight)) {
        if (!other.isColliding) {
          if(other.name == "island") {
            this._score += 100;
            this._scoreLabel.text = "Score: " + this._score;
            createjs.Sound.play("yay", 0, 0, 0, 0, 0.5, 0);
          }

          if(other.name == "cloud") {
            this._lives -= 1;
            if(this._lives <= 0) {
              this._currentScene = config.END;
              this._engineSound.stop();
              window.removeEventListener("mousedown", this._bulletFire);
              this.removeAllChildren();
            }
            createjs.Sound.play("thunder", 0, 0, 0, 0, 0.5, 0);
            this._livesLabel.text = "Lives: " + this._lives;
            this._createBigExplosion();
          }

          other.isColliding = true;
        }
      } else {
        other.isColliding = false;
      }

    }

  }
}
