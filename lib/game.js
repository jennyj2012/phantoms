(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Game = Phantoms.Game = function () {
    this.phantoms = [];
    this.players = [];
    this.flashlights = [];
    this.addPhantoms();
    this.score = 0;
    this.gameOver = false;
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = window.innerWidth - 20;
  Game.DIM_Y = window.innerHeight - 20;
  Game.FPS = 32;
  Game.NUM_PHANTOMS = 5;

  Game.prototype.add = function (object) {
    if (object instanceof Phantoms.Phantom) {
      this.phantoms.push(object);
    } else if (object instanceof Phantoms.Player) {
      this.players.push(object);
    } else if (object instanceof Phantoms.Flashlight) {
      this.flashlights.push(object);
    }
  };

  Game.prototype.addPhantoms = function () {
    for (var i = 0; i < Game.NUM_PHANTOMS; i++) {
      this.add(new Phantoms.Phantom({ game: this }));
    }
  };

  Game.prototype.addPlayer = function () {
  var player = new Phantoms.Player({
    game: this
  });

  this.add(player);
  return player;
};

  Game.prototype.allObjects = function () {
    return [].concat(this.phantoms, this.players, this.flashlights);
  };

  Game.prototype.setBackground = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Phantoms", 50, 40);

    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Press 'space' to shine the flashlight", 50, 60);
    ctx.fillText("Press 'a' or 'd' to move the flashlight, 's' to stop", 50, 80);

    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("By Jenny Juarez", Game.DIM_X - 100, Game.DIM_Y - 10);
  }

  Game.prototype.displayScore = function (ctx) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + this.score, 820, 40);
  }

  Game.prototype.displayGameOver = function (ctx) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Game Over", Game.DIM_X / 2 - 50, Game.DIM_Y / 2);

    ctx.font = "14px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Press Enter", Game.DIM_X / 2, Game.DIM_Y / 2 + 20);
  }

  Game.prototype.updateScore = function (){
    if(this.gameOver === false){
      this.score += 1;
    }
  }

  Game.prototype.draw = function (ctx) {
    this.setBackground(ctx);
    this.displayScore(ctx);
    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
    if(this.gameOver){
      this.displayGameOver(ctx);
    }

  };

  Game.prototype.isOutOfBounds = function (pos, width, height) {
    return (pos[0] + width < 0) || (pos[1] + height < 0) ||
      (pos[0] - width > Game.DIM_X) || (pos[1] - height > Game.DIM_Y);
  };

  Game.prototype.moveObjects = function (delta) {
    this.allObjects().forEach(function (object) {
      object.move(delta);
    });
  };

  Game.prototype.movePlayer = function (delta) {
    this.players[0].move(delta);
  };

  Game.prototype.randomPosition = function () {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  };

  Game.prototype.step = function (delta) {
    this.moveObjects(delta);
    this.checkCollisions();
  };

  Game.prototype.wrap = function (pos) {
      return [
        wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
      ];

      function wrap(coord, max) {
        if (coord < 0) {
          return max - (coord % max);
        } else if (coord > max) {
          return coord % max;
        } else {
          return coord;
        }
      }
    };

    Game.prototype.checkCollisions = function () {
        var game = this;

        //use collideWith on each class to handle different implementations
        //for different objects
        //disappear ghosts with light beam
        // remove player if ghost hits.
        this.allObjects().forEach(function (obj1) {
          game.allObjects().forEach(function (obj2) {
            // don't allow self-collision
            // debugger
            if (obj1 != obj2 && obj1.isCollidedWith(obj2)) {
              obj1.collideWith(obj2);
            }
          });
        });

      };

      Game.prototype.remove = function (object) {
        //fix flash light removal.
        if (object instanceof Phantoms.Flashlight) {
          this.flashlights.splice(this.flashlights.indexOf(object), 1);
        } else if (object instanceof Phantoms.Phantom) {
          var idx = this.phantoms.indexOf(object);
          this.phantoms[idx] = new Phantoms.Phantom({ game: this });
        } else if (object instanceof Phantoms.Player) {
          this.players.splice(this.players.indexOf(object), 1);
        } else {
          throw "does not exist";
        }
      };

})();
