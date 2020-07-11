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
			// downloadWifiImg($('#WifiQR img').attr('src'), 'wifi_qr'); // img without padding
			downloadWifiImg($('#wifiQRCanvas')[0].toDataURL(), 'wifi_qr'); // canvas with padding
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
		
		win.document.write(`<style type="text/css">
			* {
				text-align: center;
				font: 32px Arial;
				line-height: 2.5rem;
			}
			b {
				font-weight: bold; /*idk...*/
			}
			img:not(.icon) {
				padding: 0.5rem;
				margin: 1rem;
				border: 4px solid black;
				box-shadow: 0.5rem 0.5rem #999;
			}
		</style>`);
		win.document.write(`<b>Scan to automatically connect to our Wifi <img class="icon" src="img/wifi-solid.svg" width="32px"></b> <br>`);
		win.document.write(`${$('#WifiQR').html().replace('block','inline')}`);
		if($('#showWifiNetwork').is(':checked') ) {
			win.document.write(`<br><b>Network:</b> ${$('#wifiName').val()}`);
		}
		if($('#showWifiPass').is(':checked') ) {
			win.document.write(`<br><b>Password:</b> ${$('#wifiPass').val()}`);
		}
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

	$('#WifiQR img').on('load', ()=> {
		drawWithPadding('WifiQR', 'wifiQRCanvas');
	});
}

function downloadWifiImg(imgData, imgName) {
	let link = document.createElement('a');
	link.href = imgData;
	link.download = imgName + '.png';
	link.click();
}