const { uploadFile } = require("../middleware/upload");
const fs = require('fs');
const baseUrl = "http://localhost:8080/files/";

const upload = async (req, res) => {
    try {
        return await uploadFile(req, res);
        if (req.file === undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${err}`,
            status: 'error'
        });
    }
};

const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/uploads/";

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: baseUrl + file,
            });
        });

        res.status(200).send(fileInfos);
    });
};

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/uploads/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

module.exports = {
    upload,
    getListFiles,
    download,
};
