goog.provide("pl.test.content");

goog.require("pl.EventPort");

goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");

var script = goog.dom.createDom(goog.dom.TagName.SCRIPT, {
  'src': chrome.extension.getURL("page.js"),
  'type': 'text/javascript'
});
var handler = new goog.events.EventHandler();
handler.listen(script, goog.events.EventType.LOAD, function(){
  var port = pl.EventPort.connect("pl-channel", "pl-page-spawner");
  if (port) {
    console.log(port.callMethod("multiply", 2, 3));

    port.callMethod("promiseMe", "to do the dishes")
    .then(function(done){
      console.log(done);
    });
  } else {
    console.log("Port was not connected!");
  }

  handler.dispose();
});

(document.body || document.head || document.documentElement).appendChild(script);
