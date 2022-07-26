// Version 1
import("./form-1/inpage.js");
import("./form-1/popup.js");

// Version 2
import("./form-2/inpage.js");
import("./form-2/popup.js");

// Version 3
import("./form-3/inpage.js");
import("./form-3/popup.js");

(function( $ ) {
	'use strict';

	$(document).ready(function () {

		$.mask.definitions['X'] = "[9]";
		$("[data-type='phone']").mask("+7 (X99) 999-99-99");

		$(".handler_amocrm").append("<input name='handler-amocrm' hidden value='true' />");

		$(".handler_amocrm").on("submit", function () {
			let data = $(this).serializeArray();
			data[2]['value'] = "handler_form_feedback";

			$.ajax({
				url: window.wp_ajax["ajax_url"],
				method: "post",
				data: data,
				success(data) {
					console.log(data);
				}
			})
		});

		$(".handler_amocrm").find("[placeholder='Номер телефона']").mask("+7 (X99) 999-99-99");

	});

})( jQuery );
