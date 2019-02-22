package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Service.LoggedUserHandler;
import com.example.OnlineChatApp.Service.Messenger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
public class EventController {

    private LoggedUserHandler loggedUserHandler;
    private Messenger messenger;

    @Autowired
    public EventController(LoggedUserHandler loggedUserHandler, Messenger messenger) {
        this.loggedUserHandler = loggedUserHandler;
        this.messenger = messenger;
    }

    @EventListener
    public void onSocketConnected(SessionConnectedEvent event) {
        String userDetails = event.getMessage().getHeaders().get("simpUser").toString();
        String sessionID = userDetails.substring(userDetails.indexOf("SessionId:") + 11, userDetails.lastIndexOf("; Granted"));
        String name = event.getUser().getName();

        this.loggedUserHandler.addUserToList(sessionID, name);
        System.out.println("[Connected] " + name + " [Session ID] " + sessionID);
    }

    @EventListener
    public void onSocketDisconnected(SessionDisconnectEvent event) {
        String userDetails = event.getMessage().getHeaders().get("simpUser").toString();
        String sessionID = userDetails.substring(userDetails.indexOf("SessionId:") + 11, userDetails.lastIndexOf("; Granted"));
        String name = event.getUser().getName();
        System.out.println("[Disonnected] " +  name + " Session ID " + sessionID);

        this.loggedUserHandler.removeUserBySessionID(sessionID);

        this.messenger.pushInfoImpl("/welcome/onlineUsers", this.loggedUserHandler.getOnlineUsers());
    }
}




