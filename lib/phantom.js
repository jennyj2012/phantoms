(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Phantom = Phantoms.Phantom = function (options) {
    options.color = Phantom.COLOR;
    options.pos = options.pos || options.game.randomPosition();
    options.radius = Phantom.RADIUS;
    options.vel = options.vel || Phantoms.Util.randomVec(Phantom.SPEED);

    Phantoms.MovingObject.call(this, options);
    this.tick = 0;
  };

  Phantom.COLOR = "#505050";
  Phantom.RADIUS = 50;
  Phantom.SPEED = 1.5;

  Phantoms.Util.inherits(Phantom, Phantoms.MovingObject);

  Phantom.prototype.draw = function (ctx){
    var img = new Image();
    img.src = "./images/static-ghost.png";

    // var frame = this.tick % 3;
    // var x = frame * 13;
    // ctx.drawImage(
    //   img,        // the image of the sprite sheet
    //     x,0,13,13, // source coordinates      (x,y,w,h)
    //     0,0,13,13,  // destination coordinates (x,y,w,h)
    //   );
    // this.tick++;
    ctx.drawImage(
      img,
      this.pos[0], this.pos[1], this.radius, this.radius
    );
  };

  Phantom.prototype.collideWith = function (otherObject) {
    this.game.gameOver = true;
  };

  Phantom.prototype.isCollidedWith = function (otherObject) {
    if(otherObject instanceof Phantoms.Player){
      var ghostR = this.pos[0] + this.radius;
      var ghostL = this.pos[0] - this.radius;
      // var flashCenter = otherObject.pos[0]- otherObject.radius/2 //center of flashlight
      // var centerDist = Phantoms.Util.dist(this.pos, otherObject.pos);
      if (this.pos[1] + this.radius >= otherObject.pos[1] && !(this.game.isOutOfBounds(this.pos, this.radius))) {
        // debugger
        if((ghostR >= otherObject.pos[0] - otherObject.radius && !(ghostR >= otherObject.pos[0] + otherObject.radius)) ||
          (ghostL <= otherObject.pos[0] - otherObject.radius && !(ghostL <= otherObject.pos[0] + otherObject.radius))) {
          return true;
        } else {
          return false;
        }

      } else {
        return false;
      }

    } else {
      return false;
    }
  };

  })();
