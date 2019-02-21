package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Model.Message;
import com.example.OnlineChatApp.Service.HandleLogInUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import java.security.Principal;


@Controller
public class WebController {

	private HandleLogInUser handleLogInUser;

	@MessageMapping("/chat")
	@SendTo("/subscription/room")
	public Message greeting(Message message, Principal principal) throws Exception {
		Message newMessage = new Message(message.getMessage(), principal.getName());
	    return newMessage;
	}

	@MessageMapping("/getUsers")
	@SendTo("/welcome/onlineUsers")
	public Message sendOnlineUsers(Principal principal){
		this.handleLogInUser.addUserToList(principal.getName());
		Message messageNew = new Message("dfdf","sad");
		messageNew.setOnlineUsers(handleLogInUser.getUsersList());
		return  messageNew;
	}

	@EventListener
	public void onSocketConnected(SessionConnectedEvent event) {
		StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
		System.out.println("[Connected] " + sha.getSessionId());
	}

	@EventListener
	public void onSocketDisconnected(SessionDisconnectEvent event) {
		StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
		System.out.println("[Disonnected] " + sha.getSessionId());
	}


	@Autowired
	public void setHandleLogInUser(HandleLogInUser handleLogInUser) {
		this.handleLogInUser = handleLogInUser;
	}
}
