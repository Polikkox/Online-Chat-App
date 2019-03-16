package com.example.OnlineChatApp.Model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idConversation;

    private String client1;
    private String client2;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "idConversation")
    private List<ChatArchive> chat = new ArrayList<>();

    public Conversation() {
    }

    public Conversation(String client1, String client2, List<ChatArchive> chat) {
        this.client1 = client1;
        this.client2 = client2;
        this.chat = chat;
    }

    public Long getIdConversation() {
        return idConversation;
    }

    public void setIdConversation(Long idConversation) {
        this.idConversation = idConversation;
    }

    public String getClient1() {
        return client1;
    }

    public void setClient1(String client1) {
        this.client1 = client1;
    }

    public String getClient2() {
        return client2;
    }

    public void setClient2(String client2) {
        this.client2 = client2;
    }

    public List<ChatArchive> getChat() {
        return chat;
    }

    public void setChat( List<ChatArchive> chat) {
        this.chat = chat;
    }
}
