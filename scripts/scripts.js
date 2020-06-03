// https://github.com/lindell/JsBarcode
// https://github.com/lindell/JsBarcode/wiki

// https://github.com/cozmo/jsQR

// https://github.com/davidshimjs/qrcodejs

$( ()=> {

	// Handle URL Parameters

	let url = new URL(window.location.href);
	let q = url.searchParams.get('q') || 'hello world';
	let f = url.searchParams.get('f') || 'code128';
	let t = url.searchParams.get('t') || '1';
	let c = url.searchParams.get('c') || '000000';
	let b = url.searchParams.get('b') || 'FFFFFF';
	let w = parseInt(url.searchParams.get('w') || '2');
	let h = parseInt(url.searchParams.get('h') || '100');
	let m = parseInt(url.searchParams.get('m') || '10');
	let z = parseInt(url.searchParams.get('z') || '200'); // qr size
	let i = parseInt(url.searchParams.get('i') || '0'); //  is qr code

	$('#input').val(q);

	$('#format .dropdown-item').removeClass('active');
	$('#format .dropdown-item').filter( (idx, node)=>
		$(node).html().toLowerCase() == f.toLowerCase()
	).addClass('active');
	$('#formatSpan').html($('#format .dropdown-item.active').html() );

	$('#showLabel').prop('checked',t!='0').change();
	$('#lineColor').val('#'+c).change(); // don't use '#' in url or it messes it up 
	$('#backgroundColor').val('#'+b).change();
	$('#widthRange').val(w);
	$('#heightRange').val(h);
	$('#marginRange').val(m);
	$('#sizeRange').val(z);

	if(i=='1') {
		$('#QRcodeModal').modal('show');
		makeQRCode();
	}

	// Listeners and Setup

	makeCode(i=='1'); // QR if i

	$('#input').select();
	$('#input').popover('hide');

	$('#input').on('keyup', makeCode);
	$('#showLabel').change(makeCode);
	$('input[type=range]').on('input',makeCode);
	$('.color').colorPicker({opacity:false, renderCallback: makeCode});

	$('#format .dropdown-item').click( (e)=> {
		$('#format .dropdown-item').removeClass('active');
		$(e.currentTarget).addClass('active');
		$('#formatSpan').html($(e.currentTarget).html() );
		makeCode();
	});

	// Buttons

	$('#copyBtn').popover({
		content: 'Copied link to your barcode',
		placement: 'bottom'
	});
	$('#copyBtn').click( ()=> {
		makeCode();
		copyUrl();
		$('#copyBtn').popover('show');
		setTimeout( ()=> $('#copyBtn').popover('hide'), 2000);
		$('#copyBtn').focus();
	});

	$('#downloadBtn').click( ()=> downloadImg(false) ); // param defaults to event otherwise
	$('#resetBtn').click(resetSettings);

	// QR Buttons

	$('#QRcopyBtn').popover({
		content: 'Copied link to your QR code',
		placement: 'bottom'
	});
	$('#QRcopyBtn').click( ()=> {
		copyUrl(true);
		$('#QRcopyBtn').popover('show');
		setTimeout( ()=> $('#QRcopyBtn').popover('hide'), 2000);
		$('#QRcopyBtn').focus();
	});

	$('#QRdownloadBtn').click( ()=> downloadImg(true) );

	$('#QRcodeBtn').click(makeQRCode);
	makeQRCode();

	// QR Size

	$('#sizeRange').change( ()=> {
		let size = parseInt($('#sizeRange').val() );
		$('#sizeSpan').html(size);
		$('#qrcode img').css('width', size + 'px');
		$('#qrcode img').css('height', size + 'px');
	}).change();

	// If on mobile, don't display right click alert
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$('#rightClickAlert').css('display','none');
	}
});

function makeCode(defaultQR=false) {
	// bug fix for inputs that autoamtically pass their event as the first param

	if(typeof defaultQR == 'object') defaultQR = false;

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

	addURLParamsIfExist(defaultQR);
}

function addURLParamsIfExist(defaultQR=false) {
	// if we have url params, then update them
	let url = new URL(window.location.href);
	let f = url.searchParams.get('f');
	if(f) { // anything other than 'q' because 'q' is kept on resetSettings()
		addURLParams(defaultQR);
	}	
}

function addURLParams(isQR=false) {
	isQR = $('#QRcodeModal').is(':visible') ? true : isQR; // comment this?

	history.replaceState({}, '', '?q=' + $('#input').val() + 
		'&f=' + $('#formatSpan').html() + 
		'&t=' + ($('#showLabel').is(':checked')?'1':'0') +
		'&c=' + $('#lineColor').val().substring(1) +
		'&b=' + $('#backgroundColor').val().substring(1) +
		'&w=' + $('#widthRange').val() +
		'&h=' + $('#heightRange').val() +
		'&m=' + $('#marginRange').val() +
		'&z=' + $('#sizeRange').val() +
		'&i=' + (isQR?'1':'0') // isQR (open modal by default)
	);
}

function removeURLParams() {
	window.history.replaceState(null, null, window.location.pathname);
}

function downloadImg(isQR=false) {
	let link = document.createElement('a');
	if(isQR) {
		// link.href = $('#qrcode img');
		link.href = $('#qrcode img').attr('src');
		link.download = 'qrcode-' + $('#input').val() + '.png';
	} else {
		link.href = $('.output')[0].toDataURL();
		link.download = 'barcode-' + $('#input').val() + '.png';
	}

	link.click();
}

function copyUrl(isQR=false) {
	addURLParams(isQR);

	// copy url
	let tmp = $('<input type="text">').appendTo(document.body);
	tmp.val(window.location.href).select();
	document.execCommand('copy');
	tmp.remove();
}

function resetSettings() {
	removeURLParams();

	history.replaceState({}, '', '?q=' + $('#input').val() );
	location.reload();
}

// QR Code Stuff

let qrcode;
function makeQRCode(text) {
	text = text || $('#input').val();
	// https://github.com/davidshimjs/qrcodejs
	if(qrcode) {
		qrcode.clear();
		qrcode.makeCode(text);
	} else {
		qrcode = new QRCode(document.getElementById('qrcode'), text);
	}
	addURLParamsIfExist(true);
}