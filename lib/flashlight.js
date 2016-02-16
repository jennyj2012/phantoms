(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Flashlight = Phantoms.Flashlight = function (options) {
    options.color = Flashlight.COLOR;
    options.length = (Phantoms.Game.DIM_Y / 4) / Math.sin(45 * (Math.PI / 180)); //max length
    options.height = options.length * Math.cos(Flashlight.ANGLE_RADIANS); //y-value on axis
    options.width = options.length * Math.sin(Flashlight.ANGLE_RADIANS); //x-value on axis
    options.vel = options.vel || [0,0];
    options.pos = options.pos;
    options.angle = options.angle;
    options.offset = options.offset;

    Phantoms.MovingObject.call(this, options);
  };

  Flashlight.COLOR = "yellow";
  Flashlight.ANGLE_RADIANS = Phantoms.Util.deg_to_radians(10); //degrees of width radius

  Phantoms.Util.inherits(Flashlight, Phantoms.MovingObject);
  Flashlight.prototype.isWrappable = false;

  Flashlight.prototype.resetPosition = function (pos) {
    this.pos = pos;
  }

  Flashlight.prototype.draw = function (ctx){
    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';

    ctx.save();
    var angle = Phantoms.Util.deg_to_radians(this.angle);
    ctx.translate(this.pos[0] - this.offset[0] / 2, this.pos[1] - this.offset[1] / 2);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(this.offset[0] / 2, this.offset[1] / 2);
    ctx.lineTo(0 - this.width, -this.height);
    ctx.lineTo(0 + this.width * 2, -this.height);
    ctx.fill();
    ctx.restore();

  };

  Flashlight.prototype.setAngle = function (direction) {
    this.angle += direction;
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
