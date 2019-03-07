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


        demo();
        console.log('Connected: ' + frame);
        demo3()


    });
}
function subscribeRoom(){

}
function subscribeOnlineUsers(){

    stompClient.subscribe('/welcome/onlineUsers', function (message) {
        handleOnlineUsers(JSON.parse(message.body));
    });

    stompClient.send("/backend-point/getUsers", {});
}
function demo3() {

    // const loadData = new Promise((resolve, reject) => {
    //     stompClient.subscribe('/subscription/room', function (message) {
    //         showMessage(JSON.parse(message.body));
    //         alert("yo before");
    //         resolve();
    //         alert("yo afert");
    //     });
    //     stompClient.send("/backend-point/add-session", {});
    // });
    // loadData.then(
    //     () => alert("yo"));
    // alert("wtf");
    subscribeOnlineUsers();
}


function demo() {
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

function subscribeSession() {
    stompClient.subscribe('/subscription/getSession', function (message) {
        session = JSON.stringify(message.body);
        session = JSON.parse(session);
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
    $("#copyGlobalDiv").append("<tr><td>" + message.from + "</td> <td>" + message.message +"</td></tr>");
    updateScroll();
}
function showMessage2(message) {
    var personalCard = document.getElementById("copyGlobalDiv" + message.from);

    if(personalCard === null){
        addUsersOnlineDiv(message.from);
    }
    handleNewestField(message.from);

    $("#copyGlobalDiv" + message.from).append("<tr><td>" + message.from + "</td> <td>" + message.message +"</td></tr>");
    updateScroll();
}
function showMessage3(message) {
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
           handleNewestField(name)
        }
    );
}
function handleNewestField(name) {
    sendPersonalMessage(name);
    $(".copyGlobal").addClass('not-visible');
    $(".copyGlobal" + name).removeClass('not-visible');

    $(".copy-div").removeClass('active-card');
    $("#copydiv" + name).addClass('active-card');
}

function prepareMessagesDiv(name) {

    let $clone = $(".copyGlobal").first().clone();
    $clone.addClass('copyGlobal' + name +' not-visible');
    $clone.find('tbody').html("");
    $clone.find('.tbodyClass').attr('id', 'copyGlobalDiv' + name);
    $clone.appendTo($('.global'));
}

function sendPersonalMessage(message1){

    $("#send").unbind();
    $("#send").click(function() {
        stompClient.send("/backend-point/personal-chat", {}, JSON.stringify({'from': message1, 'message': $("#message").val()}));
        var mesg = {id: message1, from: "Me", message: $("#message").val()};
        showMessage3(JSON.parse(JSON.stringify(mesg)));
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
        const loadData = new Promise((resolve, reject) => {
            stomp1.subscribe('/check-session/validate', function(message){
                checkIfClientIsReconnecting(JSON.stringify(message.body));
                resolve();
            });
            stomp1.send("/backend-point/check", {});

        });
        loadData.then(
            () => subscribeGetName(stomp1))
    });

}

function subscribeGetName(stomp1) {
    stomp1.subscribe('/get-name/login', function(message){
        const loadData = new Promise((resolve, reject) => {
            getName(JSON.stringify(message.body));
            alert(1);
            resolve();
        });
        alert(2);
        loadData.then(
            () => handleClientConnection().then(     alert(4))

        );
        alert(5);
        loadData.then(
            () => stomp1.disconnect().then(     alert(6))
        );
    });
    stomp1.send("/backend-point/name", {});
}
function getName(login) {
    name = JSON.parse(login);
    $('#hello-name').html('Hello ' + name + '!');
}
function handleClientConnection() {
    alert(3);
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
        showMessage2(JSON.parse(message.body));
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