// modified code from https://cozmo.github.io/jsQR/
// library is here: https://github.com/cozmo/jsQR

$(function() {
	let found;
	let streamObj;

	let video = document.createElement('video');
	let canvasElement = document.getElementById('canvas');
	let canvas = canvasElement.getContext('2d');
	let loadingMessage = document.getElementById('loadingMessage');
	let outputContainer = document.getElementById('output');
	let outputMessage = document.getElementById('outputMessage');
	let outputData = document.getElementById('outputData');

	$('#QRcodeScanBtn').click(startScan);

	$('#QRscanRefreshBtn').click( ()=> {
		stopScan();
		startScan();
	});

	// on modal close cancel camera permission and close video
	$('#QRcodeScanModal').on('hidden.bs.modal', stopScan);

	function startScan() {
		found = false;

		// Use facingMode: environment to attemt to get the front camera on phones
		navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function(stream) {
			video.srcObject = stream;
			video.setAttribute('playsinline', true); // tell iOS safari we don't want fullscreen
			video.play();
			requestAnimationFrame(tick);

			streamObj = stream;
		});
	}

	function stopScan() {
		const tracks = streamObj.getTracks();
		tracks.forEach(function(track) {
			track.stop();
		});
	}

	function drawLine(begin, end, color) {
		canvas.beginPath();
		canvas.moveTo(begin.x, begin.y);
		canvas.lineTo(end.x, end.y);
		canvas.lineWidth = 4;
		canvas.strokeStyle = color;
		canvas.stroke();
	}

	function drawQuad(points, color) {
		drawLine(points[0], points[1], color);
		drawLine(points[1], points[2], color);
		drawLine(points[2], points[3], color);
		drawLine(points[3], points[0], color);
	}

	function tick() {
		if(found) {
			stopScan();
			return;
		}

		loadingMessage.innerText = 'Loading video...';
		if (video.readyState === video.HAVE_ENOUGH_DATA) {
			loadingMessage.hidden = true;
			canvasElement.hidden = false;
			outputContainer.hidden = false;

			canvasElement.height = video.videoHeight;
			canvasElement.width = video.videoWidth;
			canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
			let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
			let code = jsQR(imageData.data, imageData.width, imageData.height, {
				inversionAttempts: 'dontInvert',
			});
			if (code) {
				let loc = code.location;
				drawQuad([loc.topLeftCorner, loc.topRightCorner,
					loc.bottomRightCorner, loc.bottomLeftCorner], '#933');

				outputMessage.hidden = true;
				outputData.parentElement.hidden = false;
				if(code.data.substring(0,4)=='http') {
					// if website then display as clickable link
					outputData.innerHTML = '<a href="' + code.data + '" target="_blank">' + code.data + '</a>';
				}
				else {
					outputData.innerHTML = code.data;
					// outputData.innerText = code.data;
				}
				found = true;
			} else {
				outputMessage.hidden = false;
				outputData.parentElement.hidden = true;
			}
		}
		requestAnimationFrame(tick);
	}
});