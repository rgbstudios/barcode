function setupCheckboxes() {
	$('input[type=checkbox]').change(function() {
		if($(this).prop('checked') )
			$(this).next().addClass('fas').addClass('fa-check-square').removeClass('far').removeClass('fa-square');
		else
			$(this).next().removeClass('fas').removeClass('fa-check-square').addClass('far').addClass('fa-square');
	});
}