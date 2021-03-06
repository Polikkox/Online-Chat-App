package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Service.LoggedUserHandler;
import com.example.OnlineChatApp.Service.Messenger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.request.*;
import java.security.Principal;

@Controller

public class SessionController extends RequestContextListener {

    private Messenger messenger;
    private LoggedUserHandler loggedUserHandler;

    @Autowired
    public SessionController(Messenger messenger, LoggedUserHandler loggedUserHandler) {
        this.messenger = messenger;
        this.loggedUserHandler = loggedUserHandler;
    }

    @MessageMapping("/check")
    public void checkUsersThatAreOnline(Principal principal) throws Exception {
        String data = principal.toString();
        String session = data.substring(data.indexOf("SessionId:") + 11, data.lastIndexOf("; Not granted"));
        if(loggedUserHandler.getOnlineUserBySessionID(session) == null){
            messenger.pushInfoImpl("/check-session/validate", "false");
            return;
        }

        messenger.pushInfoImpl("/check-session/validate", "true");
    }

    @MessageMapping("/name")
    @SendTo("/get-name/login")
    public void sendUserName(Principal principal) throws Exception {
        String data = principal.getName();
        messenger.pushInfoImpl("/get-name/login", data);
    }

    @MessageMapping("/add-session")
    public void createSession(Principal principal) throws Exception {
        String data = principal.toString();
        String session = data.substring(data.indexOf("SessionId:") + 11, data.lastIndexOf("; Not granted"));
        if(this.loggedUserHandler.getOnlineUserByNick(principal.getName()) == null){
            this.loggedUserHandler.addUserToList(session, principal.getName());
        }
        this.messenger.pushInfoImpl("/subscription/getSession", session);
    }
}
