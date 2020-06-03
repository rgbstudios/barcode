const getWifiStr = (auth, name, pass) => `WIFI:T:${auth};S:${name};P:${pass};;`;

$( ()=> {
	$('#wifiQRBtn').click( ()=> {
		let auth = $('#wifiAuth').val();
		let name = $('#wifiName').val();
		let pass = $('#wifiPass').val();

		if(name == '' || pass == '') {
			$('#wifiQRErrorText').html('Please enter all inputs');
			return;
		}

		$('#wifiQRErrorText').html('');
		makeWifiQRCode(getWifiStr(auth, name, pass) );
	});

	$('#wifiQRDownloadBtn').click( ()=> {
		if(wifiQR) {
			$('#wifiQRErrorText').html('');
			downloadWifiImg($('#WifiQR img').attr('src'), 'wifi_qr');
		} else {
			$('#wifiQRErrorText').html('Create a QR code first. Click "Generate" when you\'re ready.');
		}
	});

	$('#wifiQRPrintBtn').click( ()=> {
		if(!wifiQR) {
			$('#wifiQRBtn').click();
			if(!wifiQR) {
				return;
			} // if doesn't exist after click
			else { //  wait for it to load
				$('#WifiQR img').on('load', ()=> $('#wifiQRPrintBtn').click() );
				return;
			}
		}
		let win = window.open('','','');
		win.document.write(`${$('#WifiQR').html()}`);
		win.document.close();

		win.addEventListener('load', ()=> {
			win.focus();
			win.print();
			win.close();
		}, false);
	});
});

let wifiQR;
// note: no url params (security)
function makeWifiQRCode(text) {
	// remove it so it calls onload again once finished
	$('#WifiQR img').attr('src', '');

	if(wifiQR) {
		wifiQR.clear();
		wifiQR.makeCode(text);
	} else {
		wifiQR = new QRCode(document.getElementById('WifiQR'), text);
	}


	// moving img to canvas in order to add padding
	$('#WifiQR img').on('load', ()=> {
		// 32px padding, 256px img
		let canvas = document.getElementById('wifiQRCanvas');
		canvas.width = 320; // 256 + 32*2
		canvas.height = 320; // 256 + 32*2
		let ctx = canvas.getContext('2d');
		ctx.drawImage($('#WifiQR img')[0], 32, 32);

		$('#WifiQR').hide();
	});

}

function downloadWifiImg(imgData, imgName) {
	let link = document.createElement('a');
	link.href = imgData;
	link.download = imgName + '.png';
	link.click();
}