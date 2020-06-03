$( ()=> {
	let QRImageCavnas = document.getElementById('QRImageCavnas');
	let QRImageCavnasCtx = QRImageCavnas.getContext('2d');

	$('#QRcodeUploadBtn').click( ()=> $('#QRUploadFileInput').click() );

	$('input[type="file"]').change( (evt)=> {
		if(this.files && this.files[0]) {
			let reader = new FileReader();
			reader.onload = (event)=> {
				let img = new Image();
				img.onload = ()=> {
					QRImageCavnas.width = img.width;
					QRImageCavnas.height = img.height;
					QRImageCavnasCtx.drawImage(img,0,0);
					QRImageLoaded();
				}
				img.src = event.target.result;
			}
			reader.readAsDataURL(evt.target.files[0]);
		}
	});

	function QRImageLoaded() {
		let imageData = QRImageCavnasCtx.getImageData(0, 0, QRImageCavnas.width, QRImageCavnas.height);
		let code = jsQR(imageData.data, imageData.width, imageData.height, {
			inversionAttempts: 'dontInvert',
		});

		if(code) {
			if(code.data.substring(0,4)=='http') {
				// if website then display as clickable link
				$('#QRUploadOutput').html('Data: ' + '<a href="' + code.data + '" target="_blank">' + code.data + '</a>');
			} else {
				$('#QRUploadOutput').html('Data: ' + code.data);
			}
		} else {
			$('#QRUploadOutput').html('Unable to read QR Code');
		}
	}

});