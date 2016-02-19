(function () {
  if (typeof Phantoms === "undefined") {
    window.Phantoms = {};
  }

  var Util = Phantoms.Util = {};

  var scaledDir = Util.scaledDir = function (vel, speed) {
    //multiply by inverse to get direction length of 1
    var scaled = vel.map( function (el) {
      if(el != 0){
        return el = el * (1 / Math.abs(el));
      } else {
        return el;
      }
    });
    return Util.scale(scaled, speed);
  };

  // Normalize the length of the vector speed, maintaining direction.
  var normDir = Util.normDir = function (vec) {
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  };

  var norm = Util.norm = function (vec) {
    return Util.dist([0, 0], vec);
  };

//  Find distance between two points (aka length needed to normalize)
  var dist = Util.dist = function (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  };

// Find the coordinate distance between two points. (adjacent & opposite)
  var coordDist = Util.coordDist = function (pos1, pos2) {
      return [ pos1[0] - pos2[0], pos1[1]-pos2[1] ];
  }

  // Return a randomly oriented vector with the given length.
  //so that ghosts will travel in random directions.
  var randomVec = Util.randomVec = function (length) {
    var rad = 2 * Math.PI * Math.random(); //radians

    return scale([Math.sin(rad), Math.cos(rad)], length);
  };

  // Scale the length of a vector/velocity array by the given amount.
  var scale = Util.scale = function (vel, m) {
    return [vel[0] * m, vel[1] * m];
  };

  var inherits = Util.inherits = function (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  var degToRadians = Util.degToRadians = function (angle){
    return angle * (Math.PI / 180);
  };

//inclusive
  var isBetween = Util.isBetween = function (x, array){
    minAndMax = minMax(array);
    return (x >= minAndMax[0] && x <= minAndMax[1]);
  };

//takes a set of ranges and checks for inclusion. Returns true/false;
  var isInRangeofSets = Util.isInRangeofSets = function (x, ranges) {
    var included = false;

    ranges.forEach(function (range) {
      if (isBetween(x, range)) {
        included = true;
      }
    });

    return included;
  };

//[[left, top], [right, top], [right, bottom], [left, bottom]]
  var regularVerticies = Util.regularVerticies = function (object) {
    var w = object.width / 2, h = object.height / 2;
    var x = object.pos[0], y = object.pos[1];
    return [[x - w, y - h],[x + w, y - h],[x + w, y + h],[ x - w, y + h]];
  };

//return a rotated image vertcies
  var rotatedVerticies = Util.rotatedVerticies = function (object) {
    var theta = object.angle;
    var quads = [[0, 90], [180, 270]];
    var matrix;

    if (isInRangeofSets(object.angle, quads)) {
      matrix = [1, -1, 1, 1]
    } else {
      matrix = [1, 1, -1, 1];
    };

    return regularVerticies(object).map( function (pos) {
      return pos = rotatedVertex(pos, object.pos, theta, matrix);
    });
  };

  var zip = Util.zip = function (arrays) {
      return arrays[0].map( function(_,i) {
          return arrays.map( function(array) {
            return array[i];
          })
      });
  };

  //return min max of array
  var minMax = Util.minMax = function (array) {
    return [Math.min(...array), Math.max(...array)];
  }

  var rotatedVertex = function (pos, origin, theta, matrix){
      var cos = Math.cos(degToRadians(theta)),
          sin = Math.sin(degToRadians(theta));

      var x = ((pos[0]-origin[0]) * cos * matrix[0]) + ((pos[1]-origin[1]) * sin * matrix[1]) + origin[0],
          y = ((pos[0]-origin[0]) * sin * matrix[2]) + ((pos[1]-origin[1]) * cos * matrix[3]) + origin[1];
      return [Math.abs(x), Math.abs(y)];
    }



})();
