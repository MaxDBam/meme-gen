'use strict';

const gImgs = [
    {
        id: 1,
        url: './img/2.jpg',
        keywords: ['happy']
    },
    {
        id: 2,
        url: './img/003.jpg',
        keywords: ['president']
    }
];

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,

    lines: [
        {
            txt: 'Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
};

function getMeme() {
    return gMeme;
}

function getImgSrc(imgToFind) {
    let imgId = gImgs.find(img => img.id === imgToFind.selectedImgId);
    // console.log(imgId);
    return imgId;
}

function getImgs() {
    return gImgs;
}
