package com.example.OnlineChatApp.Model;


import java.util.List;

public class Message {
    private String message;
    private String from;
    private List<String> onlineUsers;

    public Message(){}
    public Message(String message, String from) {
        this.message = message;
        this.from = from;
    }

    public Message(String message, String from, List<String> onlineUsers) {
        this.message = message;
        this.from = from;
        this.onlineUsers = onlineUsers;
    }



    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public List<String> getOnlineUsers() {
        return onlineUsers;
    }


    public void setOnlineUsers(List<String> onlineUsers) {
        this.onlineUsers = onlineUsers;
    }
}
