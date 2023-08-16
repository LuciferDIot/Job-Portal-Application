import path from 'path';
import multer from "multer";

const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, './upload/');
    // },
    filename: (req, file, cb) => {
        var ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

const upload = multer({ storage });

export default upload;