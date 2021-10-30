'use strict';

const gKeywords = {
    'funny': 2.5, 'ANIMAL': 1, 'men': 1.5, 'woman': 2.5, 'dog': 1.5,
    'happy': 2, 'smile': 2, 'cartoon': 2, 'cat': 2, 'sports': 2,
    'movie': 2, 'president': 1, 'cute': 2
};

const gImgs = [
    {
        id: 1,
        url: './img/2.jpg',
        keywords: ['happy', 'woman', 'smile']
    },
    {
        id: 2,
        url: './img/003.jpg',
        keywords: ['funny', 'president', 'men']
    },
    {
        id: 3,
        url: './img/004.jpg',
        keywords: ['ANIMAL', 'dog', 'cute']
    },
    {
        id: 4,
        url: './img/5.jpg',
        keywords: ['funny', 'cute']
    },
    {
        id: 5,
        url: './img/005.jpg',
        keywords: ['ANIMAL', 'dog', 'cute']
    },
    {
        id: 6,
        url: './img/006.jpg',
        keywords: ['ANIMAL', 'cute', 'cat']
    },
    {
        id: 7,
        url: './img/8.jpg',
        keywords: ['smile', 'happy', 'movie']
    },
    {
        id: 8,
        url: './img/9.jpg',
        keywords: ['funny', 'smile', 'happy']
    },
    {
        id: 9,
        url: './img/12.jpg',
        keywords: ['movie', 'men']
    },
    {
        id: 19,
        url: './img/19.jpg',
        keywords: ['movie', 'men']
    },
    {
        id: 11,
        url: './img/Ancient-Aliens.jpg',
        keywords: ['movie', 'happy', 'smile', 'men']
    },
    {
        id: 12,
        url: './img/drevil.jpg',
        keywords: ['funny', 'movie', 'men']
    },
    {
        id: 13,
        url: './img/img2.jpg',
        keywords: ['funny', 'happy']
    },
    {
        id: 14,
        url: './img/img4.jpg',
        keywords: ['president', 'funny', 'men']
    },
    {
        id: 15,
        url: './img/img5.jpg',
        keywords: ['funny', 'cute']
    },
    {
        id: 16,
        url: './img/img6.jpg',
        keywords: ['dog', 'ANIMAL', 'cute', 'funny']
    },
    {
        id: 17,
        url: './img/img11.jpg',
        keywords: ['president', 'smile', 'happy', 'men']
    },
    {
        id: 18,
        url: './img/img12.jpg',
        keywords: ['funny', 'men', 'sports']
    },
    {
        id: 19,
        url: './img/leo.jpg',
        keywords: ['happy', 'smile', 'movie', 'men']
    },
    {
        id: 20,
        url: './img/meme1.jpg',
        keywords: ['movie', 'men']
    },
    {
        id: 21,
        url: './img/One-Does-Not-Simply.jpg',
        keywords: ['funny', 'men', 'movie']
    },
    {
        id: 22,
        url: './img/Oprah-You-Get-A.jpg',
        keywords: ['woman', 'funny', 'happy', 'smile']
    },
    {
        id: 23,
        url: './img/patrick.jpg',
        keywords: ['funny', 'smile', 'happy', 'men', 'movie']
    },
    {
        id: 24,
        url: './img/putin.jpg',
        keywords: ['president', 'men']
    },
    {
        id: 25,
        url: './img/X-Everywhere.jpg',
        keywords: ['cartoon', 'men', 'happy', 'smile']
    }
];

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,

    lines: [
        {
            txt: 'Falafel',
            size: 24,
            font: 'impact',
            align: 'left',
            color: 'white',
            stroke: 'black',
            x: 260,
            y: 45
        },
        {
            txt: 'Second Falafel',
            size: 24,
            font: 'impact',
            align: 'left',
            color: 'white',
            stroke: 'black',
            x: 260,
            y: 280
        }
    ]
};

var gFilterImgs = 'all';

function getKeywords() {
    return gKeywords;
}

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

function addMeme(txt, size, font, align, color, stroke, x, y) {
    gMeme.lines.push({
        txt,
        size,
        font,
        align,
        color,
        stroke,
        x,
        y
    });
}

function removeMemeTxt(lineId) {
    let memeLineIdx = gMeme.lines.findIndex((line, idx) => lineId === idx);
    gMeme.lines.splice(memeLineIdx, 1);
}

function setFilter(keyword) {
    gFilterImgs = keyword;
}

function getFilteredImgs(queryBy) {
    const filteredImgs = gImgs.filter(img => {
        if (gFilterImgs !== 'all' && !queryBy) {
           return img.keywords.includes(gFilterImgs);
        } else if (queryBy !== undefined) {
            gFilterImgs = 'all';
            return img.keywords.some(keyword => keyword.toLowerCase().includes(queryBy));
        } else return img;

    });
    return filteredImgs;
}