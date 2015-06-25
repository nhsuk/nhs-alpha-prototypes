$(document).ready(function(){

  GOVUK.toggle.init();

  // Initialise auto-suggest fields
  //$('.auto-suggest').selectToAutocomplete();
  

  // Uses radio buttons to emulate a more usable select box
  $( ".js-form-select label" ).click(function() {
  	$( this ).closest('.js-form-select').toggleClass( "open" );
  });

  // Postcode lookup
  // Hide address list if user changes postcode
	var lastValue = '';
	$("#postcode").on('change keyup paste mouseup', function() {
	    if ($(this).val() != lastValue) {
	        lastValue = $(this).val();
  			$( "#address-list" ).addClass("js-hidden");
  			$( "#submit-postcode" ).removeClass("js-hidden");
	    }
	});

});