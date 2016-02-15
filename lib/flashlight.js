(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Flashlight = Phantoms.Flashlight = function (options) {
    options.color = Flashlight.COLOR;
    options.width = Flashlight.WIDTH_RADIUS;
    options.height = Flashlight.WIDTH_RADIUS;
    options.vel = options.vel || [0,0];
    options.pos = options.pos;
    options.angle = options.angle;

    Phantoms.MovingObject.call(this, options);
  };

  Flashlight.COLOR = "yellow";
  Flashlight.WIDTH_RADIUS = 30; //degrees of width radius

  Phantoms.Util.inherits(Flashlight, Phantoms.MovingObject);
  Flashlight.prototype.isWrappable = false;

  Flashlight.prototype.resetPosition = function (pos) {
    this.pos = pos;
  }

  Flashlight.prototype.draw = function (ctx){
    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';

    ctx.save();
    var angle = this.angle * (Math.PI/ 180);
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(angle);
    ctx.beginPath();
    // debugger
    ctx.moveTo(0,0);
    ctx.lineTo(0 - this.width, -Phantoms.Game.DIM_X);
    ctx.lineTo(0 + this.width, -Phantoms.Game.DIM_X);
    ctx.fill();
    ctx.restore();

  };

  Flashlight.prototype.collideWith = function (otherObject) {
    // default do nothing
    this.game.updateScore();
    this.game.remove(otherObject);
  };

  Flashlight.prototype.isCollidedWith = function (otherObject) {
    if(otherObject instanceof Phantoms.Phantom){
      var objR = otherObject.pos[0] + otherObject.width;
      var objL = otherObject.pos[0] - otherObject.width;
      if(objR >= this.pos[0] - this.width && !(objR >= this.pos[0] + this.width) ||
        objL <= this.pos[0] - this.width && !(objL <= this.pos[0] + this.width)){
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  })();
