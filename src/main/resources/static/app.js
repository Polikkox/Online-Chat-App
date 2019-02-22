
var stompClient = null;
var name = null;

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
        stompClient.subscribe('/subscription/room', function (message) {
            showMessage(JSON.parse(message.body));
        });
        stompClient.subscribe('/welcome/onlineUsers', function (message) {
            handleOnlineUsers(JSON.parse(message.body));
        });
        stompClient.send("/backend-point/getUsers", {});

    });
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
    console.log("herre");
    console.log(message);
    console.log("herre");
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
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendMessage(); });


});