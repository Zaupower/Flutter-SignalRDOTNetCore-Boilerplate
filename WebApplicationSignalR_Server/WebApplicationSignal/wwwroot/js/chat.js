"use strict";

var token = sessionStorage.getItem("access_token");
var connection = new signalR.HubConnectionBuilder().withUrl("/Chat", {
    accessTokenFactory: () => token
}).build();


function AddMessage(message) {
    var li = document.createElement("li");
    li.textContent = message;
    document.getElementById("messagesList").appendChild(li);
}

function GetString(id) {
    document.getElementById(id).value;
}
connection.on("ReceiveMessage", function (user, message) {
    AddMessage(user + " says " + message);
});

connection.on("ReceiveGroupMessage", function (user, message) {
    AddMessage(user + " says " + message);
    ClearTyping();
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});


//Adicionado por marcelo
document.getElementById("enterButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var groupName = document.getElementById("groupInput").value;
    connection.invoke("AddToGroup", groupName, user).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

//Adicionado por marcelo
document.getElementById("exitButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var groupInput = document.getElementById("groupInput").value;
    var userToSend = document.getElementById("usertosend")
    connection.invoke("RemoveFromGroup", groupInput, user).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

//Adicionado por Marcelo
document.getElementById("messageInput").addEventListener("input", function (evt) {
    var user = document.getElementById("userInput").value;
    connection.invoke("Typing", user).catch(function (err) {
        return console.error(err.toString());
    });
});

document.getElementById("groupSendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    var groupInput = document.getElementById("groupInput").value;
    var userToSend = document.getElementById("usertosend")
    connection.invoke("SendMessageGroup", groupInput, user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
    document.getElementById("messageInput").value = "";
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    var userToSend = document.getElementById("usertosend")
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
    document.getElementById("messageInput").value = "";
    ClearTyping();
});