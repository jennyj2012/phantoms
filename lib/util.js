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
      return [ Math.abs(pos2[0] - pos1[0]), Math.abs(pos2[1]-pos2[1]) ];
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

  // var degToRad = Util.degToRad = function (deg) {
  //   return deg * Math.PI / 180;
  // };

  var inherits = Util.inherits = function (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  };
})();
