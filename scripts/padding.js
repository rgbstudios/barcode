// moving img to canvas in order to add padding, then hide original img
function drawWithPadding(srcImg, destCanvas, codeSize=256, paddingSize=32) {
	let canvas = document.getElementById(destCanvas);
	canvas.width = codeSize + 2*paddingSize;
	canvas.height = codeSize + 2*paddingSize;
	let ctx = canvas.getContext('2d');
	ctx.drawImage($(`#${srcImg} img`)[0], paddingSize, paddingSize);

	$(`#${srcImg}`).hide();
}