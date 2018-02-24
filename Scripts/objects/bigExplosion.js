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
var objects;
(function (objects) {
    var BigExplosion = /** @class */ (function (_super) {
        __extends(BigExplosion, _super);
        // PRIVATE INSTANCE VARIABLES
        // PUBLIC PROPERTIES
        // CONSTRUCTORS
        function BigExplosion(textureAtlas) {
            var _this = _super.call(this, textureAtlas, "bigExplosion") || this;
            _this.Start();
            return _this;
        }
        // PRIVATE METHODS
        BigExplosion.prototype._reset = function () {
            this.y = -1000;
            this.x = -1000;
        };
        BigExplosion.prototype._checkBounds = function () {
            if (this.y <= 0 + this.height) {
                this._reset();
            }
        };
        // PUBLIC METHODS
        BigExplosion.prototype.Start = function () {
            var _this = this;
            //this.verticalSpeed = -10;
            this._reset();
            this.on("animatinend", function () {
                console.info("animation ended");
                _this._reset();
            });
        };
        BigExplosion.prototype._updatePosition = function () {
            this.y += this.verticalSpeed;
            this.position.x = this.x;
            this.position.y = this.y;
        };
        BigExplosion.prototype.Update = function () {
            if (this.y > 0) {
                // this._updatePosition();
                this._checkBounds();
            }
        };
        return BigExplosion;
    }(objects.GameObject));
    objects.BigExplosion = BigExplosion;
})(objects || (objects = {}));
//# sourceMappingURL=bigExplosion.js.map