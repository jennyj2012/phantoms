(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Flashlight = Phantoms.Flashlight = function (options) {
    options.color = Flashlight.COLOR;
    options.height = options.height  //y-value on axis
    options.width = options.height * Math.tan(Phantoms.Util.degToRadians(Flashlight.ANGLE_RADIUS)); //x-value on axis
    options.vel = options.vel || [0,0];
    options.pos = options.pos;
    options.angle = options.angle; //degrees
    options.offset = options.offset;

    Phantoms.MovingObject.call(this, options);
  };

  Flashlight.COLOR = "yellow";
  Flashlight.ANGLE_RADIUS = 10; //degrees of width radius

  Phantoms.Util.inherits(Flashlight, Phantoms.MovingObject);
  Flashlight.prototype.isWrappable = false;

  Flashlight.prototype.resetPosition = function (pos) {
    this.pos = pos;
  }

  Flashlight.prototype.draw = function (ctx){
    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';

    ctx.save();
    var angle = Phantoms.Util.degToRadians(this.angle);
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0 - this.width, -this.height);
    ctx.lineTo(0 + this.width, -this.height);
    ctx.fill();
    ctx.rotate(-angle);
    ctx.translate(-this.pos[0], -this.pos[1]);
    ctx.restore();

  };

  Flashlight.prototype.setAngle = function (direction) {
    this.angle = (this.angle + direction) % 360;
    if(this.angle < 0) {
      this.angle = 360 + this.angle;
    }
  };

  Flashlight.prototype.collideWith = function (otherObject) {
    this.game.updateScore();
    this.game.remove(otherObject);
  };

  Flashlight.prototype.isCollidedWith = function (otherObject) {
    if(otherObject instanceof Phantoms.Phantom){
      var collided = false;
      var ghostVerticies = Phantoms.Util.regularVerticies(otherObject);
      var ghostToPointAngles = []

      var rightBeam = (this.angle + Flashlight.ANGLE_RADIUS) % 360;
      var leftBeam = (this.angle - Flashlight.ANGLE_RADIUS) % 360;
        if(leftBeam < 360){
          leftBeam = 360 + leftBeam;
        }

      var corners = [];
      var quads = [[0, 90], [180, 270]];
      if(Phantoms.Util.isInRangeofSets(this.angle, quads)){
        corners = [ghostVerticies[0], ghostVerticies[2]];
      } else {
        corners = [ghostVerticies[1], ghostVerticies[3]];
      }

      corners.forEach(function (point) {
        var dist = Phantoms.Util.dist(point, this.pos);

        if(dist <= this.height) {
          var coordDist = Phantoms.Util.coordDist(point, this.pos);
          var angle = Math.atan2(coordDist[0], coordDist[1]) * (180 / Math.PI);

            if(angle >= 0){
              ghostToPointAngles.push(180 - angle);
            } else {
              ghostToPointAngles.push(Math.abs(-180 + angle));
            }
        }
      }.bind(this));

      ghostToPointAngles.forEach(function (ghostAngle) {
        if(Math.abs(rightBeam - leftBeam) < 180){
          if(Phantoms.Util.isBetween(ghostAngle, [leftBeam, rightBeam])) {
            collided = true;
          }
        } else {
          if (
            Phantoms.Util.isBetween(ghostAngle, [leftBeam, 360]) ||
            Phantoms.Util.isBetween(ghostAngle, [0, rightBeam])) {
              collided = true;
          }
        }

      }.bind(this));

      return collided;
    } else {
      return false;
    }
  };

  })();
