goog.provide("pl.test.userscript.page");

goog.require("pl.EventPortSpawner");

// Create an instance of the EventPortSpawner.
pl.test.page = new pl.EventPortSpawner("pl-channel", "pl-page-spawner");

// Listen on ports spawned from the EventPortSpawner.
pl.test.page.listen(pl.EventPortSpawner.EventType.PORT_SPAWNED, function(e){
  // Get the port
  var port = e.detail;

  // Set a port method multiply to multiply the arguments together and return the result.
  port.setMethod("multiply", function(){
    var n = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      n = n * arguments[i]
    }
    return n;
  });

  // A simple async function with a promise.
  port.setMethod("promiseMe", function(task){
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve(task + " is done.");
      }, 2000);
    });
  });
});

// Notify content.js that we're ready.
window.postMessage("pl.test is ready", "*");
