async function GetUsers() {
    const response = await fetch("/api/users", {
        method: "GET",
        headers: {"Accept": "application/json"}
    });

    if (response.ok) {
        const users = await response.json();
        let rows = document.querySelector("tbody");
        users.forEach(user =>{
            rows.append(row(user));
        });
    }
}

async function GetUser(id) {
    const response = await fetch("/api/users/" + id, {
        method: "GET",
        headers: {"Accept": "application/json"}
    });
    if (response.ok) {
        const user = await response.json();
        const form = document.forms["userForm"];
        form.elements["id"].value = user._id;
        form.elements["name"].value = user.name;
        form.elements["age"].value = user.age;
    }
}

async function CreateUser(userName, userAge) {

    const response = await fetch("/api/users", {
        method: "POST",
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        body: JSON.stringify({
            name: userName,
            age: parseInt(userAge, 10)
        })
    });

    if (response.ok) {
        const user = await response.json();
        console.log(user);
        reset();
        document.querySelector("tbody").append(row(user));
    }
}

async function EditUser(userId, userName, userAge) {
    const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: userId,
            name: userName,
            age: parseInt(userAge, 10)
        })
    });

    if (response.ok) {
        const user = await response.json();
        reset();
        document.querySelector("tr[data-rowid='" + user._id + "']").replaceWith(row(user));
    }
}

async function DeleteUser(id) {
    const response = await fetch("/api/users/" + id, {
        method: "DELETE",
        headers: {"Accept": "application/json"}
    });
    if (response.ok) {
        const user = await response.json();
        document.querySelector("tr[data-rowid='" + id + "']").remove();
    }
}

function reset() {
    const form = document.forms["userForm"];
    form.reset();
    form.elements["id"].value = 0;
}

function row(user) {
    
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", user._id);

    const idTd = document.createElement("td");
    idTd.append(user._id);
    tr.append(idTd);

    const nameTd = document.createElement("td");
    nameTd.append(user.name);
    tr.append(nameTd);

    const ageTd = document.createElement("td");
    ageTd.append(user.age);
    tr.append(ageTd);

    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", user._id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Изменить");
    editLink.addEventListener("click", e => {
        e.preventDefault();
        GetUser(user._id);
    });

    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", user._id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Удалить");
    removeLink.addEventListener("click", e => {
        
        e.preventDefault();
        DeleteUser(user._id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

const resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", function(e) {
    e.preventDefault();
    reset();
});

document.forms["userForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["userForm"];
    const id = form.elements["id"].value;
    const name = form.elements["name"].value;
    const age = form.elements["age"].value;

    if (id == 0)
        CreateUser(name, age);
    else
        EditUser(id, name, age);
})

document.addEventListener("DOMContentLoaded", () => {
    GetUsers();
} )