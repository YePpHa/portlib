goog.provide("pl.EventPort");

goog.require("goog.events.EventHandler");

goog.require("goog.json");

goog.require("pl.Port");
goog.require("pl.support.CustomEvent");
goog.require("pl.support.State");

/**
 * The port using the CustomEvent API.
 * @constructor
 * @param {string} channel The channel to communicate through.
 * @param {Object=} methods The methods the external ports can call.
 * @extends {pl.Port}
 */
pl.EventPort = function(channel, methods) {
  if (pl.EventPort.support.CustomEvent === pl.support.State.NONE) throw new Error("CustomEvent not supported.");
  goog.base(this, 'constructor', methods);

  this.channel_ = channel;

  this.getHandler()
    .listen(document.documentElement, this.getChannel(), this.channelHandler_, false);
}
goog.inherits(pl.EventPort, pl.Port);

/**
 * Returns the connected port.
 * @param {string} channel The channel to communicate through.
 * @param {Object=} methods The methods the external ports can call.
 * @return {pl.EventPort} The connected port.
 */
pl.EventPort.connect = function(channel, methods) {
  var port = new pl.EventPort(channel, methods);
  if (port.connect()) {
    return port;
  }
  port.dispose();
  return null;
};

/**
 * @private {string}
 */
pl.EventPort.prototype.channel_;

/**
 * @override
 */
pl.EventPort.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.channel_;
};

/**
 * @override
 */
pl.EventPort.prototype.postMessage_ = function(detail) {
  var evt;
  if (pl.EventPort.support.CustomEvent === pl.support.State.FULL) {
    evt = new CustomEvent(this.getChannel(), { 'detail': goog.json.serialize(detail) });
  } else if (pl.EventPort.support.CustomEvent === pl.support.State.PARTIAL) {
    evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(this.getChannel(), true, true, goog.json.serialize(detail));
  }
  document.documentElement.dispatchEvent(evt);
};

/**
 * Returns the channel.
 * @return {string} The channel.
 */
pl.EventPort.prototype.getChannel = function() {
  return this.channel_;
};

/**
 * Attempts to handle the channel event.
 * @private
 * @param {goog.events.BrowserEvent} e The event.
 */
pl.EventPort.prototype.channelHandler_ = function(e) {
  var browserEvent = e.getBrowserEvent();
  var detail = goog.json.parse(browserEvent['detail']);

  this.handleMessage(detail);
};
