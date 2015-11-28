goog.provide("pl.Port");
goog.provide("pl.Port.EventType");
goog.provide("pl.Port.MethodType");

goog.require("goog.Promise");

goog.require("goog.events.Event");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");

goog.require("goog.json");

goog.require("pl.utils");

/**
 * A port can have a one-on-one connection with another port. It's used to easily communicate with across sandboxes.
 * @constructor
 * @abstract
 * @param {Object=} methods The method external ports can call.
 * @extends {goog.events.EventTarget}
 */
pl.Port = function(methods) {
  goog.events.EventTarget.call(this);

  this.uidCounter_ = 0;
  this.id_ = goog.UID_PROPERTY_ + "_" + goog.getUid(this);

  this.methods = methods || {};
  this.methodResults_ = {};
  this.methodPromises_ = {};
};
goog.inherits(pl.Port, goog.events.EventTarget);

/**
 * @enum {!string}
 */
pl.Port.EventType = {
  /** The port has been disconnected. */
  DISCONNECT: 'disconnect'
};

/**
 * @enum {!string}
 */
pl.Port.MethodType = {
  /** The method call */
  METHOD_CALL: 'method-call',
  /** The method return */
  METHOD_RETURN: 'method-return',
  /** The promise resolved */
  PROMISE_RESOLVE: 'promise-resolve',
  /** The promise reject */
  PROMISE_REJECT: 'promise-reject',
  /** The port has been disconnected. */
  DISCONNECT: 'disconnect',
  /** An external port has requested a connection. */
  REQUEST_CONNECTION: 'request-connection',
  /** The connection request has been accepted. */
  ACCEPT_CONNECTION: 'accept-connection'
};

/**
 * The ID of the port.
 * @private {!string}
 */
pl.Port.prototype.id_;

/**
 * The ID of the receiver.
 * @private {!string}
 */
pl.Port.prototype.receiverId_;

/**
 * The method object.
 * @private {Object<string, function>}
 */
pl.Port.prototype.methods;

/**
 * The results of calling a method is set here.
 * @private {Object}
 */
pl.Port.prototype.methodResults_;

/**
 * The results of calling a method is set here.
 * @private {Object}
 */
pl.Port.prototype.methodPromises_;

/**
 * The results of calling a method is set here.
 * @private {Object}
 */
pl.Port.prototype.uidCounter_;

/**
 * @private {goog.events.EventHandler}
 */
pl.Port.prototype.handler_;

/**
 * @override
 */
pl.Port.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  if (this.handler_) {
    this.handler_.dispose();
    delete this.handler_;
  }

  delete this.id_;
  delete this.receiverId_;
  delete this.methods;
  delete this.methodResults_;
  delete this.methodPromises_;
  delete this.uidCounter_;
};

/**
 * Returns the event handler.
 * @return {goog.events.EventHandler} The event handler.
 */
pl.Port.prototype.getHandler = function() {
  if (!this.handler_) {
    this.handler_ = new goog.events.EventHandler(this);
  }
  return this.handler_;
};

/**
 * Returns the port ID.
 * @return {!string} The port ID.
 */
pl.Port.prototype.getId = function() {
  return this.id_;
};

/**
 * Returns the receiver port ID.
 * @return {!string} The port ID.
 */
pl.Port.prototype.getReceiverId = function() {
  return this.receiverId_;
};

/**
 * Set the receiver ID.
 * @param {string} id The receiver ID.
 */
pl.Port.prototype.setReceiverId = function(id) {
  this.receiverId_ = id;
};

/**
 * Disconnect the port and tell the external port to disconnect as well.
 */
pl.Port.prototype.disconnect = function() {
  this.postMessage(pl.Port.MethodType.DISCONNECT, null);

  this.dispose();
};

/**
 * Connect the port.
 * @type {string} name The name of the port.
 * @return {boolean} Whether the port was connected.
 */
pl.Port.prototype.connect = function(name) {
  var detail = {};
  detail['type'] = pl.Port.MethodType.REQUEST_CONNECTION;
  detail['sender'] = this.getId();
  detail['receiver'] = "*";
  detail['data'] = name;

  this.postMessage_(detail);

  return !!this.getReceiverId();
};

/**
 * Call an external method.
 * @param {string} method The name of the external method.
 * @param {...*} var_args The arguments to pass the method.
 * @return {*} Returns the result of the external method.
 */
pl.Port.prototype.callMethod = function(method, var_args) {
  var callId = this.uidCounter_++;

  var data = {
    'id': callId,
    'method': method,
    'args': Array.prototype.slice.call(arguments, 1)
  };

  // Ready the object.
  this.methodResults_[callId] = null;

  // Send the message to the external port.
  this.postMessage(pl.Port.MethodType.METHOD_CALL, data);

  // Retrieve the result of the event.
  var result = this.methodResults_[callId];

  // Clean the temporary reference.
  delete this.methodResults_[callId];

  return result;
};

/**
 * Attempts to handle the message event.
 * @type {Object} detail The detail object.
 * @private
 */
