package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
public class WebController {

	@MessageMapping("/chat")
	@SendTo("/subscription/room")
	public Message pushMessage(Message message, Principal principal) throws Exception {
		return new Message(message.getMessage(), principal.getName());
	}
}
