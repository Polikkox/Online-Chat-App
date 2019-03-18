package com.example.OnlineChatApp.Model;


import org.hibernate.annotations.Columns;

import javax.persistence.*;

@Entity
public class ChatArchive {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idChat;

    @Lob
    @Column
    private String message;
    private String login;
    private String sTime;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.ALL})
    @JoinColumn(name= "idConversation")
    private Conversation conversation;

    public ChatArchive(String message, String login, String sTime, Conversation idConversation) {
        this.message = message;
        this.login = login;
        this.sTime = sTime;
        this.conversation = idConversation;
    }

    public ChatArchive(String message, String login, String sTime) {
        this.message = message;
        this.login = login;
        this.sTime = sTime;
    }

    public ChatArchive() {
    }

    public Long getIdChat() {
        return idChat;
    }

    public void setIdChat(Long idChat) {
        this.idChat = idChat;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getlogin() {
        return login;
    }

    public void setlogin(String login) {
        this.login = login;
    }

    public String getTime() {
        return sTime;
    }

    public void setTime(String time) {
        this.sTime = time;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }
}
