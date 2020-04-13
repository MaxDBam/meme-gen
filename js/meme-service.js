'use strict'


const keyMemes = 'memes';
const keyImgs = 'images';


var gImgs = [{
    id: 1,
    url: 'img/1.jpg'

}, {
    id: 2,
    url: 'img/2.jpg'

}, {
    id: 3,
    url: 'img/3.jpg'

}, {
    id: 4,
    url: 'img/4.jpg'

}, {
    id: 5,
    url: 'img/5.jpg'

}, {
    id: 6,
    url: 'img/6.jpg'

}, {
    id: 7,
    url: 'img/7.jpg'

}, {
    id: 8,
    url: 'img/8.jpg'

}, {
    id: 9,
    url: 'img/9.jpg'

}, {
    id: 10,
    url: 'img/10.jpg'

}, {
    id: 11,
    url: 'img/11.jpg'

}, {
    id: 12,
    url: 'img/12.jpg'

}, {
    id: 13,
    url: 'img/13.jpg'

}, {
    id: 14,
    url: 'img/14.jpg'

}, {
    id: 15,
    url: 'img/15.jpg'

}, {
    id: 16,
    url: 'img/16.jpg'

}, {
    id: 17,
    url: 'img/17.jpg'

}, {
    id: 18,
    url: 'img/18.jpg'

}];



var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,

    lines: [{
        txt: 'Enter something',
        font: 'impact',
        size: 40,
        align: 'center',
        OutlineColor: 'black',
        fillColor: 'white',
        positionX: 250,
        positionY: 50,
        isDragging: false
    }, {
        txt: 'Enter something here',
        font: 'impact',
        size: 40,
        align: 'center',
        OutlineColor: 'black',
        fillColor: 'white',
        positionX: 250,
        positionY: 470,
        isDragging: false
    }],

}

function getMeme() {
    return gMeme;
}


function getImges() {
    return gImgs;
}


function updateMemeImg(imgId) {
    gMeme.selectedImgId = imgId;
}

function getSelectedImg() {
    return gMeme.selectedImgId;
}

function editMeme(key, value) {
    if (gMeme.lines.length === 0) return;
    const lineIdx = gMeme.selectedLineIdx;
    gMeme.lines[lineIdx][key] = value;
}


function changeSize(num) {
    if (gFocustxt) {
        if (gMeme.lines.length === 0) return;
        const lineIdx = gMeme.selectedLineIdx;
        gMeme.lines[lineIdx].size += num;
    }

}

function changePosTexts(width, height) {
    gMeme.lines.forEach(line => {
        line.positionX = (width / 2);
        if (line.positionY > height) line.positionY = (height - 20)
    })
}

function changePosForMobile(pos) {
    gMeme.lines.forEach(line => {
        line.positionX = (pos / 2);
        if (line.positionY > pos - 20) line.positionY = (pos - 20)
    })
}

function changePositionY(num) {
    if (gFocustxt) {
        if (gMeme.lines.length === 0) return;
        const lineIdx = gMeme.selectedLineIdx;
        gMeme.lines[lineIdx].positionY += num;
    }

}

function changePositionX(num) {
    if (gFocustxt) {
        if (gMeme.lines.length === 0) return;
        const lineIdx = gMeme.selectedLineIdx;
        gMeme.lines[lineIdx].positionX += num;
    }

}

function switchLines() {
    if (gMeme.lines.length === 0) return;
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx++;
}

function switchLinesDragDrop(idx) {
    gMeme.selectedLineIdx = idx;
}


function deleteLine() {
    if (gMeme.lines.length === 0) return;

    const lineIdx = gMeme.selectedLineIdx;
    gMeme.selectedLineIdx = 0;
    gMeme.lines.splice(lineIdx, 1);
}

function updateDragging(idx, type, bool) {
    if (type === 'lines') gMeme.lines[idx].isDragging = bool;

}

function addLine() {
    var line = {
        txt: 'Write something',
        font: 'impact',
        size: 40,
        align: 'center',
        OutlineColor: 'black',
        fillColor: 'white',
        positionX: 250,
        positionY: 250
    }
    gMeme.lines.push(line);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}



function restartMeme() {
    gMeme = {
        selectedImgId: 0,
        selectedLineIdx: 0,

        lines: [{
            txt: 'Write something',
            font: 'impact',
            size: 40,
            align: 'center',
            OutlineColor: 'black',
            fillColor: 'white',
            positionX: 225,
            positionY: 50,
            isDragging: false
        }, {
            txt: 'Write something',
            font: 'impact',
            size: 40,
            align: 'center',
            OutlineColor: 'black',
            fillColor: 'white',
            positionX: 225,
            positionY: 470,
            isDragging: false
        }],

    }
}