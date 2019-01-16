function setupCheckboxes() {
	$('input[type=checkbox]').change(function() {
		$(this).next().toggleClass('fas').toggleClass('far').toggleClass('fa-check-square').toggleClass('fa-square');
	});
}