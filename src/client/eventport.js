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
 * @param {Object=} opt_methods The methods the external ports can call.
 * @param {string=} opt_name
 * @extends {pl.Port}
 */
pl.EventPort = function(channel, opt_methods, opt_name) {
  if (pl.support.CustomEvent === pl.support.State.NONE) throw new Error("CustomEvent not supported.");
  pl.Port.call(this, opt_methods, opt_name);

  this.channel_ = channel;

  this.getHandler()
    .listen(document.documentElement, this.getChannel(), this.channelHandler_, false);
}
goog.inherits(pl.EventPort, pl.Port);

/**
 * Returns the connected port.
 * @param {string} channel The channel to communicate through.
 * @param {string} name The name of the external port.
 * @param {Object=} methods The methods the external ports can call.
 * @return {pl.EventPort} The connected port.
 */
pl.EventPort.connect = function(channel, name, methods) {
  var port = new pl.EventPort(channel, methods);
  if (port.connect(name)) {
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
  if (pl.support.CustomEvent === pl.support.State.FULL) {
    evt = new CustomEvent(this.getChannel(), { 'detail': goog.json.serialize(detail) });
  } else if (pl.support.CustomEvent === pl.support.State.PARTIAL) {
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
