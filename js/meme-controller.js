'use strict';

var gCanvas = document.querySelector('.meme-canvas');
var gCtx = gCanvas.getContext('2d');
var gFirstRender = false;
var gTxtLineFocus = true;
var gAddedNewLine = false;
var gOnMore = false;
var gDragging = false;
var gTextEl = document.querySelector('input[type="text"');
var gChosenImg;
var elMenuBtn = document.querySelector('.btn-menu');


function onInit() {
    onRenderGallery();
    onRenderKeywords();
}

function onSearch(query) {
    onRenderGallery(query);
}

function onRenderKeywords() {
    let keywords = getKeywords();
    let elKeywords = document.querySelector('.keywords-container');
    let strHTMLs = '';
    // var strHTMls = Object.getOwnPropertyNames(gKeywords).map(keyword => `<button class="btn-keyword ${keyword}" onclick="" style="font-size: ">${keyword}<button>`);
    for (let key in keywords) if (keywords.hasOwnProperty(key)) {
        strHTMLs += `<button class="btn-keyword ${key}" onclick="onFilterImgs('${key}')" style="font-size: ${keywords[key]}rem">${key}</button>`;
        if (key === 'happy' && !gOnMore) {
            strHTMLs += '<button class="btn-more" onclick="onMoreKeywords()">more...</button>';
            break;
        }
    }

    if (gOnMore) strHTMLs += '<button class="btn-less" onclick="onLessKeywords()">less...</button>';
    elKeywords.innerHTML = strHTMLs;
}

function onMoreKeywords() {
    gOnMore = true;
    document.querySelector('.search-filter-container').classList.replace('search-filter-container', 'search-filter-container-more');
    onRenderKeywords();
}

function onLessKeywords() {
    gOnMore = false;
    document.querySelector('.search-filter-container-more').classList.replace('search-filter-container-more', 'search-filter-container');
    // document.querySelector('.keywords-container').style.width = 'auto';
    // document.querySelector('.search-filter-container').style.height = '100px';
    onRenderKeywords();
}

function onFilterImgs(keyword) {
    setFilter(keyword);
    let elKeywordBtn = document.getElementsByClassName(keyword)[0];
    let elKeywordStyle = window.getComputedStyle(elKeywordBtn, null).getPropertyValue('font-size');
    let currSize = parseFloat(elKeywordStyle);
    elKeywordBtn.style.fontSize = ((currSize / 16) + 0.0625) + 'rem';
    document.querySelector('.search-keyword').value = keyword;
    onRenderGallery();
}

function drawImgOnCanvas(chosenImg) {
    var img = new Image();
    var meme = getMeme();
    // img.crossOrigin = 'anonymous';
    gChosenImg = chosenImg;
    img.src = chosenImg.url;
    img.onload = () => {

        var ratio = img.naturalWidth / img.naturalHeight;
        gCanvas.height = gCanvas.width / ratio;
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawTxtOnImg();
        if (gTxtLineFocus && meme.lines.length >= 1) {
            onDrawFocusOverSelectedTxtLine(meme.lines[meme.selectedLineIdx].x, meme.lines[meme.selectedLineIdx].y);
        } else {
            gTxtLineFocus = false;
            return;
        }
        document.querySelector('.canvas-container').style.display = 'flex';
        document.querySelector('.img-gallery').style.display = 'none';
        document.querySelector('.search-filter-container').style.display = 'none';
        gFirstRender = false;
    }

}

function drawTxtOnImg() {
    var meme = getMeme();

    let memeLines = meme.lines.map((line, idx) => {
        gCtx.font = line.size + 'px ' + line.font;
        gCtx.fillStyle = line.color;
        gCtx.strokeStyle = line.stroke;
        gCtx.textAlign = 'left';
        let actualTxtWidth = gCtx.measureText(line.txt).width;
        if (gFirstRender) {
            line.x = (gCanvas.width / 2) - (actualTxtWidth / 2);
            if (idx === 1) {
                line.y = gCanvas.height - 25;
            }
        }
        gCtx.fillText(line.txt, line.x, line.y);
        gCtx.strokeText(line.txt, line.x, line.y);
    })
}

function onEnterTxt(txt) {
    let memeToChangeTxt = getMeme();
    let imgSrc = getImgSrc(memeToChangeTxt);
    memeToChangeTxt.lines[memeToChangeTxt.selectedLineIdx].txt = txt;
    drawImgOnCanvas(imgSrc);
}

function onRenderGallery(queryBy) {
    const galleryImgs = getFilteredImgs(queryBy);
    const elGallery = document.querySelector('.img-gallery');
    let strHTMLs = galleryImgs.map(img => `<img class="img-item" src="${img.url}" onclick="onRenderImgOnCanvas(${img.id})">`);
    elGallery.innerHTML = strHTMLs.join('');

}

