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
