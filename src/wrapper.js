(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.portlib = factory();
  }
}(this, function () {
  var portlibModule = {};
  var fn = function(window, selfFunction){ %output% };
  (fn)(portlibModule, fn);

  return portlibModule['exports'];
}));
