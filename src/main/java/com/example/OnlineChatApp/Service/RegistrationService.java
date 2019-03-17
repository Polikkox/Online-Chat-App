package com.example.OnlineChatApp.Service;

import com.example.OnlineChatApp.Model.User;
import com.example.OnlineChatApp.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegistrationService {

    private UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public RegistrationService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public User registerUser(String login, String psw) {
        User user = new User();
        user.setUsername(login);
        user.setPassword(bCryptPasswordEncoder.encode(psw));
        this.userRepository.save(user);
        return user;
    }

    public boolean loginExist(String login){
        if(this.userRepository.findByUsername(login) == null){
            return false;
        }
        return true;
    }

    public boolean passwordIsValid(String psw, String pswRepeat){
        return psw.equals(pswRepeat);
    }
}
