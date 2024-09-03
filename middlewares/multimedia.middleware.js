const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

const filefilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|svg|webp|gif|avif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error("File not supported"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: filefilter,
});

module.exports = upload;
