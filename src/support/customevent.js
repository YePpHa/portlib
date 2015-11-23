goog.provide("pl.support.CustomEvent");

goog.require("pl.support.State");

pl.support.CustomEvent = (function(){
  try {
    var dom = document.createElement("div");
    var evt = new CustomEvent("my-test-custom-event", { "detail": "test-detail" });
    dom.dispatchEvent(evt);
    return pl.support.State.FULL;
  } catch (e) {}

  try {
    var dom = document.createElement("div");
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("my-test-custom-event", true, true, "test-detail");
    dom.dispatchEvent(evt);
    return pl.support.State.PARTIAL;
  } catch (e) {}
  return pl.support.State.NONE;
})();