function onRenderImgOnCanvas(imgId) {
    gFirstRender = true;
    if (gOnMore) {
        onLessKeywords();
    }
    let memeForCanvas = getMeme();
    memeForCanvas.selectedImgId = imgId;
    let imgSrc = getImgSrc(memeForCanvas);
    if (innerWidth < 560) {
        gCanvas.width = 330;
    } else gCanvas.width = 540;
    drawImgOnCanvas(imgSrc);
}

function onIncOrDecTxtFontSize(num) {
    var meme = getMeme();
    if (num > 0) {
        meme.lines[meme.selectedLineIdx].size++;
    } else meme.lines[meme.selectedLineIdx].size--;

    let imgSrc = getImgSrc(meme);
    drawImgOnCanvas(imgSrc);
}

function onRaiseOrLowerTxtOnImg(num) {
    let meme = getMeme();
    if (num > 0) {
        meme.lines[meme.selectedLineIdx].y++;
    } else meme.lines[meme.selectedLineIdx].y--;

    let imgSrc = getImgSrc(meme);
    drawImgOnCanvas(imgSrc);
}

function onSwitchBetweenTxtLines() {
    var meme = getMeme();
    let imgSrc = getImgSrc(meme);
    drawImgOnCanvas(imgSrc);
    gTxtLineFocus = true;
    if (meme.lines.length > 0 && meme.selectedLineIdx < meme.lines.length - 1) {
        meme.selectedLineIdx++;
    } else if (meme.selectedLineIdx === meme.lines.length - 1) {
        meme.selectedLineIdx = 0;
    }

    onDrawFocusOverSelectedTxtLine(meme.lines[meme.selectedLineIdx].x, meme.lines[meme.selectedLineIdx].y);
}

function onDrawFocusOverSelectedTxtLine(txtX, txtY) {
    let meme = getMeme();
    gCtx.globalCompositeOperation = 'source-atop';
    gCtx.globalAlpha = 0.3;
    gCtx.fillStyle = 'white';
    gCtx.font = meme.lines[meme.selectedLineIdx].size + 'px ' + meme.lines[meme.selectedLineIdx].font;
    gCtx.fillRect(txtX - 20, txtY - meme.lines[meme.selectedLineIdx].size - 20, gCtx.measureText(meme.lines[meme.selectedLineIdx].txt).width + 40, meme.lines[meme.selectedLineIdx].size + 40);
    gCtx.strokeRect(txtX - 20, txtY - meme.lines[meme.selectedLineIdx].size - 20, gCtx.measureText(meme.lines[meme.selectedLineIdx].txt).width + 40, meme.lines[meme.selectedLineIdx].size + 40);
    document.querySelector('select').value = meme.lines[meme.selectedLineIdx].font;
}

function onClickLineOnACanvas(ev) {
    var meme = getMeme();
    var offsetX = ev.offsetX;
    var offsetY = ev.offsetY;
    var txtWidth, actualTxtWidth, txtFont;

    var selectedLine;
    var clickedLine = meme.lines.find(line => {
        gCtx.font = line.size + 'px ' + line.font;
        actualTxtWidth = gCtx.measureText(line.txt);
        if (ev.type === 'mousedown') {
            return (offsetX > line.x - 20 && offsetX < line.x + Math.abs(actualTxtWidth.actualBoundingBoxLeft) + Math.abs(actualTxtWidth.actualBoundingBoxRight) + 40 && offsetY > line.y - line.size - 20 && offsetY < line.y + line.size - 15 + 40);
        } else if (ev.type === 'touchstart') {
            return (ev.touches[0].clientX - ev.touches[0].target.offsetLeft > line.x - 20 && ev.touches[0].clientX - ev.touches[0].target.offsetLeft < line.x + Math.abs(actualTxtWidth.actualBoundingBoxLeft) + Math.abs(actualTxtWidth.actualBoundingBoxRight) + 40 && ev.touches[0].clientY - ev.touches[0].target.offsetTop > line.y - line.size - 20 && ev.touches[0].clientY - ev.touches[0].target.offsetTop < line.y + line.size + 25);
        }
    });
    if (clickedLine) {
        selectedLine = meme.lines.findIndex(line => clickedLine.x === line.x && clickedLine.y === line.y);
        meme.selectedLineIdx = selectedLine;
        txtFont = meme.lines[meme.selectedLineIdx].size + 'px ' + meme.lines[meme.selectedLineIdx].font;
        txtWidth = gCtx.measureText(meme.lines[selectedLine].txt).width;
        onSelectLineOnACanvas();
        gTextEl.value = meme.lines[meme.selectedLineIdx].txt;
        gCanvas.onfocus = onEnterTxt;
        if (ev.type === 'mousedown') {
            gDragging = true;
            gCanvas.onmousemove = onDragLineOnACanvas;
        } else if (ev.type === 'touchstart') {
            gDragging = true;
        }
    }
    else {
        gDragging = false;
    } 
}

