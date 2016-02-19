(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var MovingObject = Phantoms.MovingObject = function (options){
    this.pos = options.pos;
    this.vel = options.vel;
    this.width = options.width;
    this.height = options.height;
    this.color = options.color || "blue";
    this.game = options.game;
    this.angle = options.angle || 0;
    this.offset = options.offset || 0;
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    //default draw circle
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.width, 0, 2 * Math.PI, true);
    ctx.fill();
  };

  MovingObject.prototype.isWrappable = true;

  var NORMAL_FRAME_TIME_DELTA = 1000/60; //1/60th of a second
  MovingObject.prototype.move = function (timeDelta) {
    var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
        offsetX = this.vel[0] * velocityScale,
        offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

    if (this.game.isOutOfBounds(this.pos, this.width, this.height)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos);
      } else {
        this.remove();
      }
    };

    // updates flashlight position to player position
    if(this instanceof Phantoms.Player){
      if(this.game.flashlights.length !== 0) {
        this.game.flashlights.forEach( function (light) {
          light.resetPosition(this.pos);
        }.bind(this));
      }
    }

    //erase instance of flashlight on keyup
    if(this instanceof Phantoms.Flashlight && key.isPressed("space") === false){
      this.remove();
    }

  };

  MovingObject.prototype.collideWith = function (otherObject) {
    // default do nothing
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    // var centerDist = Phantoms.Util.dist(this.pos, otherObject.pos);
    // return centerDist < (this.radius + otherObject.radius);
    return false;
  };

  MovingObject.prototype.remove = function () {
    this.game.remove(this);
  };

})();
