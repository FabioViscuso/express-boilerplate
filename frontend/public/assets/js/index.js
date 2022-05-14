/* Main form class */
class ContactRequest {
    constructor(
        fullName,
        phone,
        email,
        message,
        userJob,
        contactMethod,
        agreement
    ) {
        [this.firstName, this.lastName, ...this.otherNames] =
            fullName.split(" ");
        this.phone = phone;
        this.email = email;
        this.message = message;
        this.userJob = userJob;
        this.contactMethod = contactMethod;
        this.hasAgreedTerms = agreement;
    }

    sendToServer() {
        fetch("http://127.0.0.1:8080/data", {
            method: "post",
            body: JSON.stringify(this),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((e) => console.log(e));
    }

    logs() {
        console.table(this);
        console.log(`Serialized: `, JSON.stringify(this));
    }
}

/* Home form submit button and logic */
const submitButton = document.querySelector("#homeDemoFormSubmit");

submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    const form = document.querySelector("#homeDemoForm");
    /* Check the validity of inputs */
    const isFormValid = form.checkValidity();
    if (!isFormValid) {
        /* If form is not valid, use the usual way to report it to the user */
        form.reportValidity();
    } else {
        /* Populating the form */
        const modalRequest = new ContactRequest(
            document.getElementById("homeDemoFormFullName").value,
            document.getElementById("homeDemoFormEmail").value,
            document.getElementById("homeDemoFormPhone").value,
            document.getElementById("homeDemoFormMessageBox").value,
            document.getElementById("homeDemoFormJobSelect").value,
            document.getElementById("homeDemoFormContactMethod").value,
            document.getElementById("homeDemoFormAgreement").checked
        );

        /* Logging */
        modalRequest.logs();

        /* Sending to server */
        modalRequest.sendToServer();

        /* Resetting the form */
        form.reset();
    }
});

function deleteDataFromServer(keyValue) {
    fetch("http://127.0.0.1:8080/data", {
        method: "delete",
        body: JSON.stringify({ key: keyValue }),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((e) => console.log(e));
}

function getDataFromServer() {
    fetch("http://127.0.0.1:8080/data")
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((e) => console.log(e));
}