function onSelectLineOnACanvas() {
    let meme = getMeme();
    let imgSrc = getImgSrc(meme);
    drawImgOnCanvas(imgSrc);
    gTxtLineFocus = true;
    onDrawFocusOverSelectedTxtLine(meme.lines[meme.selectedLineIdx].x, meme.lines[meme.selectedLineIdx].y);
}

function onDragLineOnACanvas(ev) {
    let meme = getMeme();
    let imgSrc = getImgSrc(meme);
    var rect = gCanvas.getBoundingClientRect();
    // var scaleX = gCanvas.width / rect.width;
    var scaleY = gCanvas.height / rect.height;
    gCtx.font = meme.lines[meme.selectedLineIdx].size + 'px ' + meme.lines[meme.selectedLineIdx].font;
    var actualTxtWidth = gCtx.measureText(meme.lines[meme.selectedLineIdx].txt).width;
    
    if (!gDragging) return;
    if (gDragging && ev.type === 'mousemove') {
        meme.lines[meme.selectedLineIdx].x = meme.lines[meme.selectedLineIdx].x + ev.movementX;
        meme.lines[meme.selectedLineIdx].y = meme.lines[meme.selectedLineIdx].y + ev.movementY;
    } else if (gDragging && ev.type === 'touchmove') {
        meme.lines[meme.selectedLineIdx].x = ev.touches[0].clientX - ((actualTxtWidth / 2) + meme.lines[meme.selectedLineIdx].size);
        meme.lines[meme.selectedLineIdx].y = (ev.touches[0].clientY - rect.top) * scaleY;
    }
    drawImgOnCanvas(imgSrc);
}

function onMouseUpOnCanvas(ev) {
    if (ev.type === 'mouseup') {
        gDragging = false;
        gCanvas.onmousemove = null;
    } else if (ev.type === 'touchend') {
        gDragging = false;
        gCanvas.ontouchmove = null;
        return;
    }
}

function onAddTxtLine() {
    let meme = getMeme();
    let imgSrc = getImgSrc(meme);
    var txt;
    var txtWidth;
    gCtx.globalAlpha = 1;
    gAddedNewLine = true;
    if (!meme.lines.length || meme.lines.length === 0) {
        txt = 'Falafel';
        txtWidth = gCtx.measureText(txt).width;
        addMeme(txt, 20, 'impact', 'center', 'white', 'black', gCanvas.width / 2 - (txtWidth / 2), 0 + 20);
        meme.selectedLineIdx = 0;
    } else if (meme.lines.length === 1) {
        txt = 'Second falafel';
        txtWidth = gCtx.measureText(txt).width;
        addMeme(txt, 20, 'impact', 'center', 'white', 'black', gCanvas.width / 2 - (txtWidth), gCanvas.height - 20);
        meme.selectedLineIdx = 1;
    } else {
        meme.selectedLineIdx = meme.lines.length - 1;
        txt = 'Write a new meme';
        txtWidth = gCtx.measureText(txt).width;
        addMeme('Write a new meme', 20, 'impact', 'center', 'white', 'black', gCanvas.width / 2 - (txtWidth / 2), (gCanvas.height / 2) - 20);
        meme.selectedLineIdx = meme.lines.length - 1;
    }
    drawImgOnCanvas(imgSrc);
    // drawTxtOnImg();
    onDrawFocusOverSelectedTxtLine(meme.lines[meme.selectedLineIdx].x, meme.lines[meme.selectedLineIdx].y);
    gAddedNewLine = false;
}

function onRemoveTxtLine() {
    let meme = getMeme();
    let imgSrc = getImgSrc(meme);
    removeMemeTxt(meme.selectedLineIdx);
    drawImgOnCanvas(imgSrc);
    meme.selectedLineIdx = 0;
}

function onAlignTxtToLeft() {
    let meme = getMeme();
    let imgSrc = getImgSrc(meme);
    meme.lines[meme.selectedLineIdx].x = 0;
    meme.lines[meme.selectedLineIdx].align = 'left';
    drawImgOnCanvas(imgSrc);
}

function onAlignTxtToCenter() {
    let meme = getMeme();
    let imgSrc = getImgSrc(meme);
    meme.lines[meme.selectedLineIdx].align = 'center';
    meme.lines[meme.selectedLineIdx].x = gCanvas.width / 2 - (gCtx.measureText(meme.lines[meme.selectedLineIdx].txt).width / 2);
    drawImgOnCanvas(imgSrc);
}

