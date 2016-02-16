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
    options.angle = options.angle % 360 || 0; //degrees
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

  Player.prototype.setAngle = function (direction) {
    this.angle += direction;

    this.game.flashlights.forEach(function (light) {
      light.setAngle(direction);
    });
  };

  Player.prototype.draw = function (ctx){
    var img = new Image();
    img.src = "./images/flashlight-rect.png";

    ctx.save();
    var angle = Phantoms.Util.deg_to_radians(this.angle);
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
