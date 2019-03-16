package com.example.OnlineChatApp.Repository;

import com.example.OnlineChatApp.Model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    boolean existsByClient1AndClient2(String client1, String client2);
    Conversation findConversationByClient1AndClient2(String client1, String client2);
}
