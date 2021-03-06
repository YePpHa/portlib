goog.provide("pl.EventPortSpawner");
goog.provide("pl.EventPortSpawner.EventType");

goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");

goog.require("goog.json");

goog.require("pl.Port");
goog.require("pl.EventPort");

/**
 * The port spawner. It accpets connection requests and spawns a new port for that specific connection.
 * @constructor
 * @param {string} channel The channel.
 * @param {string} name The name of the event port spawner that will be given to its spawned ports.
 * @param {Object=} opt_methods The methods that will be callable.
 * @extends {goog.events.EventTarget}
 */
pl.EventPortSpawner = function(channel, name, opt_methods) {
  goog.base(this);
  this.channel_ = channel;
  this.name_ = name;
  this.methods_ = opt_methods;

  this.getHandler()
    .listen(document.documentElement, this.getChannel(), this.channelHandler_, false);
};
goog.inherits(pl.EventPortSpawner, goog.events.EventTarget);

/**
 * @enum {!string}
 */
pl.EventPortSpawner.EventType = {
  /** Whenever a port has been spawned */
  PORT_SPAWNED: 'port-spawned'
};

/**
 * @private {goog.events.EventHandler}
 */
pl.EventPortSpawner.prototype.handler_;

/**
 * @private {string}
 */
pl.EventPortSpawner.prototype.channel_;

/**
 * @private {string}
 */
pl.EventPortSpawner.prototype.name_;

/**
 * @private {Object}
 */
pl.EventPortSpawner.prototype.methods_;

/**
 * @override
 */
pl.EventPortSpawner.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  if (this.handler_) {
    this.handler_.dispose();
    delete this.handler_;
  }

  delete this.channel_;
  delete this.name_;
};

/**
 * Returns the event handler.
 * @protected
 * @return {goog.events.EventHandler} The event handler.
 */
pl.EventPortSpawner.prototype.getHandler = function() {
  if (!this.handler_) {
    this.handler_ = new goog.events.EventHandler(this);
  }
  return this.handler_;
};

/**
 * Returns the channel.
 * @return {string} The channel.
 */
pl.EventPortSpawner.prototype.getChannel = function() {
  return this.channel_;
};

/**
 * Returns the name.
 * @return {string} The name.
 */
pl.EventPortSpawner.prototype.getName = function() {
  return this.name_;
};

/**
 * Returns the methods.
 * @param {string} name The method name.
 * @return {function} The method.
 */
pl.EventPortSpawner.prototype.getMethod = function(name) {
  return this.methods_[name];
};

/**
 * Returns the methods.
 * @return {Object=} The methods.
 */
pl.EventPortSpawner.prototype.getMethods = function() {
  return this.methods_;
};

/**
 * Remove the method.
 * @param {string} method The method name to remove.
 * @return {boolean} Whether the method was removed.
 */
pl.EventPortSpawner.prototype.removeMethod = function(method) {
  if (method in this.methods) {
    delete this.methods[method];
    return true;
  }
  return false;
};

/**
 * Attempts to handle the channel event.
 * @param {goog.events.BrowserEvent} e The event.
 * @private
 */
pl.EventPortSpawner.prototype.channelHandler_ = function(e) {
  var browserEvent = e.getBrowserEvent();
  var detail = goog.json.parse(browserEvent['detail']);

  if (detail['type'] === pl.Port.MethodType.REQUEST_CONNECTION && detail['data'] === this.getName()) {
    var port = new pl.EventPort(this.getChannel(), this.getMethods(), this.getName());
    port.handleRequestConnection(detail);

    if (port.getReceiverId()) {
      var evt = new goog.events.Event(pl.EventPortSpawner.EventType.PORT_SPAWNED, this);
      evt.detail = port;
      this.dispatchEvent(evt);
    }
  }
};
