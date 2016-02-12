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
  "a": [-1,  0],
  "s": [0, 0],
  "d": [ 1,  0],
  //rotation of flashlight
  // "left": 15,
  // "right": -15
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

    //every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
})();
