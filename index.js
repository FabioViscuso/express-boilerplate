/* Import express and other dependencies */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./.env" });

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

/* Define a Schema, the actual structure that holds your data */
const contactRequestSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true, maxlength: 20 },
    lastName: { type: String, required: true, trim: true, maxlength: 20 },
    age: {
        type: Number,
        required: true,
        min: [18, "Age must be > 18"],
        max: [150, "Age is too high"],
    },
    phone: { type: String, required: true, trim: true, maxlength: 16 },
    email: { type: String, required: true, trim: true, maxlength: 40 },
    contactMethod: {
        type: String,
        required: true,
        enum: ["job-apply", "mail-info", "call-info"],
    },
    userJob: {
        type: String,
        required: true,
        enum: ["developer", "artist", "management"],
    },
    message: {
        type: String,
        required: false,
        default: "no-message",
        trim: true,
    },
    hasAgreedTerms: { type: Boolean, required: true },
    hasBeenContacted: { type: Boolean, required: false, default: false },
});

/* Define a Model, it will pluralized and de-capitalized automatically inside mongo server */
const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);

/* A mongoose "virtual" is, indeed, a virtual property that doesn't really
   exist in the schema, but it's read by a "shadow" getter and written by a
   "shadow" setter. Useful not in DB, but in the mongoose/JS realm */
contactRequestSchema
    .virtual("fullName")
    .get(function () {
        return `${this.firstName} ${this.lastName}`;
    })
    .set(function (name) {
        [this.firstName, this.lastName] = name.split(" ");
    });

/* Schemas can have their own static classes, not available to instances */
contactRequestSchema.statics.updateToNewSchema = function () {
    console.log("placeholder");
};

/* We can define custom methods in our schemas */
contactRequestSchema.methods.contactToggle = function () {
    this.hasBeenContacted = !this.hasBeenContacted;
    /* This returns a promise-like object, then-able in the calling function */
    return this.save();
};

/* Set up the home route via GET */
app.get("/", (req, res) => res.send("Welcome to the backend server!"));

/* CRUD ENDPOINTS ---------------------------------*/

/* Get contact(s) */
app.post("/get-contacts", async (req, res) => {
    const contactsFound = await ContactRequest.findOne({ ...req.body });
    res.json(contactsFound);
});

/* Updated contact(s) */
app.patch("/update-contacts", (req, res) => {
    res.send({ message: "placeholder for PATCH route" });
});

/* Delete contact(s) */
app.delete("/delete-contacts", (req, res) => {
    res.send({ message: "placeholder for DELETE route" });
});

/* Create new contact */
app.post("/new-contact", async (req, res) => {
    /* Create an object based on the model with data taken from the request */
    const contactEntry = await new ContactRequest({ ...req.body });
    console.log(contactEntry);
    /* Save in remote DB */
    contactEntry
        .save()
        /* Send back the object for logging */
        .then((data) => res.status(200).json({ "new saved entry: ": data }))
        .catch((err) => console.log(err));
});

/* Launch the server on specified PORT and print a log */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