pl.Port.prototype.handleMessage = function(detail) {
  if (detail['sender'] === this.getId() || (detail['receiver'] !== this.getId() && detail['receiver'] !== "*")) return;
  if (detail['type'] === pl.Port.MethodType.ACCEPT_CONNECTION) {
    this.handleAcceptConnection(detail);
  } else if (detail['type'] === pl.Port.MethodType.REQUEST_CONNECTION) {
    this.handleRequestConnection(detail);
  } else if (detail['type'] === pl.Port.MethodType.METHOD_CALL) {
    this.handleMethodCall(detail['sender'], detail['data']);
  } else if (detail['type'] === pl.Port.MethodType.METHOD_RETURN) {
    this.handleMethodReturn(detail['data']);
  } else if (detail['type'] === pl.Port.MethodType.PROMISE_RESOLVE) {
    this.handlePromiseResolve(detail['data']);
  } else if (detail['type'] === pl.Port.MethodType.PROMISE_REJECT) {
    this.handlePromiseReject(detail['data']);
  } else if (detail['type'] === pl.Port.MethodType.DISCONNECT) {
    this.handleDisconnect();
  } else {
    throw new Error("Unknown message received.");
  }
};

/**
 * Attempts to handle the accept connection event.
 * @type {Object} detail The detail object.
 * @private
 */
pl.Port.prototype.handleAcceptConnection = function(detail) {
  if (!this.getReceiverId()) {
    this.setReceiverId(detail['sender']);
  }
};

/**
 * Attempts to handle the request connection event.
 * @type {Object} detail The detail object.
 * @protected
 */
pl.Port.prototype.handleRequestConnection = function(detail) {
  if (!this.getReceiverId()) {
    this.setReceiverId(detail['sender']);
    this.postMessage(pl.Port.MethodType.ACCEPT_CONNECTION, null);
  }
};

/**
 * Attempts to handle the call method event.
 * @type {Object} data The data object.
 * @private
 */
pl.Port.prototype.handleMethodCall = function(receiverId, data) {
  var method = data['method'];
  var args = data['args'];

  var res_data = {};
  res_data['id'] = data['id'];
  res_data['result'] = this.methods[method].apply(null, args);
  res_data['async'] = false;

  // What to do if the result is a Promise.
  if (pl.utils.isPromise(res_data['result'])) {
    res_data['result']
    .then(goog.bind(function(result){
      var promise_data = {};
      promise_data['id'] = data['id'];
      promise_data['result'] = result;
      this.postMessage(pl.Port.MethodType.PROMISE_RESOLVE, promise_data);
    }, this), goog.bind(function(err){
      var promise_data = {};
      promise_data['id'] = data['id'];
      promise_data['result'] = err;
      this.postMessage(pl.Port.MethodType.PROMISE_REJECT, promise_data);
    }, this));
    res_data['result'] = null;
    res_data['async'] = true;
  }

  this.postMessage(pl.Port.MethodType.METHOD_RETURN, res_data, receiverId);
};

/**
 * Attempts to handle the call method event.
 * @type {Object} data The data object.
 * @private
 */
pl.Port.prototype.handleMethodReturn = function(data) {
  var id = data['id'];
  var result = data['result'];

  if (data['async']) {
    this.methodResults_[id] = new goog.Promise(function(resolve, reject){
      this.methodPromises_[id] = [resolve, reject];
    }, this);
  } else {
    this.methodResults_[id] = result;
  }
};

/**
 * Attempts to handle the promise resolve.
 * @type {Object} data The data object.
 * @private
 */
pl.Port.prototype.handlePromiseResolve = function(data) {
  var id = data['id'];
  var result = data['result'];

  this.methodPromises_[id][0](result);
  delete this.methodPromises_[id];
};

/**
 * Attempts to handle the promise reject.
 * @type {Object} data The data object.
 * @private
 */
pl.Port.prototype.handlePromiseReject = function(data) {
  var id = data['id'];
  var result = data['result'];

  this.methodPromises_[id][1](result);
  delete this.methodPromises_[id];
};

/**
 * Attempts to handle the disconnect event.
 * @private
 */
pl.Port.prototype.handleDisconnect = function() {
  this.dispatchEvent(new goog.events.Event(pl.Port.EventType.DISCONNECT));

  // Dispose of this object.
  this.dispose();
};

/**
 * Post a message.
 * @type {Object} detail The message to post.
 * @protected
 */
pl.Port.prototype.postMessage_ = goog.abstractMethod;

/**
 * Post a message to the connected external port.
 * @type {string} type The type of the message.
 * @type {Object} data The data object to send.
 * @type {string=} opt_receiverId The optional receiver ID.
 */
pl.Port.prototype.postMessage = function(type, data, opt_receiverId) {
  var detail = {};
  detail['sender'] = this.getId();
  detail['receiver'] = opt_receiverId || this.getReceiverId();
  detail['type'] = type;
  detail['data'] = data;

  this.postMessage_(detail);
};

/**
 * Set the method.
 * @param {string} method The method name.
 * @param {function} fn The method function.
 */
pl.Port.prototype.setMethod = function(method, fn) {
  this.methods[method] = fn;
};

/**
 * Returns the method function.
 * @param {string} method The method name.
 * @return {function} The method function.
 */
pl.Port.prototype.getMethod = function(method) {
  return this.methods[method];
};

/**
 * Remove the method.
 * @param {string} method The method name to remove.
 * @return {boolean} Whether the method was removed.
 */
pl.Port.prototype.removeMethod = function(method) {
  if (method in this.methods) {
    delete this.methods[method];
    return true;
  }
  return false;
};
