const cors = require("cors");
const express = require("express");
const app = express();

global.__basedir = __dirname;

const corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

let PORT = 8000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST);
console.log(`Running at localhost:${HOST} : ${PORT}`);
