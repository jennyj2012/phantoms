(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Player = Phantoms.Player = function (options) {
    options.color = Player.COLOR;
    options.radius = Player.RADIUS;
    options.vel = options.vel || [0,0];
    options.pos = options.pos;
    Phantoms.MovingObject.call(this, options);
  };

  Player.COLOR = "blue";
  Player.RADIUS = 50;
  Phantoms.Util.inherits(Player, Phantoms.MovingObject);

  Player.prototype.setVelocity = function (direction) {
    this.vel[0] = direction[0];
    this.vel[1] = direction[1];
  };

  Player.prototype.draw = function (ctx){
    var img = new Image();
    img.src = "./images/flashlight.png";
    ctx.drawImage(
      img,
      this.pos[0] - this.radius/2, this.pos[1], this.radius, this.radius
    );
    // use a preloader separately or image won't redraw
    // img.onload = function(){
    //   ctx.drawImage( img, x, y, w, h);
    // }.bind(this);
  };

  Player.prototype.shineFlashlight = function () {
    var flashlight = new Phantoms.Flashlight({
      pos: this.pos,
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
