(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.portlib = factory();
  }
}(this, function () {
  var module = {};
  (function(window){%output%})(module);

  return module['exports'];
}));
