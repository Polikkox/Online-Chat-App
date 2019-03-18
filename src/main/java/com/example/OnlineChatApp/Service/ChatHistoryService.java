package com.example.OnlineChatApp.Service;

import com.example.OnlineChatApp.Model.ChatArchive;
import com.example.OnlineChatApp.Model.Conversation;
import com.example.OnlineChatApp.Repository.ChatArchiveRepository;
import com.example.OnlineChatApp.Repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.TimeZone;

@Service
public class ChatHistoryService {

    private ChatArchiveRepository chatArchiveRepository;
    private ConversationRepository conversationRepository;

    @Autowired
    public ChatHistoryService(ChatArchiveRepository chatArchiveRepository, ConversationRepository conversationRepository) {
        this.chatArchiveRepository = chatArchiveRepository;
        this.conversationRepository = conversationRepository;
    }
    @Transactional
    public void archiveChatHistory(String client1, String client2, String message){

        Conversation conversation;
        if(checkIfConversationAlreadyCreated(client1, client2)){
           conversation = getConversations(client1, client2);
        }
        else if(checkIfConversationAlreadyCreated(client2, client1)){
            conversation = getConversations(client2, client1);
        }
        else{
            conversation = new Conversation();
            conversation.setClient1(client1);
            conversation.setClient2(client2);
        }

        ChatArchive chat = new ChatArchive();
        chat.setMessage(message);
        chat.setlogin(client1);
        chat.setTime(date());
        conversation.getChat().add(chat);
        this.conversationRepository.save(conversation);
    }
    @Transactional
    public Conversation getConversations(String client1, String client2){
        return this.conversationRepository.findConversationByClient1AndClient2(client1, client2);
    }

    private boolean checkIfConversationAlreadyCreated(String client1, String client2){
        return this.conversationRepository.existsByClient1AndClient2(client1, client2);
    }

    private String date(){
        Timestamp stamp = new Timestamp(System.currentTimeMillis());
        Date date = new Date(stamp.getTime());
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy h:mm:ss a");
        sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
        return sdf.format(date);
    }
    @Transactional
    public List<ChatArchive> findArchivedChatHistory(String client1, String client2) {
        Conversation conversation = this.conversationRepository.findConversationByClient1AndClient2(client1, client2);
        if(conversation != null){
            Long idOfConversationRoom = conversation.getIdConversation();
            List<ChatArchive> chatList = this.chatArchiveRepository.findChatArchiveByConversation_IdConversation(idOfConversationRoom);
            return chatList;
        }

        conversation = this.conversationRepository.findConversationByClient1AndClient2(client2, client1);
        if(conversation != null){
            Long idOfConversationRoom = conversation.getIdConversation();
            List<ChatArchive> chatList = this.chatArchiveRepository.findChatArchiveByConversation_IdConversation(idOfConversationRoom);
            return chatList;
        }
        return null;
    }

}
