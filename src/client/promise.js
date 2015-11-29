goog.provide("pl.Promise");

goog.require("goog.Promise");

/**
 * @define {boolean} Whether to use the native Promise or the goog.Promise.
 */
goog.define("pl.useNativePromise", false);

if (pl.useNativePromise) {
  pl.Promise = Promise;
} else {
  pl.Promise = goog.Promise;
}
