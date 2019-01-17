//https://github.com/lindell/JsBarcode
//https://github.com/lindell/JsBarcode/wiki
$(function() {
	setupCheckboxes();

	// URL params
	let url = new URL(window.location.href);
	let q = url.searchParams.get('q') || 'hello world';
	let f = url.searchParams.get('f') || 'code128';
	let t = url.searchParams.get('t') || '1';
	let c = url.searchParams.get('c') || '000000';
	let b = url.searchParams.get('b') || 'FFFFFF';
	let w = parseInt(url.searchParams.get('w') || '2');
	let h = parseInt(url.searchParams.get('h') || '100');
	let m = parseInt(url.searchParams.get('m') || '10');

	$('#input').val(q);

	$('#format .dropdown-item').removeClass('active');
	$('#format .dropdown-item').filter(function() {
		return $(this).html().toLowerCase() == f.toLowerCase();
	}).addClass('active');
	$('#formatSpan').html($('#format .dropdown-item.active').html() );

	$('#showLabel').prop('checked',t!='0').change();
	$('#lineColor').val('#'+c).change(); // don't use '#' in url or it messes it up 
	$('#backgroundColor').val('#'+b).change();
	$('#widthRange').val(w);
	$('#heightRange').val(h);
	$('#marginRange').val(m);

	// Listeners and setup
	makeCode();

	$('#input').select();
	$('#input').popover('hide');

	$('#input').on('keyup', makeCode);

	$('#showLabel').change(makeCode);

	$('input[type=range]').on('input',makeCode);


	$('.color').colorPicker({opacity:false, renderCallback: makeCode});

	$('#format .dropdown-item').click(function() {
		$('#format .dropdown-item').removeClass('active');
		$(this).addClass('active');

		$('#formatSpan').html($(this).html() );
		makeCode();
	});

	// Buttons
	$('#copyBtn').popover({
		content: 'Copied link to your barcode',
		placement: 'bottom'
	});
	$('#copyBtn').click(function() {
		makeCode();
		copyUrl();
		$('#copyBtn').popover('show');
		setTimeout(function(){$('#copyBtn').popover('hide')}, 2000);
	});

	$('#downloadBtn').click(downloadImg);
	$('#resetBtn').click(resetSettings);

	// If on mobile, don't display right click alert
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$('#rightClickAlert').css('display','none');
	}

});

function makeCode() {
	$('#nodata').css('display','none');
	$('.output').css('display','inline-block');

	try {
		$('.output').JsBarcode($('#input').val(), 
			{
				format: $('#formatSpan').html(),
				lineColor: $('#lineColor').val(),
				background: $('#backgroundColor').val(),
				width: parseInt($('#widthRange').val() ),
				height: parseInt($('#heightRange').val() ),
				margin: parseInt($('#marginRange').val() ),
				displayValue: $('#showLabel').is(':checked')
			}
		);
	} catch(e) {
		$('#nodata').css('display','block');
		$('.output').css('display', 'none');
		return;
	}

	$('#widthSpan').html($('#widthRange').val() );
	$('#heightSpan').html($('#heightRange').val() );
	$('#marginSpan').html($('#marginRange').val() );

	history.replaceState({}, '', '?q=' + $('#input').val() + 
		'&f=' + $('#formatSpan').html() + 
		'&t=' + ($('#showLabel').is(':checked')?'1':'0') +
		'&c=' + $('#lineColor').val().substring(1) +
		'&b=' + $('#backgroundColor').val().substring(1) +
		'&w=' + $('#widthRange').val() +
		'&h=' + $('#heightRange').val() +
		'&m=' + $('#marginRange').val()
	);
}

function downloadImg() {
	let link = document.getElementById('downloadLink');
	link.href = $('.output')[0].toDataURL();
	link.download = 'barcode-' + $('#input').val() + '.png';
	link.click();
}

function copyUrl() {
	let tmp = $('<input type="text">').appendTo(document.body);
	tmp.val(window.location.href);
	tmp.select();
	document.execCommand('copy');
	tmp.remove();
}

function resetSettings() {
	history.replaceState({}, '', '?q=' + $('#input').val() );
	location.reload();
}
