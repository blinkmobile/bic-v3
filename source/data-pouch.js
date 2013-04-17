define(
  ['backbone', 'api-xhr', 'pouchdb', 'jquery'],
  function (Backbone, API, Pouch, $) {
    "use strict";
    var data = {
      getModel: function (model, options) {
        var done, fail, jqXHR, fetch, dbType, createDocument, retrieveDocument, doc;

        done = function (data, status, xhr) {
          options.success(data);
        };

        fail = function (xhr, status, error) {
          if (options.error) {
            options.error(model, xhr, options);
          }
        };

        fetch = function () {
          switch (model.get("BICtype")) {
          case "Interaction":
            jqXHR = API.getInteraction(model.get('siteName'), model.get('_id'), model.get('args')).done(done).fail(fail);
            break;
          case "AnswerSpace":
            jqXHR = API.getAnswerSpace(model.get('siteName')).done(done).fail(fail);
            break;
          case "DataSuitcase":
            jqXHR = API.getDataSuitcase(model.get('siteName'), model.get("_id")).done(done).fail(fail);
            break;
          case "Form":
            jqXHR = API.getForm(model.get('siteName'), model.get("_id")).done(done).fail(fail);
            break;
          default:
            options.error(model, null, options);
            jqXHR = null;
            break;
          }
          jqXHR.then(function (data, textStatus, jqXHR) {
            options.dfrd.resolve(data, textStatus, jqXHR);
          }, function (jqXHR, textStatus, errorThrown) {
            options.dfrd.reject(jqXHR, textStatus, errorThrown);
          });
        };

        if (window.NativeApp === true && Pouch.adapters.websql) {
          dbType = 'websql://';
        } else {
          if (Pouch.adapters.idb) {
            dbType = 'idb://';
          } else {
            dbType = false;
          }
        }

        createDocument = function (jqXHR, revision) {
          jqXHR.done(function (data, textStatus, jqXHR) {
            var db = new Pouch(dbType + model.get('siteName') +  '-' + model.get('BICtype'), function (err, db) {
              if (!err) {
                var d = new Date();

                if (revision) {
                  data._rev = revision;
                }

                db.put(data, function (err, response) {});
              }
            });
          });
        };

        retrieveDocument = function () {
          var docdfrd = $.Deferred(), db;
          db = new Pouch(dbType + model.get('siteName') +  '-' + model.get('BICtype'), function (err, db) {
            var d = new Date();
            if (err) {
              docdfrd.reject(err);
            } else {
              if (!model.has("_id")) {
                docdfrd.reject();
              } else {
                db.get(model.get('_id'), function (err, doc) {
                  if (err) {
                    docdfrd.reject();
                  } else {
                    if (doc.deviceCacheTime === 0) {
                      docdfrd.resolve(doc);
                    } else if (model.has("args")) {
                      docdfrd.reject('Interaction has arguments', doc);
                    } else if ((d.getTime() - doc.fetchTime) < (doc.deviceCacheTime * 1000)) {
                      docdfrd.resolve(doc);
                    } else {
                      docdfrd.reject('Interaction too old', doc);
                    }
                  }
                });
              }
            }
          });
          return docdfrd.promise();
        };

        if (dbType !== false) {
          retrieveDocument().then(function (doc) {
            options.dfrd.resolve(doc);
            options.success(model, doc, options);
          }, function (err, doc) {
            fetch();

            var revision;
            if (doc) {
              revision = doc._rev;
            }
            createDocument(jqXHR, revision);
          });
        } else {
          fetch();
        }
      }
    };

    Backbone.sync = function (method, model, options) {
      options.dfrd = $.Deferred();
      data.getModel(model, options);
      return options.dfrd.promise();
    };
    return Backbone;
  }
);
