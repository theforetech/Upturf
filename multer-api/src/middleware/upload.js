const util = require("util");
const multer = require("multer");
const fs = require('fs');
const path= require('path')
const moment = require('moment')
const maxSize = 2 * 1024 * 1024;

const tinified = require("tinify");
tinified.key = "BckYKc5kC1H8DyLL9LXFlX6XtbjSMWCN";

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'surfaturf',
    api_key: '322599954157625',
    api_secret: 'bMZcPmunYAnrUYrvf8icRlt1AMo'
});

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources/uploads/");
    },
    filename:function(req, file, cb){
        file.fileName = file.originalname.split('.')[0].split(' ').join('') + '-' + moment().format('DDMMYYYYhhmmss') + path.extname(file.originalname);
        cb(null,file.fileName);
    },
});


// let uploadFileMiddleware = util.promisify(uploadFile);
// module.exports = uploadFileMiddleware;

exports.uploadFile = function(req, res) {
    let upload = multer({
        storage: storage,
        limits: { fileSize: maxSize },
        fileFilter: function(req, file, cb){
            checkFileType(file,cb);
        },
    }).single("file");
    //Check File Type
    function checkFileType(file, cb){
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if(mimetype && extname){
            return cb(null, true);
        }
        else{
            cb('Error: Only Images are allowed!');
        }
    }
    upload(req, res, async function(err) {
        if (err) {
            res.send(err);
        }
        const destination = __basedir + "/resources/uploads/minified/" + req.file.fileName;
        const source = await tinified.fromFile(req.file.path);
        await source.toFile(destination)
        console.log("Filename : " + req.file.filename);
        let count = 0;
        return await stater();

        async function stater() {
            await fs.stat(__basedir + "/resources/uploads/minified/" + req.file.fileName, async function(err, stats) {
                if (err) {
                    if (count++ < 4) {
                        return stater();
                    }
                    return await res.status(500).send({
                        message: `Could not upload the file: ${err}`,
                        status: 'error'
                    });
                } else {
                    await cloudinary.uploader.upload(__basedir + "/resources/uploads/minified/" + req.file.fileName, async function(result) {
                        const coverImageURL = result.secure_url;
                        return await res.status(200).send({
                            path: coverImageURL,
                            status: 'success'
                        });
                    });
                }
            });
        }
    })
}
