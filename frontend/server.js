/* Import express and other dependencies */
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

/* Within app we call the top-level function exported by express module */
const app = express();

/* Set "app" to listen on a specified port */
const PORT = process.env.PORT || 8081;

/* Initialize middlewares */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("body-parser").json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* Set up the home route via GET */
app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "public/index.html"))
);

/* Set up a fallback 404 route */
app.get("*", (req, res) => {
    res.status(404).send("<h1>Error 404: Resource not found<h1>");
});

/* Launch the server on specified PORT and print a log */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
