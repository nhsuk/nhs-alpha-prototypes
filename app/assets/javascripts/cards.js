/*
  Dependencies:
  • jQuery (obvs)
  • A forked jquery.transit.js - https://github.com/NV/jquery.transit (allows for 'auto' css values)
*/
$(function() {
  if ($('.js-cards').length > 0) {
    $('.item-body').css('height', 0);

    $('.items-container').on('click', '.item', function(event) {

      $item = $(this);
      $itemBody = $item.find('.item-body');

      if ($item.hasClass('item-open')) {
        /*
          It's open.
          • Check the click has come from a "close" control only
          • Collapse the "body" area
          • Disable the (now hidden) "show less" link
          • Then shunt the card back into the deck
        */
        if ($(event.target).hasClass('item-collapse-link')) {
          event.preventDefault();

          $itemBody.transition({
            height: 0
          }, 750, function() {
            $itemBody.find('.item-collapse').hide();
            $item.removeClass('item-open');
          });
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
          $item.addClass('item-open');
          $itemBody.find('.item-collapse').show();

          $itemBody.transition({
            height: 'auto'
          }, 750);

          $('html,body').animate({
            scrollTop: $item.offset().top
          }, 1000, 'easeInOutQuad');

        }
      }
    });
  }
});
