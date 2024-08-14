const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();
const Multer_upload = multer({ storage: storage });
module.exports = {Multer_upload}
