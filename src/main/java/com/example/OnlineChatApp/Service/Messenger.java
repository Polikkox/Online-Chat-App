package com.example.OnlineChatApp.Service;

import com.example.OnlineChatApp.Model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class Messenger {

    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public Messenger(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void pushInfoImpl(String url, Message message) {
        if (simpMessagingTemplate != null) {
            simpMessagingTemplate.convertAndSend(url, message);
        }
    }

    public void pushInfoImpl(String url, Map<String, String> message) {
        if (simpMessagingTemplate != null) {
            simpMessagingTemplate.convertAndSend(url, message);
        }
    }

    public void pushInfoImpl(String url, String message) {
        if (simpMessagingTemplate != null) {
            simpMessagingTemplate.convertAndSend(url, message);
        }
    }

    public void pushInfoToUser(String name, String url, Message message) {
        if (simpMessagingTemplate != null) {
            simpMessagingTemplate.convertAndSendToUser(name, url, message);
        }
    }
}