function onAlignTxtToRight() {
    let meme = getMeme();
    let imgSrc = getImgSrc(meme);
    var txtWidth = gCtx.measureText(meme.lines[meme.selectedLineIdx].txt).width;
    meme.lines[meme.selectedLineIdx].x = gCanvas.width - txtWidth;
    meme.lines[meme.selectedLineIdx].align = 'right';
    drawImgOnCanvas(imgSrc);
}

function onSetTxtFont(chosenFont) {
    let meme = getMeme();
    let imgSrc = getImgSrc(meme);
    meme.lines[meme.selectedLineIdx].font = chosenFont;
    gCtx.font = meme.lines[meme.selectedLineIdx].size + 'px ' + chosenFont;
    drawImgOnCanvas(imgSrc);

}

function onChangeStrokeColor(chosenColor) {
    const meme = getMeme();
    const imgSrc = getImgSrc(meme);
    meme.lines[meme.selectedLineIdx].stroke = chosenColor;
    drawImgOnCanvas(imgSrc);
}

function onChangeFillStyleColor(chosenColor) {
    const meme = getMeme();
    const imgSrc = getImgSrc(meme);
    meme.lines[meme.selectedLineIdx].color = chosenColor;
    drawImgOnCanvas(imgSrc);
}

function onDownloadCanvas(elLink) {
    const data = gCanvas.toDataURL('image/jpg');
    elLink.href = data;
    elLink.download = 'img.jpg'
}

function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`);
    }
    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open');
    var elHead = document.querySelector('.head');
    if (!gOnMore) {
        var elSearchContainer = document.querySelector('.search-filter-container');
    } else var elSearchContainer = document.querySelector('.search-filter-container-more');

    var elNav = document.querySelector('nav');

    if (!elNav.classList.contains('display-menu')) {
        elHead.style.height = '198px';
        elSearchContainer.style.marginBlockStart = '198px';
        elNav.classList.add('display-menu');
        elNav.style.display = 'block';
        elMenuBtn.className = 'close-menu';
        elMenuBtn.innerText = 'X';
    } else if (elNav.classList.contains('display-menu')) {
        elNav.classList.remove('display-menu');
        elSearchContainer.style.marginBlockStart = '70px';
        elHead.style.height = '66px';
        elNav.style.display = 'none';
        elMenuBtn.className = 'btn-menu';
        elMenuBtn.innerText = '☰';
    }

}

function onToAboutPage() {
    var activePages = document.getElementsByClassName('active');
    let aboutPageEl = document.querySelector('.about-link');
    activePages[0].classList.remove('active');
    aboutPageEl.classList.add('active');
    document.querySelector('main').style.display = 'none';
    if (gOnMore) {
        document.querySelector('.search-filter-container-more').style.display = 'none';
    } else document.querySelector('.search-filter-container').style.display = 'none';

    onToggleMenu();
    document.querySelector('.about').style.display = 'flex';
}

function checkWindowSizeWidth() {
    var elNav = document.querySelector('nav');
    var elHead = document.querySelector('.head');

    if (!gOnMore) {
        var elSearchContainer = document.querySelector('.search-filter-container');
    } else var elSearchContainer = document.querySelector('.search-filter-container-more');


    if (window.innerWidth < 560 && !elNav.classList.contains('display-menu')) {
        elNav.style.display = 'none';
        elSearchContainer.style.marginBlockStart = '70px';
    } else if (window.innerWidth < 560 && elNav.classList.contains('display-menu')) {
        elNav.style.display = 'block';
    } else if (window.innerWidth > 560) {
        elNav.style.display = 'flex';
        elHead.style.height = '66px';
        elNav.classList.remove('display-menu');
        document.body.classList.remove('menu-open');
        elMenuBtn.innerText = '☰';
        elSearchContainer.style.marginBlockStart = 'auto';
    }

}

gCanvas.ontouchstart = onClickLineOnACanvas;

gCanvas.addEventListener('touchstart', e => {
    e.preventDefault();
    gDragging = true;
    onClickLineOnACanvas(e);
});

gCanvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (gDragging) onDragLineOnACanvas(e);
});

gCanvas.addEventListener('touchend', e => {
    e.preventDefault();
    gDragging = false;
});

window.addEventListener('resize', () => {
    if (gChosenImg !== undefined) {
        if (window.innerWidth < 560) {
            gCanvas.width = 330;
            gCanvas.height = 300;
            drawImgOnCanvas(gChosenImg);
        } else {
            gCanvas.width = 540;
            gCanvas.height = 550;
            drawImgOnCanvas(gChosenImg)
        }

    }
    checkWindowSizeWidth();
})