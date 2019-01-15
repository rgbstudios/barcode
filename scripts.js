





//https://github.com/lindell/JsBarcode
$(function() {
	let url = new URL(window.location.href);
	let q = url.searchParams.get('q');
	$('#input').val(q || 'hello world');

	makeCode();

	$('#input').select();

	$('#input').on('keyup', function() {
		makeCode();
	});
	$('#showLabel').on('change', function() {
		makeCode();
	});
});

function makeCode() {
	if($('#input').val()=='') {
		$('#nodata').css('display','block');
		return;
	}
	$('#nodata').css('display','none');

	$('#output').JsBarcode($('#input').val(), 
		{
			format: 'code128',
			lineColor: '#000',
			width: 2,
			height: 100,
			displayValue: $('#showLabel').is(':checked')
		}
	);

	history.replaceState({}, '', '?q=' + $('#input').val() );
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