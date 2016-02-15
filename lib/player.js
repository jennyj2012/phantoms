(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Player = Phantoms.Player = function (options) {
    options.color = Player.COLOR;
    options.width = Player.WIDTH;
    options.height = Player.HEIGHT;
    options.vel = options.vel || [0,0];
    options.pos = options.pos || [Phantoms.Game.DIM_X / 2, Phantoms.Game.DIM_Y - options.height];
    options.angle = options.angle % 360 || 0;
    Phantoms.MovingObject.call(this, options);
  };

  Player.COLOR = "blue";
  Player.HEIGHT = 50;
  Player.WIDTH = 20;
  Phantoms.Util.inherits(Player, Phantoms.MovingObject);
  Player.SPEED = 1;

  Player.prototype.setVelocity = function (direction) {
    this.vel[0] += direction[0];
    this.vel[1] += direction[1];
    if(this.vel[0] !== 0 || this.vel[1] !== 0){
      this.vel = Phantoms.Util.scaledDir(this.vel, Player.SPEED)
    }
  };

  Player.prototype.draw = function (ctx){
    var img = new Image();
    img.src = "./images/flashlight-rect.png";

    ctx.save();
    var angle = this.angle * (Math.PI/ 180);
    ctx.translate(this.pos[0] - this.width / 2, this.pos[1] - this.height / 2);
    ctx.rotate(angle);
    ctx.drawImage(
      img,
      0, 0 + this.height / 2,
      this.width, this.height
    );
    ctx.restore();
  };

  Player.prototype.shineFlashlight = function () {
    var flashlight = new Phantoms.Flashlight({
      angle: this.angle,
      pos: [this.pos],
      game: this.game
    });
  //
    this.game.add(flashlight);
    // debugger
  };
  //
  //
  // Player.prototype.relocate = function () {
  //   this.pos = this.game.randomPosition();
  //   this.vel = [0, 0];
  // };



  })();
