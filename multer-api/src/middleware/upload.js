const util = require("util");
const multer = require("multer");
const fs = require('fs');
const path= require('path')
const moment = require('moment')
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources/static/assets/uploads/");
    },
    filename:function(req, file, cb){
        file.fileName = file.originalname.split('.')[0].split(' ').join('') + '-' + moment().format('DDMMYYYYhhmmss') + path.extname(file.originalname);
        cb(null,file.fileName);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function(req, file, cb){
        checkFileType(file,cb);
    },

}).single("file");
//Check File Type
function checkFileType(file,cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Error: Only Images are allowed!');
    }
}
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;