'use strict'

function onInit() {
    onRenderGallery()

}

function onRenderGallery() {
    var imgs = getImges()
    var strHtml = ''
    imgs.forEach(img => {
        strHtml += `<img src="${img.url}" id="img-num-${img.id}" onclick="onRenderCanvas(${img.id})">`
    })
    document.querySelector('.gallery-container').innerHTML = strHtml
    document.querySelector('.nav-gallery').classList.add('active')

}





function onEditCurrMeme(idx) {
    editCurrMeme(idx)
    var meme = getMeme()
    onRenderCanvas(meme.selectedImgId)
}

function onRenderCanvas(imgId) {
    updateMemeImg(imgId)
    renderCanvas()

    gFirstLoad = true
    document.querySelector('.canvas-container').style.display = "flex"
    document.querySelector('.gallery-container').style.display = "none"
}

function onGetGalleryPage() {
    restartMeme()
    gFirstLoad = true
    gFocustxt = true

    document.querySelector('.canvas-container').style.display = "none"
    document.querySelector('.gallery-container').style.display = "grid"
    document.querySelector('.nav-gallery').classList.add('active')

}