goog.provide("pl.test.content");

goog.require("pl.EventPort");

goog.require("goog.dom");
goog.require("goog.dom.TagName");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventType");

// Prepare injecting the page script into the page.
var script = goog.dom.createDom(goog.dom.TagName.SCRIPT, {
  'src': chrome.extension.getURL("page.js"),
  'type': 'text/javascript'
});

// We need to attach a load event to the script element to know when to connect the port.
var handler = new goog.events.EventHandler();
handler.listen(script, goog.events.EventType.LOAD, function(){
  // Connecting the port.
  var port = pl.EventPort.connect("pl-channel", "pl-page-spawner");

  // Check if the port was connected.
  if (port) {
    console.log(port.callMethod("multiply", 2, 3));

    port.callMethod("promiseMe", "to do the dishes")
    .then(function(done){
      console.log(done);
    });
  } else {
    console.log("Port was not connected!");
  }

  // Dispose the event handler as it's not needed anymore.
  handler.dispose();
});

// Injecting the page script into the page.
(document.body || document.head || document.documentElement).appendChild(script);
