// const multer = require("multer");

// const fileStorageEngine = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "--" + file.originalname);
//   },
// });


// module.exports.upload = multer({ storage: fileStorageEngine });