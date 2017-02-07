# Port Library

[![Greenkeeper badge](https://badges.greenkeeper.io/YePpHa/portlib.svg)](https://greenkeeper.io/)
Port Library is a JavaScript library that can create a synchronous connection
between two sandboxes as long as the two sandboxes have access to the same event
pool. The library was created for content scripts (userscripts) needing a direct
pipeline to the page sandbox.

## Build
### Build preparation.
The library can be build to use with a non-closure library. To build the library
you need to have installed the following tools:
 * [Node](https://nodejs.org/en/)
 * [Bower](http://bower.io/)
 * [Gulp](http://gulpjs.com/)

Afterwards, you need to make sure that you have downloaded all the dependencies:
```
$ npm install
$ bower install
```

After that you're all set.

### Library building
You can build the Port Library using gulp:
```
$ gulp build
```
A new file will be created at `./dist/portlib.js`.

Please note that the library by default uses the Google Promise library provided
by the
[Google Closure Library](http://google.github.io/closure-library/api/class_goog_Promise.html).
If you don't want to use the Promise library by Google you can add the argument
'--useNativePromise' to only use the native Promise in the browser. The Promise
used by the library can accessed from `portlib.Promise`.

### Test build
To build
```
$ gulp chrome-test
$ gulp userscript-test
```

Please note that the build system uses
[Google Closure Compiler](https://developers.google.com/closure/compiler/),
which depends on Java.

## Browser Support
The only browser dependency is the support of the
[Custom Event API](http://caniuse.com/#feat=customevent).

## Tested in
Currently tested in:
 * Chrome v46 (with Tampermonkey and a Chrome extension)
 * Firefox v39, v41 and v42 (with Greasemonkey)

### Limitations
Port Library makes it easy to create a pipeline to the page sandbox. However,
there are some limitations. The limitations are as follows:
 * All objects that are transferred through the Port Library will be serialized,
   which means that objects that can't be serialized will throw an error. Also
   serialized instances of classes will not be restored i.e. an instance of the
   Date class will only be an object with the values of the Date instance when
   it has been serialized.
 * It's not possible to transfer functions as they can't be serialized. If your
   function is asynchronous you need to return a
   [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
   instead.

## Port Library module
To use the Port Library you need to require the `./dist/portlib.js` file in your
project. See [Library building](#library-building) for more info on how to build
the file.

This version of the Port Library uses the namespace `portlib`, where all its API
are located under.

### Library API
__More to be added.__

#### Static methods
##### portlib.inject
The inject method is used to inject a function into the page, which is connected
through the port that is returned by the function. The injected port doesn't
have access to the same scope as if it has been called directly. It's being
converted into a string, which is then evaled on the page.
* param function(pl.Port, pl.exports) The function to inject.
* param Object The methods of the port returned by the function. (optional)
* return pl.Port The port connecting the injected function.

###### Example
```JavaScript
function injectFn(port, portlib) {

}

var port = portlib.inject(injectFn);
//
```

#### portlib.Port
TBA

#### portlib.Port.EventType
TBA

#### portlib.EventPort
TBA

#### portlib.EventPortSpawner
TBA

#### portlib.Promise

## Google Closure
### Examples
#### Port Spawner
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

#### Using methods
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

#### Using promises
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

### API Docs (for those who use Google Closure)
The docs can be generated by running:
```
$ npm run-script generate-docs
```
The generated docs can be found in `./docs` or you can use the pre-generated
docs at http://yeppha.github.io/docs/portlib/1.0.2/index.html.

## Todo
* Compile the library for people not using Google Closure.
  * Properly define what is exported.
  * Create an inject method like in
    [UserProxy](https://github.com/YePpHa/UserProxy) for smaller userscripts.
* Implement proper error catching if an error occurs in a function.
* Make the user pick what Promise library they want to use or if they want
  to use the native Promise API implemented by the browser. Currently the
  library uses
  [goog.Promise](http://google.github.io/closure-library/api/class_goog_Promise.html)
  for Promises to support older browsers.

## License
The MIT License (MIT)

Copyright (c) 2015 Jeppe Rune Mortensen

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
