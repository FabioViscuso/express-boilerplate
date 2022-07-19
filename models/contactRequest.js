const mongoose = require("mongoose");

/* Define a Schema, the actual structure that holds your data */
const contactRequestSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    },
    age: {
        type: Number,
        required: true,
        min: [18, "Age must be > 18"],
        max: [150, "Age is too high"],
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 16
    },
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 40
    },
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
    hasAgreedTerms: {
        type: Boolean,
        required: true
    },
    hasBeenContacted: {
        type: Boolean,
        required: false,
        default: false
    },
});

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

/* Define a Model, it will pluralized and de-capitalized automatically inside mongo server */
const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);

module.exports = ContactRequest;
