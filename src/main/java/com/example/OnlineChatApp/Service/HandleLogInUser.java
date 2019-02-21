package com.example.OnlineChatApp.Service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HandleLogInUser {
    private List<String> usersList = new ArrayList<>();

    public void addUserToList(String name){
        this.usersList.add(name);
    }

    public List<String> getUsersList() {
        return usersList;
    }
}
