goog.provide("pl.test.page");

goog.require("pl.EventPortSpawner");

pl.test.page = new pl.EventPortSpawner("pl-channel", "pl-page-spawner");

pl.test.page.listen(pl.EventPortSpawner.EventType.PORT_SPAWNED, function(e){
  var port = e.detail;
  port.setMethod("multiply", function(a, b){
    return a * b;
  });
  port.setMethod("promiseMe", function(task){
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve(task + " is done.");
      }, 2000);
    });
  });
});
