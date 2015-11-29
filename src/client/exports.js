/**
 * @fileoverview Exports file for usage in non-closure projects.
 * @author Jeppe Rune Mortensen <jepperm@gmail.com>
 */

goog.provide("pl.exports");

goog.require("pl.Promise");

goog.require("pl.EventPort");
goog.require("pl.EventPortSpawner");

goog.require("goog.events.Event");

/** Exports for the Promise object */
pl.exports['Promise'] = pl.Promise;
if (!pl.useNativePromise) {
  pl.Promise['all'] = pl.Promise.all;
  pl.Promise['race'] = pl.Promise.race;
  pl.Promise['resolve'] = pl.Promise.resolve;
  pl.Promise['reject'] = pl.Promise.reject;
  pl.Promise.prototype['cancel'] = pl.Promise.prototype.cancel;
  pl.Promise.prototype['then'] = pl.Promise.prototype.then;
  pl.Promise.prototype['thenAlways'] = pl.Promise.prototype.thenAlways;
  pl.Promise.prototype['thenCatch'] = pl.Promise.prototype.thenCatch;
  pl.Promise.prototype['thenVoid'] = pl.Promise.prototype.thenVoid;
}

/** Exports for the Event object */
goog.events.Event.prototype['preventDefault'] = goog.events.Event.preventDefault;
goog.events.Event.prototype['stopPropagation'] = goog.events.Event.stopPropagation;
goog.events.Event.prototype['currentTarget'] = goog.events.Event.currentTarget;
goog.events.Event.prototype['defaultPrevented'] = goog.events.Event.defaultPrevented;
goog.events.Event.prototype['row'] = goog.events.Event.row;
goog.events.Event.prototype['rowNode'] = goog.events.Event.rowNode;
goog.events.Event.prototype['target'] = goog.events.Event.target;
goog.events.Event.prototype['type'] = goog.events.Event.type;

/** Exports the EventPort class and its prototype properties */
pl.exports['EventPort'] = pl.EventPort;
pl.EventPort.prototype['connect'] = pl.EventPort.prototype.connect;
pl.EventPort.prototype['disconnect'] = pl.EventPort.prototype.disconnect;
pl.EventPort.prototype['callMethod'] = pl.EventPort.prototype.callMethod;
pl.EventPort.prototype['getChannel'] = pl.EventPort.prototype.getChannel;
pl.EventPort.prototype['getId'] = pl.EventPort.prototype.getId;
pl.EventPort.prototype['getMethod'] = pl.EventPort.prototype.getMethod;
pl.EventPort.prototype['getMethods'] = pl.EventPort.prototype.getMethods;
pl.EventPort.prototype['getReceiverId'] = pl.EventPort.prototype.getReceiverId;
pl.EventPort.prototype['removeMethod'] = pl.EventPort.prototype.removeMethod;
pl.EventPort.prototype['setMethod'] = pl.EventPort.prototype.setMethod;
pl.EventPort.prototype['setReceiverId'] = pl.EventPort.prototype.setReceiverId;

/** The listenable prototype properties for EventPort */
pl.EventPort.prototype['hasListener'] = pl.EventPort.prototype.hasListener;
pl.EventPort.prototype['listen'] = pl.EventPort.prototype.listen;
pl.EventPort.prototype['listenOnce'] = pl.EventPort.prototype.listenOnce;
pl.EventPort.prototype['removeAllListeners'] = pl.EventPort.prototype.removeAllListeners;
pl.EventPort.prototype['unlisten'] = pl.EventPort.prototype.unlisten;
pl.EventPort.prototype['unlistenByKey'] = pl.EventPort.prototype.unlistenByKey;

/** The disposable prototype properties for EventPort */
pl.EventPort.prototype['dispose'] = pl.EventPort.prototype.dispose;
pl.EventPort.prototype['isDisposed'] = pl.EventPort.prototype.isDisposed;
pl.EventPort.prototype['registerDisposable'] = pl.EventPort.prototype.registerDisposable;

/** Exports for the EventPort static methods */
pl.EventPort['connect'] = pl.EventPort.connect;

/** Exports the EventPortSpawner and its prototype properties */
pl.exports['EventPortSpawner'] = pl.EventPortSpawner;
pl.EventPortSpawner.prototype['getChannel'] = pl.EventPortSpawner.prototype.getChannel;
pl.EventPortSpawner.prototype['getName'] = pl.EventPortSpawner.prototype.getName;
pl.EventPortSpawner.prototype['getMethod'] = pl.EventPortSpawner.prototype.getMethod;
pl.EventPortSpawner.prototype['getMethods'] = pl.EventPortSpawner.prototype.getMethods;
pl.EventPortSpawner.prototype['removeMethod'] = pl.EventPortSpawner.prototype.removeMethod;

/** The listenable prototype properties for EventPortSpawner */
pl.EventPortSpawner.prototype['hasListener'] = pl.EventPortSpawner.prototype.hasListener;
pl.EventPortSpawner.prototype['listen'] = pl.EventPortSpawner.prototype.listen;
pl.EventPortSpawner.prototype['listenOnce'] = pl.EventPortSpawner.prototype.listenOnce;
pl.EventPortSpawner.prototype['removeAllListeners'] = pl.EventPortSpawner.prototype.removeAllListeners;
pl.EventPortSpawner.prototype['unlisten'] = pl.EventPortSpawner.prototype.unlisten;
pl.EventPortSpawner.prototype['unlistenByKey'] = pl.EventPortSpawner.prototype.unlistenByKey;

/** The disposable prototype properties for EventPortSpawner */
pl.EventPortSpawner.prototype['dispose'] = pl.EventPortSpawner.prototype.dispose;
pl.EventPortSpawner.prototype['isDisposed'] = pl.EventPortSpawner.prototype.isDisposed;
pl.EventPortSpawner.prototype['registerDisposable'] = pl.EventPortSpawner.prototype.registerDisposable;

/** Exports the EventPortSpawner EventType enum */
pl.EventPortSpawner['EventType'] = pl.EventPortSpawner.EventType;
pl.EventPortSpawner.EventType['PORT_SPAWNED'] = pl.EventPortSpawner.EventType.PORT_SPAWNED;

/** The window object is not the real window. */
window['exports'] = pl.exports;
