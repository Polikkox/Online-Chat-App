package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Service.LoggedUserHandler;
import com.example.OnlineChatApp.Service.Messenger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.request.*;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.Map;

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
    @SendTo("/check-session/validate")
    public void checkUsersThatAreOnline(Principal principal) throws Exception {
        String data = principal.toString();
        String session = data.substring(data.indexOf("SessionId:") + 11, data.lastIndexOf("; Granted"));
        if(loggedUserHandler.getOnlineUserBySessionID(session) == null){
            messenger.pushInfoImpl("/check-session/validate", "false");
            return;
        }
        messenger.pushInfoImpl("/check-session/validate", "true");
    }

    @MessageMapping("/add-session")
    @SendTo("/check-session/create-session")
    public void createSession(Principal principal) throws Exception {
        String data = principal.toString();
        String session = data.substring(data.indexOf("SessionId:") + 11, data.lastIndexOf("; Granted"));
        this.loggedUserHandler.addUserToList(session, principal.getName());
    }
}
