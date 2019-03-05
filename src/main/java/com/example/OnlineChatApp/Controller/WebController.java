package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Model.Message;
import com.example.OnlineChatApp.Service.LoggedUserHandler;
import com.example.OnlineChatApp.Service.Messenger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
public class WebController {

    private Messenger messenger;
    private LoggedUserHandler loggedUserHandler;

    @Autowired
    public WebController(Messenger messenger, LoggedUserHandler loggedUserHandler) {
        this.messenger = messenger;
        this.loggedUserHandler = loggedUserHandler;
    }


    @MessageMapping("/personal-chat")
    public void sendPersonalMessage(Message message, Principal principal){
        String sessionID = this.loggedUserHandler.getOnlineUserByNick(message.getFrom());
        Message message1 = new Message();
        System.out.println(principal.getName());
        message1.setFrom(principal.getName());
        message1.setMessage(message.getMessage());
        this.messenger.pushInfoImpl("/subscription/" + sessionID, message1);
    }



	@MessageMapping("/chat")
	@SendTo("/subscription/room")
	public Message pushMessage(Message message, Principal principal) throws Exception {
		return new Message(message.getMessage(), principal.getName());
	}
}
