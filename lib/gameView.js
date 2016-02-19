(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var GameView = Phantoms.GameView = function (game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.player = this.game.addPlayer();
  };

  GameView.MOVES = {
  //movement of player
  "left": [-1,  0],
  "right": [ 1,  0],
  "up": [0, -1],
  "down": [0, 1],
};

  GameView.ROTATION = {
    //rotation of flashlight
    "a": -15,
    "d": 15
  };

  GameView.prototype.bindKeyHandlers = function () {
    var player = this.player;
    var game = this.game;

    Object.keys(GameView.MOVES).forEach(function (k) {
      var move = GameView.MOVES[k];
      key(k, function () {
        player.setVelocity(move);
      });
    });

    Object.keys(GameView.ROTATION).forEach(function (k) {
      var angle = GameView.ROTATION[k];
      key(k, function () {
        player.setAngle(angle);
      });
    });

    key("space", function () {
      player.shineFlashlight()
    });
  };

  GameView.prototype.start = function () {
    this.bindKeyHandlers();

    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  };

  GameView.prototype.animate = function(time){
    var timeDelta = time - this.lastTime;

    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
  }
})();
