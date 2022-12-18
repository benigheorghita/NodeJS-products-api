const express = require('express');
var mysql = require('mysql');

var dbConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodedb"
});

dbConn.connect(err => {
    if (err) {
        throw err;
    }

    console.log("M-am conectat la MySql");
});

module.exports = {
    dbConn: dbConn,
    mysql: mysql
};