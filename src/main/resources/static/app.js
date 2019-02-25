
var stompClient = null;
var stompClient3 = null;
var reconnect = false;
var stomp1 = null;
let session = null;
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


        demo();
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
    subscribeSession();
    await sleep(30);
    dealWithSession();
}

function subscribeSession() {
    stompClient.subscribe('/subscription/getSession', function (message) {
        session = JSON.stringify(message.body);
        session = JSON.parse(session);
        console.log("sssssss" + session);

    });
    stompClient.send("/backend-point/add-session", {});
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
    console.log("here");
    console.log(message);
    $("#room").append("<tr><td>" + message.from + "</td> <td>" + message.message +"</td></tr>");
    updateScroll();
}

function handleOnlineUsers(onlineUsers){
    $("#online tr").remove();

    for(let key in onlineUsers) {
        $("#online").append("<tr><td id=" + onlineUsers[key] + ">" + onlineUsers[key] + "</td.atrr></tr>");
        $("#" + onlineUsers[key]).click(
           function () { sendPersonalMessage((onlineUsers[key]))
           }
       )
    }
}

function sendPersonalMessage(message1){
    $("#send").unbind();
    $("#send").click(function() {
        stompClient.send("/backend-point/personal-chat", {}, JSON.stringify({'from': message1, 'message': $("#message").val()}));
        $("#message").val("");
    });

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

function dealWithSession(){
    stompClient.subscribe('/subscription/' + session, function (message) {
        showMessage(JSON.parse(message.body));
    });
}


function updateScroll(){
    $('.text-row').scrollTop($('.text-row')[0].scrollHeight);
}