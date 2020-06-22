


var Resources = {

    folderPath: './resources',

    Images: {

    }

}

Resources.Images.folderPath = Resources.folderPath + '/images',

Resources.Images.getPathForImageWithName = function(imageName) {
    return Resources.Images.folderPath + '/' + imageName
}

Resources.Images.getNewImageTagForImageWithName = function(imageName) {
    var imageTag = document.createElement('IMG')
    imageTag.setAttribute('src', Resources.Images.getPathForImageWithName(imageName))
    return imageTag
}