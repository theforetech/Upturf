const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');
//Make storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename:function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
//init upload
const upload = multer({
    storage:storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file,cb);
    }
}).single('myImage');
//Check File Type
function checkFileType(file,cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Error: Only Images are allowed!');
    }
}
//init app
const app = express();

// ejs 
app.set('view engine', 'ejs');

//public folder
app.use(express.static('./public'));

app.get('/', (req,res) => res.render('index'));

app.post('/upload', (req, res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index', {
                msg: err
            })
        }
        else{
            if(req.file == undefined){
                res.render('index',{
                    msg: 'Error : Please select a file'

                });
            }else{
                res.render('index',{
                    msg: 'File Uploaded',
                    file: `uploads/${req.file.filename}`

                });
            }
        }
    })
});

const port = 3000;
app.listen(port,()=>console.log(`Server is now running on port ${port}`));

