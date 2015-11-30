goog.provide("pl.utils");

/**
 * Returns true if the object is a Promise.
 * @return {boolean} True if the object is a Promise.
 */
pl.utils.isPromise = function(obj) {
  // The obj needs to be an object.
  if (!obj || typeof obj !== "object") return false;

  // If the obj has a function called `then` then it qualifies as a Promise.
  return ("then" in obj && typeof obj["then"] === "function");
};

/**
 * Returns a random string.
 * @param {number} length The length of the random string.
 * @param {string=} opt_chars The chars the string can contains.
 * @return a random string.
 */
pl.utils.generateString = function(length, opt_chars) {
  var chars = opt_chars || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
  var charsLength = chars.length;
  var str = "";
  while (length--) {
    str += chars[Math.floor(Math.random() * charsLength)];
  }

  return str;
};
