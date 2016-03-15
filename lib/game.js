(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Game = Phantoms.Game = function () {
    this.image = this.loadResources();
    this.phantoms = [];
    this.players = [];
    this.flashlights = [];
    this.score = 0;
    this.gameOver = false;
    this.addPhantoms();
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = window.innerWidth;
  Game.DIM_Y = window.innerHeight;
  Game.FPS = 32;
  Game.NUM_PHANTOMS = Math.ceil(Game.DIM_Y * Game.DIM_X / 100000) || 1;

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
      this.add(new Phantoms.Phantom({
        game: this,
       }));
    }
  };

  Game.prototype.addPlayer = function () {
  var player = new Phantoms.Player({
    game: this,
  });

  this.add(player);
  return player;
};

  Game.prototype.allObjects = function () {
    return [].concat(this.phantoms, this.flashlights, this.players);
  };

  Game.prototype.loadResources = function (callback) {
    var image = new Image();
    image.src = "./images/threejs-campfire.png";
      return image;
    };

  Game.prototype.setBackground = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

      ctx.save();
      ctx.drawImage(this.image, 0, 0, Game.DIM_X, Game.DIM_Y);
      ctx.restore();

      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("Don't let the ghosts get too close!", 50, Game.DIM_Y - 100);
      ctx.fillText("Press the 'space bar' to shine the flashlight,", 50, Game.DIM_Y - 80);
      ctx.fillText("the up arrow to move in the direction you're facing,", 50, Game.DIM_Y - 60);
      ctx.fillText("and the left and right arrow keys to rotate.", 50, Game.DIM_Y - 40);
  }

  Game.prototype.displayScore = function (ctx) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + this.score, Game.DIM_X - 200, 40);
  }

  Game.prototype.displayGameOver = function (ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    ctx.font = "60px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over", Game.DIM_X / 2 - 125, Game.DIM_Y / 2);
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Game Over", Game.DIM_X / 2 - 130, Game.DIM_Y / 2);

    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Press Enter", Game.DIM_X / 2, Game.DIM_Y / 2 + 40);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Press Enter", Game.DIM_X / 2 - 5, Game.DIM_Y / 2 + 40);
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

        //Disappear ghosts with light beam
        // remove player if ghost hits.
        this.allObjects().forEach(function (obj1) {
          game.allObjects().forEach(function (obj2) {
            // don't allow self-collision
            if (obj1 != obj2 && obj1.isCollidedWith(obj2)) {
              obj1.collideWith(obj2);
            }
          });
        });

      };

      Game.prototype.remove = function (object) {
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
