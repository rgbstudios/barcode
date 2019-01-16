//https://github.com/lindell/JsBarcode
//https://github.com/lindell/JsBarcode/wiki
$(function() {
	// URL params
	let url = new URL(window.location.href);
	let q = url.searchParams.get('q') || 'hello world';
	$('#input').val(q);

	let f = url.searchParams.get('f') || 'code128';
	$('#format .dropdown-item').removeClass('active');
	$('#format .dropdown-item').filter(function() {
		return $(this).html().toLowerCase() == f.toLowerCase();
	}).addClass('active');
	$('#formatSpan').html($('#format .dropdown-item.active').html() );

	setupCheckboxes();
	let t = url.searchParams.get('t') || 'hello world';
	$('#showLabel').prop('checked',t!='0').change();

	// Listeners and Setup
	makeCode();

	$('#input').select();

	$('#input').on('keyup', function() {
		makeCode();
	});
	$('#showLabel').on('change', function() {
		makeCode();
	});

	$('#format .dropdown-item').click(function() {
		$('#format .dropdown-item').removeClass('active');
		$(this).addClass('active');

		$('#formatSpan').html($(this).html() );
		makeCode();
	});	

	// Copy Button
	$('#copyBtn').popover({
		content: 'Copied link to your barcode'
	});
	$('#copyBtn').click(function() {
		makeCode();
		copyUrl();
		$('#copyBtn').popover('show');
		setTimeout(function(){$('#copyBtn').popover('hide')}, 2000);
	});

});

function makeCode() {
	$('#nodata').css('display','none');
	$('#output').css('display','inline-block');

	try {
		$('#output').JsBarcode($('#input').val(), 
			{
				format: $('#formatSpan').html() || 'code128',
				lineColor: '#000',
				width: 2,
				height: 100,
				displayValue: $('#showLabel').is(':checked')
			}
		);
	} catch(e) {
		$('#nodata').css('display','block');
		$('#output').css('display', 'none');
		return;
	}

	history.replaceState({}, '', '?q=' + $('#input').val() + '&f=' + $('#formatSpan').html() + '&t=' + ($('#showLabel').is(':checked')?'1':'0') );
}

function downloadImg() {
	let link = document.getElementById('downloadLink');
	link.href = document.getElementById('output').toDataURL();
	link.download = 'barcode-' + $('#input').val() + '.png';
	link.click();
}

function copyUrl() {
	let tmp = $('<input type="text">').appendTo(document.body);
	tmp.val(window.location.href);
	tmp.select();
	document.execCommand('copy');
	tmp.remove();
	//todo: display toast for copied sucessfully
}