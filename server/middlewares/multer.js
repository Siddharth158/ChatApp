import multer from "multer";



const muterUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5,
    }
});

const attachmentsMulter = muterUpload.array("files",5);

export {muterUpload, attachmentsMulter}