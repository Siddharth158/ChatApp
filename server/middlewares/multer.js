import multer from "multer";



export const muterUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5,
    }
});