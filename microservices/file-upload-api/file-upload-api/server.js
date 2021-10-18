const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch")
const fs = require('fs');
const path = require('path')
const app = express();
const moment = require('moment')
const PORT = 8000;
const HOST = '0.0.0.0';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

// app.use(express.static('public'));

const tinified = require("tinify");
tinified.key = "BckYKc5kC1H8DyLL9LXFlX6XtbjSMWCN";

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'surfaturf',
  api_key: '322599954157625',
  api_secret: 'bMZcPmunYAnrUYrvf8icRlt1AMo'
});

const uploadToCloud = async (filePath, name) => {
  try {
    const destination = "./resources/uploads/minified/" + name;
    const source = await tinified.fromFile(filePath);
    await source.toFile(destination)
    console.log("Filename : " + name);
    return await cloudinary.uploader.upload(destination, async function(result) {
      return {
        path: result.secure_url,
        status: 'success'
      }
    });
  } catch(e) {
    return {
      message: `Could not upload the file: ${e}`,
      status: 'error'
    }
  }
}

const fileUpload = async (req, res, next) => {
  try {
    let { name, type, base64str, sportID, turfID, userID } = req.body.input;
    if (base64str === undefined || base64str === null) {
      return res.status(400).json({
        message: 'No file provided'
      })
    }
    if (sportID === undefined && turfID === undefined && userID === undefined) {
      return res.status(400).json({
        message: 'Please add an entity to assign the image to'
      })
    }
    type = type === undefined ? null : type
    sportID = sportID === undefined ? null : sportID
    turfID = turfID === undefined ? null : turfID
    userID = userID === undefined ? null : userID
    name = name === undefined ? null : name.split('.')[0].split(' ').join('') + '-' + moment().format('DDMMYYYYhhmmss') + path.extname(name)
    let fileBuffer = Buffer.from(base64str, 'base64');
    await fs.writeFileSync("./resources/uploads/" + name, fileBuffer, 'base64');

    const resp = await uploadToCloud("./resources/uploads/" + name, name)
    console.log(resp)
    if (resp.status === 'error') {
      return res.status(400).json({
        message: "Upload error"
      })
    }

    // insert into db
    const HASURA_MUTATION = `
      mutation ($url: String!, $sportID: Int, $turfID: bigint, $userID: String) {
        insert_images_one(object: {sport_id: $sportID, url: $url, user_id: $userID, turf_id: $turfID}) {
          id
          sport_id
          turf_id
          url
          user_id
        }
      }
    `;
    const variables = { url: resp.secure_url, sportID: sportID, turfID: turfID, userID: userID };

    // execute the parent mutation in Hasura
    require('axios')({
      url: 'http://graphql-engine:8080/v1/graphql',
      method: 'post',
      data: {
        query: HASURA_MUTATION,
        variables
        },
        headers: {
          "x-hasura-admin-secret": "SurfATurf"
        }
      })
      .then(resp => {
        if ('errors' in resp.data) {
          return res.status(400).json({
            message: resp.data.errors[0].message
          })
        }
        return res.json(resp.data.data.insert_images_one);
      })
      .catch(err => {
        return res.status(400).json({
          message: err.message
        })
      });
    // success
    // return res.json(resp);
  } catch (e) {
    next(e);
  }
}

app.post('/upload', fileUpload)

app.listen(PORT, HOST);
