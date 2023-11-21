const multer = require('multer')
const path = require('path')

const tmpFolder = path.resolve(__dirname, '..')

const uploadFolder = path.resolve(tmpFolder, 'images')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadFolder)
    },
    filename(req, file, callback) {
        const fileHash = Date.now()
        const fileName = `${fileHash}-imagem-${file.originalname}`
        return callback(null, fileName)
    },
})

module.exports = { tmpFolder, uploadFolder, storage }
