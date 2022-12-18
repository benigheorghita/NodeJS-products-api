const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

let connection = require("../../db/connection.js");

router.post("/", (req, res) => {
console.log(req.body);
    if (
        (typeof req.body.code === "undefined" || typeof req.body.secretKey === "undefined") || 
        (!req.body.code.length || !req.body.secretKey.length)
    ) {
        res.sendStatus(403);
        return;
    }

    let query = "SELECT id FROM conturi WHERE code = ? AND secretKey = ?";
    let formatted = connection.mysql.format(query, [req.body.code, req.body.secretKey]);

    connection.dbConn.query(formatted, (err, results) => {
        if (err) {
            throw err;
        }
        if (results.length) {
            console.log("response", results);
            jwt.sign({id: results[0].id}, "secretkey", (err, token) => {
                res.json(token);
            });
        } else {
            console.log("This account do not exists.");
            res.sendStatus(403);
        }
    });
});

module.exports = router;