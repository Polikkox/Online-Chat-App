package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Service.LoggedUserHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
public class UserStateController {

    private LoggedUserHandler loggedUserHandler;

    @MessageMapping("/getUsers")
    @SendTo("/welcome/onlineUsers")
    public Map<String, String> sendConnectedUsers(){
        return loggedUserHandler.getOnlineUsers();
    }

    @MessageMapping("/deleteUser")
    @SendTo("/welcome/onlineUsers")
    public Map<String, String> deleteDisconnectedUser(Principal principal){
        this.loggedUserHandler.removeUserByUserName(principal.getName());
        return this.loggedUserHandler.getOnlineUsers();
    }

    @Autowired
    public void setLoggedUserHandler(LoggedUserHandler loggedUserHandler) {
        this.loggedUserHandler = loggedUserHandler;
    }
}
