var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var scenes;
(function (scenes) {
    var Play = /** @class */ (function (_super) {
        __extends(Play, _super);
        // PUBLIC PROPERTIES
        // CONSTRUCTORS
        function Play(assetManager, textureAtlas, currentScene) {
            var _this = _super.call(this) || this;
            _this._assetManager = assetManager;
            _this._currentScene = currentScene;
            _this._textureAtlas = textureAtlas;
            _this._bulletFire = _this._bulletFire.bind(_this);
            _this.Start();
            return _this;
        }
        // PRIVATE METHODS
        // PUBLIC METHODS
        Play.prototype.Start = function () {
            this._engineSound = createjs.Sound.play("engine", 0, 0, 0, -1, 0.25, 0);
            this._plane = new objects.Plane(this._textureAtlas);
            this._ocean = new objects.Ocean(this._assetManager);
            this._island = new objects.Island(this._textureAtlas);
            this._bulletNum = 50;
            this._bullets = new Array();
            this._bulletCounter = 0;
            this._cloudNum = 3;
            this._clouds = new Array();
            this._bigExplosionNum = 10;
            this._bigExplosions = new Array();
            this._bigExplosionCounter = 0;
            this._lives = 5;
            this._score = 0;
            this._livesLabel = new objects.Label("Lives: " + this._lives, "30px", "Dock51", "#FFFF00", 10, 10, false);
            this._scoreLabel = new objects.Label("Score: " + this._score, "30px", "Dock51", "#FFFF00", 350, 10, false);
            this.Main();
        };
        Play.prototype.Update = function () {
            var _this = this;
            this._plane.Update();
            this._ocean.Update();
            this._island.Update();
            this._checkCollision(this._island);
            this._bullets.forEach(function (bullet) {
                bullet.Update();
            });
            this._clouds.forEach(function (cloud) {
                cloud.Update();
                _this._checkCollision(cloud);
            });
            this._bigExplosions.forEach(function (explosion) {
                explosion.Update();
            });
            return this._currentScene;
        };
        Play.prototype.Main = function () {
            this.addChild(this._ocean);
            this.addChild(this._island);
            this.addChild(this._plane);
            for (var count = 0; count < this._bulletNum; count++) {
                this._bullets[count] = new objects.Bullet(this._textureAtlas);
                this.addChild(this._bullets[count]);
            }
            for (var count = 0; count < this._cloudNum; count++) {
                this._clouds[count] = new objects.Cloud(this._textureAtlas);
                this.addChild(this._clouds[count]);
            }
            for (var count = 0; count < this._bigExplosionNum; count++) {
                this._bigExplosions[count] = new objects.BigExplosion(this._textureAtlas);
                this.addChild(this._bigExplosions[count]);
            }
            this.addChild(this._livesLabel);
            this.addChild(this._scoreLabel);
            //window.addEventListener("mousedown", () => {this._bulletFire()});
            window.addEventListener("mousedown", this._bulletFire);
        };
        Play.prototype._bulletFire = function () {
            this._bullets[this._bulletCounter].x = this._plane.bulletSpawn.x;
            this._bullets[this._bulletCounter].y = this._plane.bulletSpawn.y;
            this._bulletCounter++;
            if (this._bulletCounter >= this._bulletNum - 1) {
                this._bulletCounter = 0;
            }
        };
        Play.prototype._createBigExplosion = function () {
            this._bigExplosions[this._bigExplosionCounter].x = this._plane.x;
            this._bigExplosions[this._bigExplosionCounter].y = this._plane.y;
            this._bigExplosions[this._bigExplosionCounter].gotoAndPlay("bigExplosion");
            this._bigExplosionCounter++;
            if (this._bigExplosionCounter >= this._bigExplosionNum - 1) {
                this._bigExplosionCounter = 0;
            }
        };
        Play.prototype._checkCollision = function (other) {
            var P1 = new createjs.Point(this._plane.x, this._plane.y);
            var P2 = other.position;
            // compare the distance between P1 and P2 is less than half the height of each object
            if ((Math.sqrt(Math.pow(P2.x - P1.x, 2) + Math.pow(P2.y - P1.y, 2))) <
                (this._plane.halfHeight + other.halfHeight)) {
                if (!other.isColliding) {
                    if (other.name == "island") {
                        this._score += 100;
                        this._scoreLabel.text = "Score: " + this._score;
                        createjs.Sound.play("yay", 0, 0, 0, 0, 0.5, 0);
                    }
                    if (other.name == "cloud") {
                        this._lives -= 1;
                        if (this._lives <= 0) {
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
            }
            else {
                other.isColliding = false;
            }
        };
        return Play;
    }(objects.Scene));
    scenes.Play = Play;
})(scenes || (scenes = {}));
//# sourceMappingURL=play.js.map