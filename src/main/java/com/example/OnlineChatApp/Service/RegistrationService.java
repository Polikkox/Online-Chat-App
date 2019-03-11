package com.example.OnlineChatApp.Service;

import com.example.OnlineChatApp.Model.User;
import com.example.OnlineChatApp.Repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegistrationService {

    private RegistrationRepository registrationRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public RegistrationService(RegistrationRepository registrationRepository,
                               BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.registrationRepository = registrationRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public boolean registerUser(String username, String psw, String pswRepeat) {
        if(passwordIsValid(psw, pswRepeat)){
            User user = new User();
            user.setUsername(username);
            user.setPassword(bCryptPasswordEncoder.encode(psw));
            this.registrationRepository.save(user);
            return true;
        }
        return false;

    }

    private boolean passwordIsValid(String psw, String pswRepeat){
        return psw.equals(pswRepeat);
    }
}
