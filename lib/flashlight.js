(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Flashlight = Phantoms.Flashlight = function (options) {
    options.color = Flashlight.COLOR;
    options.radius = Flashlight.WIDTHSPAN;
    options.vel = options.vel || [0,0];
    options.pos = options.pos
    options.angle = Math.PI * Math.random();

    Phantoms.MovingObject.call(this, options);
  };

  Flashlight.COLOR = "yellow";
  Flashlight.WIDTHSPAN = 40;

  Phantoms.Util.inherits(Flashlight, Phantoms.MovingObject);
  Flashlight.prototype.isWrappable = false;

  Flashlight.prototype.resetPosition = function (pos) {
    this.pos = pos;
  }

  Flashlight.prototype.draw = function (ctx){
    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.beginPath();
    ctx.moveTo(this.pos[0],this.pos[1]);
    ctx.lineTo(this.pos[0] - this.radius, 0);
    ctx.lineTo(this.pos[0] + this.radius, 0);
    ctx.fill();
  };

  Flashlight.prototype.collideWith = function (otherObject) {
    // default do nothing
    this.game.updateScore();
    this.game.remove(otherObject);
  };

  Flashlight.prototype.isCollidedWith = function (otherObject) {
    if(otherObject instanceof Phantoms.Phantom){
      // debugger
      var objR = otherObject.pos[0] + otherObject.radius;
      var objL = otherObject.pos[0] - otherObject.radius;
      if(objR >= this.pos[0] - this.radius && !(objR >= this.pos[0] + this.radius) ||
        objL <= this.pos[0] - this.radius && !(objL <= this.pos[0] + this.radius)){
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  })();
