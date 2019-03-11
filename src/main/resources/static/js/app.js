let stompClient = null;
let reconnect = false;
let initialStompClient = null;
let session = null;
let name = null;


$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    establishConnectionWithFirstStomp();
});

function establishConnectionWithFirstStomp() {
    let initialSocket = new SockJS('/cc');
    initialStompClient = Stomp.over(initialSocket);
    initialStompClient.connect({}, function (frame) {
        const loadData = new Promise((resolve, reject) => {
            initialStompClient.subscribe('/check-session/validate', function(message){
                checkIfClientIsReconnecting(JSON.stringify(message.body));
                resolve();
            });
            initialStompClient.send("/backend-point/check", {});

        });

        loadData.then(
            () => getName(initialStompClient))
    });
}

function checkIfClientIsReconnecting(message) {
    if(JSON.stringify("true") === message){
        reconnect = true;
    }
}

function getName(initialStompClient) {
    let lock = true;

    initialStompClient.subscribe('/get-name/login', function(message) {
        lock = false;
        addNameToWebSite(JSON.parse(message.body));
        handleClientConnection();
        initialStompClient.disconnect();
    });

    const loadData = new Promise((resolve, reject) => {
        initialStompClient.send("/backend-point/name");
        resolve();
    });
    //In case of unexpected behaviour related with missing message
    loadData.then(
        () =>   setTimeout(function(){
            if (lock){
                initialStompClient.send("/backend-point/name");
            }
        }, 100));
}

function addNameToWebSite(login) {
    name = login.message;
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

function connect() {
    $(".status-offline").attr('class', 'status-online');
    let socket = new SockJS('/stomp-endpoint');

    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        prepareAndHandleSession();
        subscribeOnlineUsers();
    });
}

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

function sendMessage() {
    stompClient.send("/backend-point/chat", {}, JSON.stringify({'message': $("#message").val()}));
    $("#message").val("");
}

function prepareAndHandleSession() {
    const loadData = new Promise((resolve, reject) => {
        stompClient.subscribe('/subscription/getSession', function (message) {
            session = JSON.stringify(message.body);
            session = JSON.parse(session);
            resolve()
        });
        stompClient.send("/backend-point/add-session", {});
    });
    loadData.then(
        () => dealWithSession());

}

function dealWithSession(){
    stompClient.subscribe('/subscription/' + session, function (message) {
        addMessageReceivedFromAnotherUser(JSON.parse(message.body));
    });
}

function subscribeOnlineUsers(){

    stompClient.subscribe('/welcome/onlineUsers', function (message) {
        handleOnlineUsers(JSON.parse(message.body));
    });

    stompClient.send("/backend-point/getUsers", {});
}

function handleOnlineUsers(onlineUsers){
    $("#online tr").remove();

    for(let key in onlineUsers) {
        if(onlineUsers[key] !== name) {
            $("#online").append("<tr><td class='hover' id=" + onlineUsers[key] + ">" + onlineUsers[key] + "</td.atrr></tr>");
        }
        $("#" + onlineUsers[key]).click(
            function () {
                sendPersonalMessage((onlineUsers[key]));
                addUsersOnlineDiv(onlineUsers[key]);
            }
        )
    }
}

function sendPersonalMessage(message1){

    $("#send").unbind();
    $("#send").click(function() {
        stompClient.send("/backend-point/personal-chat", {}, JSON.stringify({'from': message1, 'message': $("#message").val()}));
        let mesg = {id: message1, from: "Me", message: $("#message").val()};
        addSelfSentMessageAfterSendingToAnotherUser(JSON.parse(JSON.stringify(mesg)));
        $("#message").val("");
    });

}

function addSelfSentMessageAfterSendingToAnotherUser(message) {
    let date = new Date();
    let actualDate = date.getHours() + ":"  + date.getMinutes() + ":" + date.getSeconds();
    $("#copyGlobalDiv" + message.id).append("<tr class='tr-user-title'><td class='user-title'><div class='style-td'>" + message.from + "</div></td><td class='date'><div class='style-td'>" + actualDate + "</div></td></tr><tr class='tr-user-message'><td>" + message.message +"</td></tr>");
    updateScroll();
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
            handleNewestField(name)
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

function addMessageReceivedFromAnotherUser(message) {
    let personalCard = document.getElementById("copyGlobalDiv" + message.from);

    if(personalCard === null){
        addUsersOnlineDiv(message.from);
    }
    handleNewestField(message.from);
    let date = new Date();
    let actualDate = date.getHours() + ":"  + date.getMinutes() + ":" + date.getSeconds();
    $("#copyGlobalDiv" + message.from).append("<tr class='tr-user-title'><td class='user-title'><div class='style-td'>" + message.from + "</div></td><td class='date'><div class='style-td'>" + actualDate + "</div></td></tr><tr class='tr-user-message'><td>" + message.message +"</td></tr>");
    updateScroll();
}

function handleNewestField(name) {
    sendPersonalMessage(name);
    $(".copyGlobal").addClass('not-visible');
    $(".copyGlobal" + name).removeClass('not-visible');

    $(".copy-div").removeClass('active-card');
    $("#copydiv" + name).addClass('active-card');
}

function disconnect() {
    $(".status-online").attr('class', 'status-offline');
    if (stompClient != null) {
        stompClient.send("/backend-point/deleteUser", {}, JSON.stringify({'message': $("#message").val()}));
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function updateScroll(){
    $('.text-row').scrollTop();
}
