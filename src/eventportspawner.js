goog.provide("pl.EventPortSpawner");
goog.provide("pl.EventPortSpawner.EventType");

goog.require("goog.events.EventHandler");

/**
 * The port spawner. It accpets connection requests and spawns a new port for that specific connection.
 * @constructor
 */
pl.EventPortSpawner = function(channel, name) {
  this.channel_ = channel;
  this.name_ = name;

  this.getHandler()
    .listen(document.documentElement, this.getChannel(), this.channelHandler_, false);
};

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
 * Attempts to handle the channel event.
 * @param {goog.events.BrowserEvent} e The event.
 * @private
 */
pl.EventPortSpawner.prototype.channelHandler_ = function(e) {
  var browserEvent = e.getBrowserEvent();
  var detail = goog.json.parse(browserEvent['detail']);

  if (detail['type'] === pl.Port.MethodType.REQUEST_CONNECTION && detail['data'] === this.getName()) {
    var port = new pl.EventPort(this.getChannel());
    port.handleRequestConnection(detail);

    if (port.getReceiverId()) {
      var evt = new goog.events.Event(pl.EventPortSpawner.EventType.PORT_SPAWNED, this);
      evt.detail = port;
      this.dispatchEvent(evt);
    }
  }
};
