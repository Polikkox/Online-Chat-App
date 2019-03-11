package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Model.Message;
import com.example.OnlineChatApp.Service.LoggedUserHandler;
import com.example.OnlineChatApp.Service.Messenger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.socket.messaging.*;

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
        String sessionID = userDetails.substring(userDetails.indexOf("SessionId:") + 11, userDetails.lastIndexOf("; Not granted"));
        String name = event.getUser().getName();
        System.out.println("[Connected] " + name + " [Session ID] " + sessionID);
    }




    @EventListener
    public void onSocketDisconnected(SessionDisconnectEvent event) {
        String userDetails = event.getMessage().getHeaders().get("simpUser").toString();
        String sessionID = userDetails.substring(userDetails.indexOf("SessionId:") + 11, userDetails.lastIndexOf("; Not granted"));
        String name = event.getUser().getName();
//        this.loggedUserHandler.removeUserBySessionID(sessionID);
        this.messenger.pushInfoImpl("/welcome/onlineUsers", this.loggedUserHandler.getOnlineUsers());
    }

//
//    @EventListener
//    public void onApplicationEvent(ApplicationEvent appEvent) {
//
//            AuthenticationSuccessEvent event = (AuthenticationSuccessEvent) appEvent;
//            UserDetails userDetails = (UserDetails) event.getAuthentication().getPrincipal();
//
//            RequestContextHolder.currentRequestAttributes().getSessionId();
//            String user = userDetails.getUsername();
//            System.out.println(user);
//            System.out.println(RequestContextHolder.currentRequestAttributes().getSessionId());
//
//        }

}




