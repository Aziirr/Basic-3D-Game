const express = require("express")
const app = express()
const PORT = 3000;
const nedb = require("nedb")
const bodyParser = require("body-parser")
let db = new nedb({
    filename: "db1.db",
    autoload: true
})
let _3d_level
app.use(express.static('static'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post("/save_level", function (req, res) {
    let data = req.body
    let save_time = new Date()
    let date_formatted = save_time.getDate() + "." + (save_time.getMonth() + 1) + "." + save_time.getFullYear() + " - " + save_time.getHours() + ":" + save_time.getMinutes() + ":" + save_time.getSeconds()
    let doc = {
        date_formatted: date_formatted,
        date: Date.now(),
        data: data
    }
    db.insert(doc, function (err, newDoc) {
    });
    res.sendStatus(200)
})
app.post("/load_latest", function (req, res) {
    db.find({}).sort({date: -1}).limit(1).exec(function (err, docs) {
        res.status(200).send(docs)
    });
})
app.post("/load_custom_list", function (req, res) {
    db.find({}).sort({date: -1}).exec(function (err, docs) {
        res.status(200).send(docs)
    });
})
app.post("/load_custom_level", function (req, res) {
    db.find({_id: req.body.id}).exec(function (err, docs) {
        res.status(200).send(docs)
    });
})
app.post("/save_3d", function (req, res) {
    _3d_level = req.body[0]
    res.sendStatus(200)
})
app.post("/load_3d", function (req, res) {
    res.status(200).send(_3d_level)
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})