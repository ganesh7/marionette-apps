
var ContextManager = require(__dirname + '/contextmanager'),
    GeckoObject = require(__dirname + '/geckoobject');


/**
 * @constructor
 * @param {Marionette.Client} client Marionette client to use.
 */
function App(client) {
  GeckoObject.apply(this, arguments);
  this._client = client;
  this._contextManager = new ContextManager(this._client);
}
module.exports = App;


App.prototype = {
  __proto__: GeckoObject.prototype,


  /**
   * @type {Marionette.Client}
   * @private
   */
  _client: undefined,


  /**
   * @type {ContextManager}
   * @private
   */
  _contextManager: undefined,


  /**
   * The origin of the site that triggered the installation of the app.
   * @type {string}
   */
  installOrigin: undefined,


  /**
   * The time that the app was installed.
   * This is generated using Date().getTime(),
   * represented as the number of milliseconds
   * since midnight of January 1st, 1970.
   * @type {number}
   */
  installTime: undefined,


  /**
   * The currently stored instance of the manifest of the app.
   * @type {Object}
   */
  manifest: undefined,


  /**
   * Where the manifest was found.
   * @type {string}
   */
  manifestURL: undefined,


  /**
   * The origin of the app (protocol, host, and optional port number).
   * For example: http://example.com.
   * @type {string}
   */
  origin: undefined,


  /**
   * An object containing an array of one or more receipts.
   * Each receipt is a string. If there are no receipts, this is null.
   * @type {Object}
   */
  receipts: undefined,


  checkForUpdate: function() {
    throw 'Not yet implemented';
  },


  /**
   * Launches the application. Does not return any value.
   */
  launch: function() {
    this._contextManager.saveContext();
    this._contextManager.setContext('content');
    this._client.executeAsyncScript(function(id) {
      var ObjectCache = window.wrappedJSObject.ObjectCache;
      var app = ObjectCache._inst.get(id);
      app.launch();
      marionetteScriptFinished();
    }, [this._id], (function(err) {
      if (err) {
        throw err;
      }

      this._contextManager.restoreContext();
    }).bind(this));
  }
};
