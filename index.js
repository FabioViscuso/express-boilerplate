/* Add .env support */
require("dotenv").config({ path: "./.env" });

/* Import express and other dependencies */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

/* Within app we call the top-level function exported by express module */
const app = express();

/* Initialize middleware */
/* parse application/x-www-form-urlencoded */
app.use(express.urlencoded({ extended: true }));
/* parse application/json */
app.use(express.json());
/* enable cors */
app.use(cors());

/* Import model(s) */
const ContactRequest = require("./models/contactRequest");

/* Connect to DB */
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connection to mongoDB successful");
    })
    .catch((err) => {
        console.error("Connection to mongoDB failed: ", err);
    });

/* Set up the home route via GET */
app.get("/", (req, res) => res.send("Server online"));

/*---------------- CRUD ENDPOINTS ----------------*/

/* Create new contact */
app.post("/contact/new", async (req, res) => {
    /* Create an object based on the model with data taken from the request */
    const contactEntry = await new ContactRequest({ ...req.body });
    console.log(contactEntry);
    /* Save in remote DB */
    await contactEntry
        .save()
        /* Send back the object for logging */
        .then((data) => res.redirect(`/contact/${data._id}`))
        .catch((err) => console.log(err));
});

/* Read single contact by ID */
app.get("/contact/:id", async (req, res) => {
    const id = req.params.id;
    await ContactRequest.findById(id)
        .then((result) => res.send(result))
        .catch((err) => console.log(err.message));
});

/* Read contacts */
app.get("/contact", async (req, res) => {
    await ContactRequest.find({})
        .then((result) => res.send(result))
        .catch((err) => console.log(err.message));
});

/* Updated contact(s) */
app.patch("/contact/update", async (req, res) => {
    await ContactRequest.findOneAndUpdate(req.body[0], req.body[1], {
        runValidators: true,
    })
        .then((data) => res.redirect(`/contact/${data._id}`))
        .catch((err) => res.send(err));
});

/* Updated contact(s) */
app.patch("/contact/:id/update", async (req, res) => {
    const id = req.params.id;
    await ContactRequest.findByIdAndUpdate(id, req.body, {
        runValidators: true,
    })
        .then((data) => res.redirect(`/contact/${data._id}`))
        .catch((err) => res.send(err));
});

/* Delete contact(s) */
app.delete("/contact/delete", async (req, res) => {
    await ContactRequest.findOneAndDelete(req.body)
        .then(() => res.redirect(`/contact`))
        .catch((err) => res.send(err));
});

/* Launch the server on specified PORT and print a log */
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
