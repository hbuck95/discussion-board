const express = require("express");
const router = express.Router();
const _ = require("lodash");

const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];

router.get("/test", (req, res) => res.json({"message": "This is a test message"}));

router.get("/get", (req,res) => res.json(JSON.stringify(array)));

router.post("/add", (req, res) => {
    array.push(req.body.item);
    res.end("Item added.");
});

router.put("/update", (req, res) => {
    array[0] = req.body.item;
    res.end("Item updated.");
});

router.delete("/delete", (req, res) => {
    _.pullAt(array, 0);
    res.end("Item removed.");
});

module.exports = router;