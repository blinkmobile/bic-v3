/*jslint browser:true, es5:true, indent:2, nomen:true*/
/*global requirejs, require, define, module*/
/*global $, cordova*/
define(
  [],
  function () {
    "use strict";

    function start() {
      // AJAX Default Options
      /*jslint unparam: true*/
      $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        jqXHR.setRequestHeader('X-Blink-Config',
          JSON.stringify(window.BMP.BIC.siteVars));
      });
      /*jslint unparam: false*/

      require(['model-application']);
    }

    // Delay the app for Cordova
    function init() {
      if (window.BMP.isBlinkGap === true) {
        if (cordova.available === true) {
          start();
        } else {
          // Poll
          window.setTimeout(init(), 1000);
        }
      } else {
        start();
      }
    }

    // Save traditional sync method as ajaxSync
    Backbone.ajaxSync = Backbone.sync;

    // New sync method
    Backbone.dataSync = function (method, model, options) {
      var data, dfrd, promise;
      data = model.data || model.collection.data;
      dfrd = new $.Deferred();
      promise = dfrd.promise();

      switch (method) {
      case "read":
        //promise = model.id !== undefined ? data.read(model) : data.readAll();
        promise = model.id !== undefined ? data.read(model) : data.readAll();
        break;
      case "create":
        promise = data.create(model);
        break;
      case "update":
        promise = data.update(model);
        break;
      case "patch":
        promise = data.update(model);
        break;
      case "delete":
        promise = data.delete(model);
        break;
      }

      promise.then(function (response) {
        if (options.success) {
          options.success(response);
        }
      }, function (response) {
        if (options.error) {
          options.error(response);
        }
      });

      model.trigger('request', model, promise, options);

      return promise;
    };

    // Fallback to traditional sync when not specified
    Backbone.getSyncMethod = function (model) {
      if (model.data || (model.collection && model.collection.data)) {
        return Backbone.dataSync;
      }
      return Backbone.ajaxSync;
    };

    // Hook Backbone.sync up to the data layer
    Backbone.sync = function (method, model, options) {
      return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
    };

    init();
  }
);
