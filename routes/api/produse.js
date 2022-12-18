const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const uuid = require("uuid");

let connection = require("../../db/connection.js");

let idCont = 0;

function verifyToken(req, res, next) {
    const bearer = req.headers["authorization"];

    if (typeof bearer !== "undefined") {
        const token = bearer.split(" ")[1];
        req.token = token;

        jwt.verify(req.token, "secretkey", (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                idCont = authData.id;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

router.get("/", verifyToken, (req, res) => {

    let produse = [];

    let query = "SELECT code, name FROM produse WHERE idCont = ?";
    let formatted = connection.mysql.format(query, [idCont]);

    connection.dbConn.query(formatted, (err, results) => {
        if (err) {
            throw err;
        }
        if (results.length) {
            results.forEach(product => {produse.push(product)});
            res.json(produse);
        } else {
            console.log("This account doesn't have any products.");
            res.sendStatus(403);
        }
    });
});

router.get("/:code", verifyToken, (req, res) => {

    let query = "SELECT code, name, price, dateAdded FROM produse WHERE idCont = ? AND code = ?";
    let formatted = connection.mysql.format(query, [idCont, req.params.code]);

    connection.dbConn.query(formatted, (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {
            res.json(result);
        } else {
            console.log("This account doesn't have this product code.");
            res.sendStatus(403);
        }
    });
});

router.post("/", verifyToken, (req, res) => {

    const produs = {
        code: uuid.v4(),
        name: req.body.name,
        price: req.body.price,
        idCont: idCont
    };

    if (!produs.name || !produs.price) {
        return res.sendStatus(400);
    }

    connection.dbConn.query("INSERT INTO produse (code, name, price, idCont) VALUES (?)", [Object.values(produs)], (err) => {
        if (err) {
            console.log("The 'produse' couldn't be inserted.");
            throw err;
        } else {
            console.log("The 'produse' were inserted.");
        }
    });

    delete produs.idCont;

    res.json(produs);
});

router.put("/:code", verifyToken, (req, res) => {
    
    let query = "SELECT name, price FROM produse WHERE idCont = ? AND code = ?";
    let formatted = connection.mysql.format(query, [idCont, req.params.code]);

    connection.dbConn.query(formatted, (err, result) => {
        if (err) {
            throw err;
        }
        if (result.length) {

            if (
                updateProduct(
                    req.params.name ?? result[0].name, 
                    req.params.price ?? result[0].price, 
                    req.params.code
                )
            ) {
                res.json({message: "Contul a fost actualizat"});
            } else {
                res.sendStatus(400);
            }

            res.json(result);
        } else {
            console.log("This account doesn't have this product code.");
            res.sendStatus(403);
        }
    });
});

router.delete("/:id", (req, res) => {
    const amGasit = conturi.some(
        cont => cont.id === parseInt(req.params.id)
    );

    if (amGasit) {
        conturi = conturi.filter(cont => cont.id !== parseInt(req.params.id));

        res.json({
            message: "Contul a fost sters",
            conturi
        });
    } else {
        res.sendStatus(400);
    }
});

function updateProduct(name, price, code) {

    let query = "UPDATE produse SET name = ?, price = ? WHERE code = ?";
    let formatted = connection.mysql.format(query, [name, price, code]);

    connection.dbConn.query(formatted, (err, result) => {
        if (err) {
            throw err;
        }

        return true;
    });
}

module.exports = router;