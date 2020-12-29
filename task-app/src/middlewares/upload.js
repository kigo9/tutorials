const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 1 * 1000000,
  },
  fileFilter(_, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only jpg, jpeg, png file formats allowed!"));
    }

    cb(undefined, true);
  },
});

module.exports = upload;
