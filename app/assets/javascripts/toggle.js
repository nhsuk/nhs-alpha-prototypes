(function () {
  "use strict"
  var root = this,
  $ = root.jQuery;

  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var toggle = {
    toggle: function(e){
      var $el = $(this),
          visible;

      if($el.attr('href')){
        toggle.toggleVisibility($el.attr('href'));
        e.preventDefault();
      } else if($el.data('toggle')) {
        toggle.toggleVisibility($el.data('toggle'));
      }
      if($el.data('hide')){
        toggle.hide($el.data('hide'));
      }
      if($el.data('show')){
        toggle.show($el.data('show'));
      }
    },
    toggleVisibility: function(selector){
      var $el = $(selector);

      if($el.is(':visible')){
        $el.addClass('js-hidden');
      } else {
        $el.removeClass('js-hidden');
      }
    },
    hide: function(selector){
      $(selector).addClass('js-hidden');
    },
    show: function(selector){
      $(selector).removeClass('js-hidden');
    },
    init: function(){
      // find all the togglers and iterate over them
      $('.js-toggle').each(function(i, el){
        var $el = $(el);

        if($el.is('input')){
          $el.change(toggle.toggle);
        } else {
          $el.click(toggle.toggle);
        }
      });
    }
  }
  root.GOVUK.toggle = toggle;
}).call(this);
