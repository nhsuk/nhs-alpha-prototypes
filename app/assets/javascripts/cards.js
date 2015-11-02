/*
  Dependencies:
  • jQuery (obvs)
  • A forked jquery.transit.js - https://github.com/NV/jquery.transit (allows for 'auto' css values)
*/
$(function() {
  var hash = window.location.hash || false;

  if ($('.js-cards').length > 0) {
    $('.item-body').css('height', 0);

    $('.items-container').on('click', '.item', function(event) {

      $item = $(this);
      $itemBody = $item.find('.item-body');
      $toggleLink = $item.find('.item-header .item-collapse-link');

      if ($item.hasClass('item-open')) {
        /*
          It's open.
          • Check the click has come from a "close" control only
          • Collapse the "body" area
          • Disable the (now hidden) "show less" link
          • Then shunt the card back into the deck
        */
        var e = $(event.target).attr('class');
        if (e === 'item-heading' || e === 'item-collapse-link') {
          event.preventDefault();

          $item.removeClass('item-open');

          $itemBody.transition({
            height: 0
          }, 750, function() {
            $toggleLink.text('Show more');
            $itemBody.find('.item-collapse').hide();
          });

          // scroll back up at the same time
          $('html,body').animate({
            scrollTop: ($item.offset().top - 36)
          }, 1000, 'easeInOutQuad');

        }
      } else {
        /*
          It's not open. You can click anywhere to open, right?
          • Check the link isn't a "permanent CTA"
          • Activate 'collapse' links
          • Animate body area expanding in height
          • Animate card shifting
          • Animate scrolling to centre the card
        */
        if (!$(event.target).hasClass('item-permanent-cta')) {
          event.preventDefault();
          $toggleLink.text('Show less');
          $itemBody.find('.item-collapse').show();

          $itemBody.transition({
            height: 'auto'
          }, 750, function() {
            $item.addClass('item-open');
          });

          $('html,body').animate({
            scrollTop: $item.offset().top - 5
          }, 1000, 'easeInOutQuad');

        }
      }
    });

    if(hash) {
      $(hash).click();
    }
  }
});
