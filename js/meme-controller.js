'use strict';

var gCanvas = document.querySelector('.meme-canvas');
var gCtx = gCanvas.getContext('2d');


function onInit() {
    onRenderGallery();
}

function drawImgOnCanvas(chosenImg) {
    var img = new Image();
    img.src = chosenImg.url;
    img.onload = () => {
        var widthHeightRatio = img.width / img.height;
        // var newWidth = 
        
        gCanvas.height = img.height;
        gCanvas.width = img.width;
        gCtx.drawImage(img, 0, 0, img.height, img.width);
        drawTxtOnImg(getMeme().lines[0].txt, getMeme().lines[0].size, getMeme().lines[0].color);
    }

}

function drawTxtOnImg(text, size, color) {
    gCtx.font = `${size}px Impact`;
    gCtx.fillStyle = color;
    gCtx.textAlign = 'left';
    gCtx.fillText(text, 0, 20);
    gCtx.strokeText(text, 0, 20);
}

function onEnterTxt(txt) {
    let memeToChangeTxt = getMeme();
    // console.log(memeToChangeTxt);
    memeToChangeTxt.lines[0].txt = txt;
    onRenderImgOnCanvas(memeToChangeTxt.selectedImgId);
}

function onRenderGallery(){
    var galleryImgs = getImgs();
    const elGallery = document.querySelector('.img-gallery');
    let strHTMLs = galleryImgs.map(img => `<img class="img-item" src="${img.url}" onclick="onRenderImgOnCanvas(${img.id})">`);
    console.log(strHTMLs);
    elGallery.innerHTML = strHTMLs.join('');

}

function onRenderImgOnCanvas(imgId) {
    let memeForCanvas = getMeme();
    memeForCanvas.selectedImgId = imgId;
    // console.log(memeForCanvas);
    let imgSrc = getImgSrc(memeForCanvas);
    drawImgOnCanvas(imgSrc);
}