define(['../src/lib/ui-tools'], function (uiTools) {
  'use strict';

  define('lib/ui-tools', function(){
    define('disableElement', function(){
      var aTag;

      beforeEach(function(){
        aTag = document.createElement('a');
        aTag.id = 'submit';
        document.body.appendChild(aTag);
      });

      afterEach(function(){
        document.body.removeChild(aTag);
        aTag = undefined;
      });

      it('should disable the submit button', function(){
        assert.isUndefined($('#submit').attr('disabled'));

        uiTools.disableElement('#submit');

        assert.strictEqual($('#submit').attr('disabled'), 'disabled');
      });

      it('should add the "ui-disabled" class to the element', function(){
        assert.strictEqual($('#submit').hasClass('ui-disabled'), false);

        uiTools.disableElement('#submit');

        assert.strictEqual($('#submit').hasClass('ui-disabled'), true);
      });
    });

    define('enableElement', function(){
      var aTag;

      beforeEach(function(){
        aTag = document.createElement('a');
        aTag.id = 'submit';
        document.body.appendChild(aTag);
        uiTools.disableElement('#submit');
      });

      afterEach(function(){
        document.body.removeChild(aTag);
        aTag = undefined;
      });

      it('should disable the submit button', function(){
        assert.strictEqual($('#submit').attr('disabled'), 'disabled');
        uiTools.enableElement('#submit');
        assert.isUndefined($('#submit').attr('disabled'));
      });

      it('should add the "ui-disabled" class to the element', function(){
        assert.strictEqual($('#submit').hasClass('ui-disabled'), true);

        uiTools.disableElement('#submit');

        assert.strictEqual($('#submit').hasClass('ui-disabled'), false);
      });
    });

  });
});
