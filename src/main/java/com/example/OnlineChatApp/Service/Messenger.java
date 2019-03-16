package com.example.OnlineChatApp.Service;

import com.example.OnlineChatApp.Model.ChatArchive;
import com.example.OnlineChatApp.Model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class Messenger {

    private SimpMessagingTemplate simpMessagingTemplate;
    private ArrayToJsonConverter arrayToJsonConverter;

    @Autowired
    public Messenger(SimpMessagingTemplate simpMessagingTemplate, ArrayToJsonConverter arrayToJsonConverter) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.arrayToJsonConverter = arrayToJsonConverter;
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
    public void pushInfoImpl(String url, List<ChatArchive> message) {
        if (simpMessagingTemplate != null) {
            if(message == null){
                simpMessagingTemplate.convertAndSend(url, "null");
                return;
            }
            simpMessagingTemplate.convertAndSend(url, this.arrayToJsonConverter.convertArrayToJson(message));
        }
    }

    public void pushInfoToUser(String name, String url, Message message) {
        if (simpMessagingTemplate != null) {
            simpMessagingTemplate.convertAndSendToUser(name, url, message);
        }
    }
}
