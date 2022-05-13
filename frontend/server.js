/* Import express and other dependencies */
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const exp = require("constants");

/* Assign express to a variable for easier referencing */
const app = express();

/* Set "app" to listen on a specified port */
const PORT = process.env.PORT || 5500;

/* Initialize middlewares */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("body-parser").json());
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

/* Set up the home route via GET */
app.use(express.static("public"));
app.get("/", (req, res) => res.send("public/"));

/* Launch the server on specified PORT and print a log */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
