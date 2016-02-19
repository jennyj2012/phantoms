(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Player = Phantoms.Player = function (options) {
    options.width = Player.WIDTH;
    options.height = Player.HEIGHT;
    options.vel = options.vel || [0,0];
    options.pos = options.pos || [(Phantoms.Game.DIM_X / 2) - (options.width / 2), Phantoms.Game.DIM_Y - (options.height / 2)];
    options.angle = options.angle % 360 || 0; //degrees
    Phantoms.MovingObject.call(this, options);
  };

  Player.HEIGHT = 70;
  Player.WIDTH = 30;
  Phantoms.Util.inherits(Player, Phantoms.MovingObject);
  Player.SPEED = 1;

  Player.prototype.setVelocity = function (direction) {
    this.vel[0] += direction[0];
    this.vel[1] += direction[1];
    if(this.vel[0] !== 0 || this.vel[1] !== 0){
      this.vel = Phantoms.Util.scaledDir(this.vel, Player.SPEED)
    }
  };

  Player.prototype.setAngle = function (direction) {
    this.angle = (this.angle + direction) % 360;
    if(this.angle < 0) {
      this.angle = 360 + this.angle;
    }

    this.game.flashlights.forEach(function (light) {
      light.setAngle(direction);
    });
  };

  Player.prototype.draw = function (ctx){
    var img = new Image();
    img.src = "./images/flashlight-rect.png";

    ctx.save();
    var angle = Phantoms.Util.degToRadians(this.angle);
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(angle);
    ctx.drawImage(
      img,
      0  - this.width / 2, 0 - this.height / 2,
      this.width, this.height
    );
    ctx.rotate(-angle);
    ctx.translate(-this.pos[0], -this.pos[1]);
    ctx.restore();
  };

  Player.prototype.shineFlashlight = function () {
    var flashlight = new Phantoms.Flashlight({
      angle: this.angle,
      height: this.height * 3,
      pos: [this.pos[0], this.pos[1]],
      offset: [this.width, this.height],
      game: this.game
    });

    this.game.add(flashlight);
  };

  // Player.prototype.relocate = function () {
  //   this.pos = this.game.randomPosition();
  //   this.vel = [0, 0];
  // };



  })();
