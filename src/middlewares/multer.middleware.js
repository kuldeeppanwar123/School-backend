import multer from 'multer';
import storage from "../config/multer.config.js";

const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000}
}).single('file');

export default upload;