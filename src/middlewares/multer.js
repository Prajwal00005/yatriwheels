const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const allowedFileType = ['image/png', 'image/jpeg', 'image/jpg']

    if (!allowedFileType.includes(file.mimetype)) {
      cb(new Error('file type is not allowed'))
      return
    }

    cb(null, './uploads')
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname)
  }
})

module.exports = storage
