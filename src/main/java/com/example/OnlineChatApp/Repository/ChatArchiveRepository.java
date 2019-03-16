package com.example.OnlineChatApp.Repository;

import com.example.OnlineChatApp.Model.ChatArchive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatArchiveRepository extends JpaRepository<ChatArchive, Long> {
    List<ChatArchive> findChatArchiveByConversation_IdConversation(Long id);
}
