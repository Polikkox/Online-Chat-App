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
        addNameToWebSite(JSON.parse(JSON.stringify(message.body)));
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
        }, 20));
}

function addNameToWebSite(login) {
    name = login;
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
    stompClient.send("/backend-point/chat", {}, JSON.stringify({'message': $("#message").html()}));
    $("#message").html("");
}

function prepareAndHandleSession() {
    const loadData = new Promise((resolve, reject) => {
        let result = stompClient.subscribe('/subscription/getSession', function (message) {
            session = JSON.stringify(message.body);
            session = JSON.parse(session);
            result.unsubscribe();
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
    let lock = true;
    stompClient.subscribe('/welcome/onlineUsers', function (message) {
        lock = false;
        handleOnlineUsers(JSON.parse(message.body));
    });

    const loadData = new Promise((resolve, reject) => {
        stompClient.send("/backend-point/getUsers", {});
        resolve();
    });
    //In case of unexpected behaviour related with missing message
    loadData.then(
        () =>   setTimeout(function(){
            if (lock){
                stompClient.send("/backend-point/getUsers", {});
            }
        }, 20));

}

function handleOnlineUsers(onlineUsers){
    $("#online tr").remove();
    let archivedMessagesArePulled = false;

    for(let key in onlineUsers) {
        if(onlineUsers[key] !== name) {
            $("#online").append("<tr><td class='hover' id=" + onlineUsers[key] + ">" + onlineUsers[key] + "</td.atrr></tr>");
        }

        $("#" + onlineUsers[key]).click(
            function () {
                sendPersonalMessage((onlineUsers[key]));
                addUsersOnlineDiv(onlineUsers[key]);
                sendMessageIfEnterPressed(onlineUsers[key]);
                if(!archivedMessagesArePulled){
                    loadArchivedMessages(onlineUsers[key]);
                    archivedMessagesArePulled= true;
                }
            }
        );
    }
}

function sendPersonalMessage(message1){
    $("#send").unbind();
    $("#send").click(function() {
        stompClient.send("/backend-point/personal-chat", {}, JSON.stringify({'from': message1, 'message': $("#message").html()}));
        let mesg = {id: message1, from: "Me", message: $("#message").html()};
        addSelfSentMessageAfterSendingToAnotherUser(JSON.parse(JSON.stringify(mesg)));
        soundSendingMessage();
        $("#message").html("");
    });

}

function sendMessageIfEnterPressed(user) {

    $(document).unbind('keypress');
    $(document).on('keypress',function(e) {

        if(e.which == 13) {
            stompClient.send("/backend-point/personal-chat", {}, JSON.stringify({'from': user, 'message': $("#message").html()}));
            let mesg = {id: user, from: "Me", message: $("#message").html()};
            addSelfSentMessageAfterSendingToAnotherUser(JSON.parse(JSON.stringify(mesg)));
            soundSendingMessage();
            $("#message").html("")
        }
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
    handleNewestField(onlineUsers);
    onFileUploadEvent(onlineUsers);
}

function onFileUploadEvent(user) {
    $('#inputFileToLoad').removeAttr('disabled');
    $("body").on('change', '#inputFileToLoad', function () {
        encodeImageFileAsURL(user)
    })
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
    soundReceivedMessage();
    updateScroll();
}

function handleNewestField(name) {
    sendPersonalMessage(name);
    sendMessageIfEnterPressed(name);
    onFileUploadEvent(name);
    $(".copyGlobal").addClass('not-visible');
    $(".copyGlobal" + name).removeClass('not-visible');

    $(".copy-div").removeClass('active-card');
    $("#copydiv" + name).addClass('active-card');
}

function loadArchivedMessages(client) {
    let result = stompClient.subscribe('/archive/chatLoad' + session, function (message) {
        pushArchivedMessagesToConversation(message, client);
        result.unsubscribe();
    });
    stompClient.send("/backend-point/chat-history", {}, JSON.stringify({'from': client}));
}

function pushArchivedMessagesToConversation(message, client) {
    if(JSON.parse(message.body) == null){
        return;
    }
    message = JSON.parse(message.body);
    for(let i = 0; i < message.length; i++){
        if(message[i].login === name){
            $("#copyGlobalDiv" + client).append("<tr class='tr-user-title'><td class='user-title'><div class='style-td'>" + "Me" + "</div></td><td class='date'><div class='style-td'>" + message[i].time + "</div></td></tr><tr class='tr-user-message'><td>" + message[i].message +"</td></tr>");
        }
        else{
            $("#copyGlobalDiv" + client).append("<tr class='tr-user-title'><td class='user-title'><div class='style-td'>" + message[i].login + "</div></td><td class='date'><div class='style-td'>" + message[i].time + "</div></td></tr><tr class='tr-user-message'><td>" + message[i].message +"</td></tr>");

        }
    }
    updateScroll();
}

function disconnect() {
    $(".status-online").attr('class', 'status-offline');
    if (stompClient != null) {
        stompClient.send("/backend-point/deleteUser", {}, JSON.stringify({'message': $("#message").html()}));
        stompClient.disconnect();
    }
    setConnected(false);
}

function updateScroll(){
    $('.tr-user-message').last().get(0).scrollIntoView();

}

function soundReceivedMessage() {
    let sound = new Audio('../sounds/to-the-point.mp3');
    sound.play();
}

function soundSendingMessage() {
    let sound = new Audio('../sounds/stairs.mp3');
    sound.play();
}

function encodeImageFileAsURL(address) {
    let filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0) {
        let fileToLoad = filesSelected[0];

        let fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent) {
            let srcData = fileLoadedEvent.target.result; // <--- data: base64

            let newImage = document.createElement('img');
            newImage.src = srcData;

            document.getElementById("imgTest").innerHTML = newImage.outerHTML;

            let file = document.getElementById("imgTest").innerHTML;
            sendFile(file, address)
        };
        fileReader.readAsDataURL(fileToLoad);
    }
}

function sendFile(file, address){
    sendFileIfEnterClicked(address, file);
    $(".send-file").unbind();
    $(".send-file").click(function() {
        stompClient.send("/backend-point/personal-chat", {}, JSON.stringify({'from': address, 'message': file}));
        let mesg = {id: address, from: "Me", message: file};
        addSelfSentMessageAfterSendingToAnotherUser(JSON.parse(JSON.stringify(mesg)));// to check!!!
        soundSendingMessage();
        $("#imgTest").html("");
        file = "";
    });
}

function sendFileIfEnterClicked(user, file) {

    $(document).unbind('keypress');
    $(document).on('keypress',function(e) {

        if(e.which == 13) {
            stompClient.send("/backend-point/personal-chat", {}, JSON.stringify({'from': user, 'message': file}));
            let mesg = {id: user, from: "Me", message: file};
            addSelfSentMessageAfterSendingToAnotherUser(JSON.parse(JSON.stringify(mesg)));
            soundSendingMessage();
            $("#imgTest").html("");
            file = "";
        }
    });
}