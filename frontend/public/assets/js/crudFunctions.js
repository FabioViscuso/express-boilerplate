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
