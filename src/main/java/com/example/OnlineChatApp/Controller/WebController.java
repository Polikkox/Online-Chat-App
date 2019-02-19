package com.example.OnlineChatApp.Controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebController {

    @MessageMapping("/join")
    @SendTo("/subscribe-clients")
    public Message greetingMessage(User user){
        return new Message("Hello " + user.getName());
    }
}
