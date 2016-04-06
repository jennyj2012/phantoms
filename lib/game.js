(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Game = Phantoms.Game = function () {
    this.imageResources = this.loadResources();
    this.phantoms = [];
    this.players = [];
    this.flashlights = [];
    this.score = 0;
    this.gameOver = false;
    this.playing = false;
    this.addPhantoms();
  };

  Game.BG_COLOR = "#000000";
  Game.DIM_X = window.innerWidth;
  Game.DIM_Y = window.innerHeight;
  Game.FPS = 32;
  Game.NUM_PHANTOMS = Math.ceil(Game.DIM_Y * Game.DIM_X / 100000) || 1;

  Game.prototype.togglePlaying = function () {
    this.playing ? this.playing = false : this.playing = true;
  };

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

  Game.prototype.loadResources = function () {
    var instructionMap = {
      bg: "./images/threejs-campfire.png",
      move: "./images/rules-flashlight-move.png",
      rotate: "./images/rules-flashlight-rotate.png",
      stop: "./images/rules-flashlight-stop.png",
      flash: "./images/rules-flashlight-flash.png",
      avoid: "./images/rules-ghost.png",
    };

    Object.keys(instructionMap).forEach(function (key) {
      var image = new Image();
      image.src = instructionMap[key];
      instructionMap[key] = image;
    }.bind(this));

    return instructionMap;
  };

  Game.prototype.setBackground = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    ctx.save();
    ctx.drawImage(this.imageResources.bg, 0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.restore();
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
    ctx.fillText("Game Over", (Game.DIM_X / 2) - 175, Game.DIM_Y / 2);
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Game Over", (Game.DIM_X / 2) - 175, Game.DIM_Y / 2);

    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Press Enter", (Game.DIM_X / 2) - 100, (Game.DIM_Y / 2) + 40);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Press Enter", (Game.DIM_X / 2) - 100, (Game.DIM_Y / 2) + 40);
  }

  Game.prototype.displayInstructions = function (ctx) {
    this.setBackground(ctx);

    ctx.drawImage(this.imageResources.flash, (Game.DIM_X / 2) - 200, (Game.DIM_Y / 2) - 150, 150, 150);
    ctx.drawImage(this.imageResources.avoid, (Game.DIM_X / 2) + 50, (Game.DIM_Y / 2) - 125, 125, 125);

    ctx.drawImage(this.imageResources.move, (Game.DIM_X / 2) - 305, (Game.DIM_Y / 2) + 150, 125, 135);
    ctx.drawImage(this.imageResources.stop, (Game.DIM_X / 2) - 80, (Game.DIM_Y / 2) + 150, 125, 135);
    ctx.drawImage(this.imageResources.rotate, (Game.DIM_X / 2) + 155, (Game.DIM_Y / 2) + 150, 125, 135);


    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Press Enter to Start", (Game.DIM_X / 2) - 150, (Game.DIM_Y / 2) + 75);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Press Enter to Start", (Game.DIM_X / 2) - 150, (Game.DIM_Y / 2) + 75);

  }


  Game.prototype.updateScore = function (){
    if(this.gameOver === false){
      this.score += 100;
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
