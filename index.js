/* Import express and other dependencies */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

/* Within app we call the top-level function exported by express module */
const app = express();

/* Set "app" to listen on a specified port */
const PORT = process.env.PORT || 8080;

/* Initialize middlewares */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

/* Connect to DB, using URL */
mongoose
    .connect(
        process.env.DB_URL ||
            "mongodb+srv://FViscuso:doubledecker08@cluster0.33f6h.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("Connection to mongoDB successful");
    })
    .catch((err) => {
        console.error("Connection to mongoDB failed: ", err);
    });

/* Set up the home route via GET */
app.get("/", (req, res) => res.send("Welcome to the backend server!"));

/* CRUD ENDPOINTS ---------------------------------*/

/* Save path to .json file as a constant */
const jsonPath = __dirname + "/data.json";
/* Create an array as temporary DB and initialize it with
   the contents of data.json */
function initializeDB(path) {
    console.log(path);
    return fs.readFileSync(path).toString("utf-8");
}

const basicDB = JSON.parse(initializeDB(jsonPath));

console.log(basicDB);

/* Set POST route */
app.post("/data", (req, res) => {
    console.log(req.body);
    basicDB.push(req.body);
    console.log(basicDB);

    fs.truncate(jsonPath, 0, () => {
        fs.writeFile(jsonPath, JSON.stringify(basicDB), (err) => {
            if (err) {
                return console.log("Error writing file: " + err);
            } else {
                res.status(200).json({
                    message: "File successfully written",
                });
            }
        });
    });
});

/* Set GET route */
app.get("/data", (req, res) => {
    res.header("Content-Type", "application/json");
    fs.readFile(jsonPath, (err, data) => {
        res.send(data);
    });
});

/* Set DELETE route */
app.delete("/data", (req, res) => {
    console.log(req.body);
    if (req.body.key === "panopticon") {
        basicDB.length = 0;
        fs.writeFile(jsonPath, JSON.stringify(basicDB), (err) => {
            if (err) {
                console.log("Error: ", err);
            } else {
                res.status(200).json({
                    message: "Data successfully erased!",
                });
            }
        });
    } else {
        res.status(401).json({
            message: "Access denied: invalid key",
        });
    }
});

/* Launch the server on specified PORT and print a log */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
