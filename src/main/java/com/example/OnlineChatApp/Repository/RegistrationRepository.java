package com.example.OnlineChatApp.Repository;

import com.example.OnlineChatApp.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<User, Long> {
}
