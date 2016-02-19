(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Phantom = Phantoms.Phantom = function (options) {
    options.pos = options.pos || options.game.randomPosition();
    options.height = Phantom.HEIGHT;
    options.width = Phantom.WIDTH;
    options.angle = 0;
    options.vel = options.vel || Phantoms.Util.randomVec(Phantom.SPEED);

    Phantoms.MovingObject.call(this, options);
    this.tick = 0;
  };

  Phantom.HEIGHT = 100;
  Phantom.WIDTH = 100;
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
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.drawImage(img, 0 - (this.width / 2), 0 - (this.height / 2) , this.width, this.height);
    ctx.translate(-this.pos[0], -this.pos[1]);
    ctx.restore();

  };

  Phantom.prototype.collideWith = function (otherObject) {
    this.game.gameOver = true;
  };

  Phantom.prototype.isCollidedWith = function (otherObject) {
    if(otherObject instanceof Phantoms.Player){

      var ghostVerticies = Phantoms.Util.regularVerticies(this);
      var playerVerticies = Phantoms.Util.rotatedVerticies(otherObject);

      var playerVertexSets = Phantoms.Util.zip(playerVerticies);
      var xMinMax = Phantoms.Util.minMax(playerVertexSets[0]);
      var yMinMax = Phantoms.Util.minMax(playerVertexSets[1]);
      var collided = false;

      ghostVerticies.forEach(function (ghostVertex){
        if (Phantoms.Util.isInRangeofSets(ghostVertex[0], [xMinMax])
        && Phantoms.Util.isInRangeofSets(ghostVertex[1], [yMinMax])) {
          collided = true;
        }
      });

      return collided;
    } else {
      return false;
    }
  };

  })();
