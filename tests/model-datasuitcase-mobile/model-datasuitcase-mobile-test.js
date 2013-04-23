/*global chai:true, describe:true, it:true, before: true, beforeEach:true, after:true, afterEach:true, expect:true, should:true, sinon:true */
define(['../../scripts/model-datasuitcase-mobile.js'],
  function (Model) {
    "use strict";
    describe('Model - DataSuitcase', function () {
      it("should exist", function () {
        should.exist(Model);
      });

      it("should be a constructor function", function () {
        Model.should.be.an.instanceOf(Function);
      });
    });
  });
