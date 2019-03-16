package com.example.OnlineChatApp.Controller;

import com.example.OnlineChatApp.Model.Chat;
import com.example.OnlineChatApp.Model.Message;
import com.example.OnlineChatApp.Service.ChatHistoryService;
import com.example.OnlineChatApp.Service.LoggedUserHandler;
import com.example.OnlineChatApp.Service.Messenger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.security.Principal;
import java.util.List;

@Controller
public class WebController {

    private Messenger messenger;
    private LoggedUserHandler loggedUserHandler;
    private ChatHistoryService chatHistoryService;

    @Autowired
    public WebController(Messenger messenger, LoggedUserHandler loggedUserHandler, ChatHistoryService chatHistoryService) {
        this.messenger = messenger;
        this.loggedUserHandler = loggedUserHandler;
        this.chatHistoryService = chatHistoryService;
    }


    @MessageMapping("/personal-chat")
    public void sendPersonalMessage(Message message, Principal principal){
        String secondPerson = message.getFrom();
        String sessionID = this.loggedUserHandler.getOnlineUserByNick(secondPerson);
        Message message1 = new Message();
        String nameOfClientRequesting = principal.getName();
        message1.setFrom(nameOfClientRequesting);
        message1.setMessage(message.getMessage());
        this.chatHistoryService.archiveChatHistory(nameOfClientRequesting, secondPerson, message.getMessage());
        this.messenger.pushInfoImpl("/subscription/" + sessionID, message1);

    }



	@MessageMapping("/chat")
	@SendTo("/subscription/room")
	public Message pushMessage(Message message, Principal principal) throws Exception {
		return new Message(message.getMessage(), principal.getName());
	}

	@MessageMapping("/chat-history")
    public void getChatHistory(Message message, Principal principal){
       String nameOfClientRequesting = principal.getName();
       String secondPerson = message.getFrom();
       String sessionID = this.loggedUserHandler.getOnlineUserByNick(nameOfClientRequesting);
       List<Chat> archivedMessages = this.chatHistoryService.findArchivedChatHistory(nameOfClientRequesting, secondPerson);
       this.messenger.pushInfoImpl("/archive/chatLoad" + sessionID, archivedMessages);

    }
}
