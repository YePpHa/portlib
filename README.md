# Port Library
Port Library is a JavaScript library that can create a synchronous connection
between two sandboxes as long as the two sandboxes have access to the same event
pool. The library was created for content scripts (userscripts) needing a direct
pipeline to the page sandbox.

## Dependencies
The library is dependent on
[Google Closure Library](https://github.com/google/closure-library/).

## Build
Currently the build system of the library is only for building the test
extension for Chrome to test if the synchronous and asynchronous methods work.

To build the test please make sure you have downloaded all the Dependencies by
calling:
```
$ npm install
$ bower install
```
If you don't know what npm is or what Bower is please see
[Node](https://nodejs.org/en/) and [Bower](http://bower.io/).

Please note that the build system uses
[Google Closure Compiler](https://developers.google.com/closure/compiler/),
which depends on Java.

## Browser Support
The only browser dependency is the support of the
[Custom Event API](http://caniuse.com/#feat=customevent).

## Tested in
Currently tested in:
 * Chrome v46

### Limitations
Port Library makes it easy to create a pipeline to the page sandbox. However,
there are some limitations. The limitations are as follows:
 * All objects that are transferred through the Port Library will be serialized,
   which means that objects that can't be serialized will throw an error. Also
   serialized instances of classes will not be restored i.e. an instance of the
   Date class will only be an object with the values of the Date instance when
   it has been serialized.
 * It's not possible to transfer functions as they can't be serialized. If your
   function is asynchronous you need to return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
   instead.

## Examples
### Port Spawner
In the example below, there are two sandboxes: the page sandbox and the content
script sandbox. Here the content sandbox creates two different ports to the page
sandbox.
```JavaScript
// File: page.js
var spawner = new pl.EventPortSpawner("channel", "name");
spawner.listen(pl.EventPortSpawner.EventType.PORT_SPAWNED, function(port) {
  // Handle spawned ports, e.g. set the port's methods.
});

// File: content.js
var port = pl.EventPort.connect("channel", "name");
var port2 = pl.EventPort.connect("channel", "name");
```

### Using methods
```JavaScript
// File: page.js
var extPort = ...;
extPort.setMethod("external-multiply", function(a, b) {
  return a * b;
});

// File: content.js
var port = ...;
var returnValue = port.callMethod("external-multiply", 3, 7);

console.log(returnValue); // output: 21.
```

### Using promises
Port library supports returning of Promises in the methods.
```JavaScript
// File: page.js
var extPort = ...;
extPort.setMethod("async-load", function(url) {
  return promiseXhr(url); // Returns a Promise, which will resolve on load.
});

// File: content.js
var port = ...;
port.callMethod("async-load", "https://www.google.com/")
.then(function(html) {
  console.log(html); // The HTML of https://www.google.com/
});
```

## API Docs
The docs can be generated by running:
```
$ npm run-script generate-docs
```
The generated docs can be found in `./docs` or you can use the pre-generated
docs at http://yeppha.github.io/docs/portlib/1.0.1/index.html.

## Todo
 * Compile the library for people not using Google Closure.
 * Implement proper error catching if an error occurs in a function.
 * Make the user pick what Promise library they want to use or if they want
   to use the native Promise API implemented by the browser. Currently the
   library uses
   [goog.Promise](http://google.github.io/closure-library/api/class_goog_Promise.html)
   for Promises to support older browsers.
