var stompClient = null;
var reconnect = false;
var stomp1 = null;
let session = null;
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
        console.log("49");
        prepareAndHandleSession();
        console.log("50");
        subscribeRoom();
        console.log("51");
        subscribeOnlineUsers();
        console.log("52");
    });
}

function subscribeRoom(){
    stompClient.subscribe('/subscription/room', function (message) {
        showMessage(JSON.parse(message.body));
    });
}

function subscribeOnlineUsers(){
    stompClient.subscribe('/welcome/onlineUsers', function (message) {
        handleOnlineUsers(JSON.parse(message.body));
    });
    stompClient.send("/backend-point/getUsers", {});
}

async function demo3() {

    await sleep(10000);

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function prepareAndHandleSession() {
    const loadSession = new Promise((resolve, reject) => {
        stompClient.subscribe('/subscription/getSession', function (message) {
            session = JSON.stringify(message.body);
            session = JSON.parse(session);
            resolve()
        });
        stompClient.send("/backend-point/add-session", {});
    });
    loadSession.then(
        () => dealWithSessionToReceivingMessages())
}

function sessionRequest() {
    return new Promise((resolve) => {
        stompClient.subscribe('/subscription/getSession', function (message) {
            session = JSON.parse(JSON.stringify(message.body));
            resolve();
            console.log("request1");
        });
        stompClient.send("/backend-point/add-session", {});
        console.log('request2')
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
    $("#copyGlobalDiv").append("<tr><td>" + message.from + "</td> <td>" + message.message +"</td></tr>");
    updateScroll();
}

function addMessageReceivedFromAnotherUser(message) {
    var personalCard = document.getElementById("copyGlobalDiv" + message.from);

    if(personalCard === null){
        addUsersOnlineDiv(message.from);
    }
    $("#copyGlobalDiv" + message.from).append("<tr><td>" + message.from + "</td> <td>" + message.message +"</td></tr>");
    updateScroll();
}

function addSelfSentMessageAfterSendingToAnotherUser(message) {
    $("#copyGlobalDiv" + message.id).append("<tr><td>" + message.from + "</td> <td>" + message.message +"</td></tr>");
    updateScroll();
}

function handleOnlineUsers(onlineUsers){
    $("#online tr").remove();

    for(let key in onlineUsers) {
        if(onlineUsers[key] !== name) {
            $("#online").append("<tr><td id=" + onlineUsers[key] + ">" + onlineUsers[key] + "</td.atrr></tr>");
        }
            $("#" + onlineUsers[key]).click(
                function () {
                    sendPersonalMessage((onlineUsers[key]));
                    addUsersOnlineDiv(onlineUsers[key]);
                    addGlobalChatListener();
                }
            )
    }
}

function addUsersOnlineDiv(onlineUsers) {

    if($("#copydiv" + onlineUsers).length === 0){
        let $clone = $(".copy-div").last().clone();
        $clone.attr('id', 'copydiv' + onlineUsers);
        $clone.show();
        $clone.html(onlineUsers);
        $clone.appendTo($(".row1"));
        addUsersMessageField($clone, onlineUsers);
    }
}

function addUsersMessageField(user, name) {
    prepareMessagesDiv(name);
    user.click(
        () => {
            sendPersonalMessage(name);
            $(".copyGlobal").addClass('not-visible');
            $(".copyGlobal" + name).removeClass('not-visible');

            $(".copy-div").removeClass('active-card');
            $("#copydiv" + name).addClass('active-card');
        }
    );
}

function prepareMessagesDiv(name) {

    let $clone = $(".copyGlobal").first().clone();
    $clone.addClass('copyGlobal' + name +' not-visible');
    $clone.find('tbody').html("");
    $clone.find('.tbodyClass').attr('id', 'copyGlobalDiv' + name);
    $clone.appendTo($('.global'));
}

function sendPersonalMessage(nameOfSender){

    let sendSelector = $("#send");
    let messageSelector = $("#message");
    sendSelector.unbind();
    sendSelector.click(function() {
        stompClient.send("/backend-point/personal-chat", {}, JSON.stringify({'from': nameOfSender, 'message': messageSelector.val()}));
        let messg = {id: nameOfSender, from: "Me", message: messageSelector.val()};
        addSelfSentMessageAfterSendingToAnotherUser(JSON.parse(JSON.stringify(messg)));
        messageSelector.val("");
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
        const loadSession = new Promise((resolve) => {
            stomp1.subscribe('/check-session/validate', function(message){
                checkIfClientIsReconnecting(JSON.stringify(message.body));
                resolve();
            });
            stomp1.send("/backend-point/check", {});

        });
        loadSession.then(
            () => getLoginFromServer(stomp1))
    });
}

function checkUserSessionID() {
    return new Promise((resolve) => {
        stomp1.subscribe('/check-session/validate', function(message){
            checkIfClientIsReconnecting(JSON.stringify(message.body));
            console.log("6");
            resolve();

        });
        stomp1.send("/backend-point/check", {});
        console.log("5");
    });
}

function getLoginFromServer(stomp1) {
    console.log("7");
    stomp1.subscribe('/get-name/login', function(message){
        console.log("8");
        addLoginToWebsite(JSON.stringify(message.body));
        console.log("9");
        handleClientConnection();
        console.log("10");
        stomp1.disconnect();
    });
    console.log("20");
    stomp1.send("/backend-point/name", {});
    console.log("21");
}

function addLoginToWebsite(login) {
    name = JSON.parse(login);
    $('#hello-name').html('Hello ' + name + '!');
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

function dealWithSessionToReceivingMessages(){
   console.log("3");
    stompClient.subscribe('/subscription/' + session, function (message) {
        addMessageReceivedFromAnotherUser(JSON.parse(message.body));
    });
}

function updateScroll(){
    $('.text-row').scrollTop();
}

function addGlobalChatListener() {
    $("#copy-global-id").click(
        function () {
            $(".copyGlobal").addClass('not-visible');
            $("#copy-id").removeClass('not-visible');
        }
    );
}