
var stompClient = null;
var reconnect = false;
var stomp1 = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#room").html("");
}

function connect() {
    var socket = new SockJS('/stomp-endpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.send("/backend-point/add-session", {});

        stompClient.subscribe('/subscription/room', function (message) {
            showMessage(JSON.parse(message.body));
        });
        stompClient.subscribe('/welcome/onlineUsers', function (message) {
            handleOnlineUsers(JSON.parse(message.body));
        });
        stompClient.send("/backend-point/getUsers", {});

    });
}
function checkIfClientIsReconnecting(message) {
    if(JSON.stringify("true") === message){
        reconnect = true;
    }
}

function disconnect() {
    if (stompClient != null) {
        stompClient.send("/backend-point/deleteUser", {}, JSON.stringify({'message': $("#message").val()}));
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    stompClient.send("/backend-point/chat", {}, JSON.stringify({'message': $("#message").val()}));
    $("#message").val("");
}

function showMessage(message) {
    console.log(message);
    $("#room").append("<tr><td>" + message.from + "</td> <td>" + message.message +"</td></tr>");
}

function handleOnlineUsers(onlineUsers){
    $("#online tr").remove();
    console.log("handle online users");
    // var users = message.onlineUsers;
    console.log(onlineUsers);
    console.log("/handle online users");
    for(var key in onlineUsers){
        $("#online").append("<tr><td>" + onlineUsers[key]  + "</td></tr>");
    }

}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    establishConnectionWithFirstStomp();
});

function establishConnectionWithFirstStomp() {
    var socket1 = new SockJS('/cc');
    stomp1 = Stomp.over(socket1);
    stomp1.connect({}, function (frame) {
        stomp1.subscribe('/check-session/validate', function(message){
            checkIfClientIsReconnecting(JSON.stringify(message.body));
            handleClientConnection();
            stomp1.disconnect();
        });
        stomp1.send("/backend-point/check", {});
    });

}
function handleClientConnection() {
    if(reconnect){
        connect();
    }
    else{
        $( "#connect").click(function() { connect(); });
    }
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendMessage(); });
}