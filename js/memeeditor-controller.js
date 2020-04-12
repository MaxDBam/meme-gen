'use strict'

var gCanvas;
var gCtx;
var gFirstLoad = true;
var gIsLocalImg = false;
var gLocalImg;
var gNoFocus = false;
var gDragOn = false;
var gFocustxt = true;
var gCurrPosX;
var gCurrPosY;


function renderCanvas() {
    gCanvas = document.querySelector('#meme-canvas');
    gCtx = gCanvas.getContext('2d');

    if (gFirstLoad) resizeCanvas();

    if (gIsLocalImg) drawLocalImg(gLocalImg);
    else drawImg();

    if (!gNoFocus) drawFocusRect();
    else gNoFocus = false;

    renderText();
    addDragDrop();
}

function resizeCanvas() {
    var imgId = getSelectedImg();
    var elImg = document.querySelector(`#img-num-${imgId}`);
    var ratio = elImg.width / elImg.height;

    if (isMobileDevice()) {
        gCanvas.width = window.innerWidth - 15;
        gCanvas.height = (gCanvas.width / ratio);
        document.querySelector('.meme-control').style.width = `"${window.innerWidth}px"`;
    } else {
        gCanvas.width = 500;
        gCanvas.height = (gCanvas.width / ratio);
    }
    changePosTexts(gCanvas.width, gCanvas.height);
    gFirstLoad = false;
}

function drawLocalImg() {
    gCtx.drawImage(gLocalImg, 0, 0, gCanvas.width, gCanvas.height);
}

function drawImg() {
    var imgId = getSelectedImg()
    var elImg = document.querySelector(`#img-num-${imgId}`);
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
}

function renderText() {
    var meme = getMeme();
    var lines = meme.lines;
    if (lines.length === 0) return;
    lines.forEach(line => drawText(line));

    var selectedLine = meme.lines[meme.selectedLineIdx];
    document.querySelector('.control-txt-input').value = selectedLine.txt;
}

function drawText(line) {
    gCtx.setLineDash([]);
    gCtx.lineWidth = '1';
    gCtx.strokeStyle = line.OutlineColor;
    gCtx.fillStyle = line.fillColor;
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = line.align;
    gCtx.fillText(line.txt, line.positionX, line.positionY);
    gCtx.strokeText(line.txt, line.positionX, line.positionY);
}


function drawFocusRect() {
    var meme = getMeme();
    if (gFocustxt) {
        if (meme.lines.length === 0) return;
        var line = meme.lines[meme.selectedLineIdx];
        var posX = line.positionX;
        var posY = line.positionY;
        gCtx.beginPath();
        gCtx.rect(posX - 160, posY - 40, 320, 50);
        gCtx.setLineDash([4, 4]);
        gCtx.strokeStyle = 'black';
        gCtx.stroke();
    }

}

function onChangeText(txt) {
    editMeme('txt', txt);
    gFocustxt = true;

    renderCanvas();
}

function onChangeAlign(align) {
    editMeme('align', align);

    renderCanvas();
}

function onChangeOutlineColor(value) {
    editMeme('OutlineColor', value);

    renderCanvas();
}

function onChangeFillColor(value) {
    editMeme('fillColor', value);

    renderCanvas();
}

function onChangeSize(num) {
    changeSize(num);
    renderCanvas();
}

function onChangeFont(font) {
    editMeme('font', font);

    renderCanvas();
}

function onChangePositionY(num) {
    changePositionY(num);
    renderCanvas();
}

function onChangePositionX(num) {
    changePositionX(num);
    renderCanvas();
}

function onSwitchLines() {
    switchLines();
    gFocustxt = true;

    renderCanvas();
}

function onDeleteLine() {
    deleteLine();
    renderCanvas();
}

function onAddLine() {
    addLine();
    gFocustxt = true;

    renderCanvas();
}


function addDragDrop() {
    gCanvas.addEventListener('mousedown', dragText);
    gCanvas.addEventListener('mouseup', dropText);
    gCanvas.addEventListener('mousemove', moveText);

    gCanvas.addEventListener('touchstart', dragText);
    gCanvas.addEventListener('touchend', dropText);
    gCanvas.addEventListener('touchmove', moveText);
}


function dragText(ev) {

    ev.preventDefault();
    ev.stopPropagation();

    var offsetX;
    var offsetY;
    if (ev.type === 'touchstart') {
        offsetX = ev.changedTouches[0].pageX - gCanvas.getBoundingClientRect().left;
        offsetY = ev.changedTouches[0].pageY - gCanvas.getBoundingClientRect().top;
    } else {
        offsetX = ev.offsetX;
        offsetY = ev.offsetY;
    }

    var meme = getMeme();
    var lines = meme.lines;
    var idx = 0;
    lines.forEach(function(line) {
        if (offsetX > line.positionX - 160 &&
            offsetX < line.positionX + 160 &&
            offsetY > line.positionY - 40 &&
            offsetY < line.positionY + 10) {
            switchLinesDragDrop(idx);
            updateDragging(idx, 'lines', true);
            document.querySelector('.control-txt-input').value = line.txt;
            renderCanvas();
            gDragOn = true;
            gFocustxt = true;

            return;
        }
        idx++;
    })

    gCurrPosX = offsetX;
    gCurrPosY = offsetY;
    renderCanvas();
}

function dropText(ev) {

    ev.preventDefault();
    ev.stopPropagation();

    gDragOn = false;

    var meme = getMeme();
    if (gFocustxt) {
        var lines = meme.lines;
        var idx = 0;
        lines.forEach(function(line) {
            if (line.isDragging) {
                updateDragging(idx, 'lines', false);
                return;
            }
            idx++;
        })
    }

    gCurrPosX = undefined;
    gCurrPosY = undefined;
}


function moveText(ev) {

    if (gDragOn) {

        ev.preventDefault();
        ev.stopPropagation();

        var offsetX;
        var offsetY;
        if (ev.type === 'touchmove') {
            offsetX = ev.changedTouches[0].pageX - gCanvas.getBoundingClientRect().left;
            offsetY = ev.changedTouches[0].pageY - gCanvas.getBoundingClientRect().top;
        } else {
            offsetX = ev.offsetX;
            offsetY = ev.offsetY;
        }

        var disX = offsetX - gCurrPosX;
        var disY = offsetY - gCurrPosY;

        var meme = getMeme();

        if (gFocustxt) {
            var lines = meme.lines;
            lines.forEach(function(line) {
                if (line.isDragging) {
                    changePositionX(disX);
                    changePositionY(disY);
                }
            })
        }

        renderCanvas()

        gCurrPosX = offsetX;;
        gCurrPosY = offsetY;;
    }
}


function onDownloadMeme(elLink) {
    gNoFocus = true;
    renderCanvas();
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'image';
}