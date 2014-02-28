/*global google: true */
define(
  ['text!template-interaction.mustache', 'view-form', 'model-application', 'view-category', 'model-star', 'view-star', 'view-madl', 'view-xslt', 'view-prompt'],
  function (Template, FormView, app, CategoryView, StarModel, StarView, MadlView, XsltView, PromptView) {
    "use strict";
    var InteractionView = Backbone.View.extend({

      initialize: function () {
        $('body').append(this.$el);
        window.BMP.BIC3.view = this;
      },

      events: {
        // Old Blink Link Shortcut Methods
        "click [keyword]" : "blinklink",
        "click [interaction]" : "blinklink",
        "click [category]" : "blinklink",
        "click [masterCategory]" : "blinklink",
        "click [home]" : "home",
        "click [login]" : "blinklink",
        "click [pending]" : "pendingQueue",

        // Destroy
        "pageremove" : "destroy"
      },

      attributes: {
        "data-role": "page"
      },

      blinklink: function (e) {
        e.preventDefault();

        var $element,
          location,
          attributes = "",
          first = true,
          count,
          path;

        if (e.target.tagName !== 'A') {
          $element = $(e.target).parents('a');
        } else {
          $element = $(e.target);
        }

        location = "";
        if ($element.attr("keyword")) {
          location = $element.attr("keyword");
        } else if ($element.attr("interaction")) {
          location = $element.attr("interaction");
        } else if ($element.attr("category")) {
          location = $element.attr("category");
        } else if ($element.attr("masterCategory")) {
          location = $element.attr("masterCategory");
        } else if ($element.attr("home") === "") {
          location = app.get("siteName");
        } else if ($element.attr("login") === "") {
          if (app.has("loginAccess") && app.has("loginUseInteractions") && app.has("loginUseInteractions") && app.has("loginPromptInteraction")) {
            location = app.get("loginPromptInteraction");
          } else {
            location = app.get("siteName");
          }
        }

        for (count = 0; count < $element[0].attributes.length; count = count + 1) {
          if ($element[0].attributes[count].name.substr(0, 1) === "_") {
            if (!first) {
              attributes += "&args[" + $element[0].attributes[count].name.substr(1) + "]=" + $element[0].attributes[count].value;
            } else {
              first = false;
              attributes = "/?args[" + $element[0].attributes[count].name.substr(1) + "]=" + $element[0].attributes[count].value;
            }
          }
        }

        path = $.mobile.path.parseLocation().pathname;
        if ($.mobile.path.parseLocation().search) {
          path = $.mobile.path.parseLocation().pathname.substr(0, $.mobile.path.parseLocation().pathname.length - 1);
        }

        if (path.slice(-1) === "/") {
          path = path.slice(0, path.length - 1);
        }

        $.mobile.changePage(path + '/' + location + attributes);
      },

      home: function () {
        $.mobile.changePage('/' + app.get("siteName"));
      },

      render: function (data) {
        var inheritedAttributes = this.model.inherit({}),
          view = this,
          innerView,
          content;

        // Non-type specific
        if (_.has(inheritedAttributes, "themeSwatch")) {
          this.$el.attr("data-theme", inheritedAttributes.themeSwatch);
        }

        // Input Prompt
        if (this.model.has("inputPrompt") && !(this.model.has("args"))) {
          innerView = new PromptView();
          content = innerView.render(view);
          this.trigger("render");
        } else if (view.model.has("type") && view.model.get("type") === "xslt") {
          // XSLT
          innerView = new XsltView();
          content = innerView.render(view);
          view.trigger("render");
        } else if (this.model.has("type") && this.model.get("type") === "form") {
          // Form
          innerView = new FormView();
          content = innerView.render(view);
        } else if (this.model.id.toLowerCase() === window.BMP.BIC.siteVars.answerSpace.toLowerCase()) {
          // Home Screen
          innerView = new CategoryView();
          content = innerView.render(view, data);
          view.trigger("render");
        } else if (!this.model.has("type")) {
          // Category
          innerView = new CategoryView();
          content = innerView.render(view, data);
          view.trigger("render");
        } else if (this.model.get("type") === "message") {
          content = inheritedAttributes.message;
          this.trigger("render");
        } else {
          // MADL
          innerView = new MadlView();
          this.$el.html(Mustache.render(Template, inheritedAttributes));
          if (this.model.has("content")) {
            this.blinkAnswerMessages();
            this.maps();
            this.processStars();
          }
          this.trigger("render");
        }
        this.$el.html(Mustache.render(Template, {
          header: '',
          footer: '',
          content: content
        }));
        return this;
      },



      blinkAnswerMessages: function (message) {
        if (!message) {
          // First Pass - Extract content

          /*jslint regexp: true */
          var blinkAnswerMessage = this.model.get('content').match(/<!-- blinkAnswerMessage:\{.*\} -->/g);
          /*jslint regexp: false */

          if ($.type(blinkAnswerMessage) === 'array') {
            _.each(blinkAnswerMessage, function (element) {
              this.blinkAnswerMessages(element.substring(24, element.length - 4));
            }, this);
          }
        } else {
          // Process a given message
          message = JSON.parse(message);
          if (typeof message.mojotarget === 'string') {
            if (typeof message.mojoxml === 'string') {
              // Add a DS
              app.datasuitcases.create({
                _id: message.mojotarget,
                data: message.mojoxml
              });
            } else if (message.mojodelete !== undefined) {
              // Remove a DS
              app.datasuitcases.remove(message.mojotarget);
            }
          }

          if (message.startype) {
            if (message.clearstars) {
              // Clear all stars?
              app.stars.clear(message.startype);
            }
            if ($.type(message.staroff) === 'array') {
              // Remove specific stars
              _.each(message.staroff, function (element) {
                if (app.stars.get(element)) {
                  app.stars.get(element.toString()).destroy();
                }
              }, this);
            }
            if ($.type(message.staron) === 'array') {
              // Add stars
              _.each(message.staron, function (element) {
                app.stars.create({
                  _id: element.toString(),
                  type: message.startype,
                  state: true
                });
              });
            }
          }
        }
      },

      destroy: function () {
        this.remove();
      },

      processStars: function () {
        var elements = this.$el.find('.blink-starrable');
        if (elements) {
          /*jslint unparam: true*/
          elements.each(function (index, element) {
            var attrs,
              model = app.stars.get($(element).data('id')),
              star;
            if (!model) {
              attrs = $(element).data();
              attrs._id = attrs.id.toString();
              delete attrs.id;
              attrs.state = false;
              model = new StarModel(attrs);
            }
            star = new StarView({
              model: model,
              el: element
            });
            star.render();
          });
          /*jslint unparam: false*/
        }
      },
    });

    return InteractionView;
  }
);
