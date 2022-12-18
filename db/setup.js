let connection = require("./connection.js");

connection.dbConn.query(
    "CREATE TABLE IF NOT EXISTS conturi (id INT NOT NULL AUTO_INCREMENT, code VARCHAR(50), secretKey VARCHAR(255), dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, " + 
    "PRIMARY KEY (id), UNIQUE KEY code (code))", 
    (err) => {
        if (err) {
            console.log("The table conturi couldn't be created.");
            throw err;
        } else {
            console.log("The table conturi was created or already existed.");
        }
    }
);

var conturi = [];
var produse = [];

connection.dbConn.query("SELECT id, code, secretKey FROM conturi", (err, results) => {
    if (results.length) {
        console.log("The accounts were already created.");
        setConturi(results);
    } else {
        insertConturi();
    }
});

connection.dbConn.query(
    "CREATE TABLE IF NOT EXISTS produse (id INT NOT NULL AUTO_INCREMENT, code VARCHAR(50), name VARCHAR(255), price DECIMAL(10, 2), idCont INT NOT NULL, " + 
    "dateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), UNIQUE KEY code (code), FOREIGN KEY (idCont) REFERENCES conturi(id))", 
    (err) => {
        if (err) {
            console.log("The table produse couldn't be created.");
            throw err;
        } else {
            console.log("The table produse was created or already existed.");
        }
    }
);

connection.dbConn.query("SELECT code FROM produse", (err, results) => {
    if (results.length) {
        console.log("The products were already created.");
        setProduse(results);
    } else {
        insertProduseVendor();
        insertProduseAdmin();
    }
});

function setProduse(data) {
    produse = data;
    console.log("produse", produse);
}

function insertProduseVendor() {
    insertProduse(15, "PRODUCT_", conturi[1].id);
}

function insertProduseAdmin() {
    insertProduse(3, "PRODUCT_ADMIN_", conturi[0].id);
}

function insertProduse(numarProduse, prefix, idCont)
{
    let produse = [];

    for (n = 1; n <= numarProduse; n++) {
        let produs = [
            prefix + n,
            "Product number " + n,
            parseFloat(Math.random() * n).toFixed(2),
            idCont
        ];

        produse.push(produs);
    }

    connection.dbConn.query("INSERT INTO produse (code, name, price, idCont) VALUES ?", [produse], (err) => {
        if (err) {
            console.log("The 'produse' couldn't be inserted.");
            throw err;
        } else {
            console.log("The 'produse' were inserted.");
        }
    });
}

function setConturi(data) {
    conturi = data;
    console.log("conturi", conturi);
}

function insertConturi()
{
    connection.dbConn.query("INSERT INTO conturi (code, secretKey) VALUES ('admin', 'myhash'), ('vendor', 'vendorhash')", (err) => {
        if (err) {
            console.log("The 'conturi' couldn't be inserted.");
            throw err;
        } else {
            console.log("The 'conturi' were inserted.");
        }
    });
}





