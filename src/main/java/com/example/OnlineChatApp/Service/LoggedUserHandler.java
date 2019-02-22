package com.example.OnlineChatApp.Service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoggedUserHandler {
    private Map<String, String> onlineUsersMap = new HashMap<>();

    public void addUserToList(String sessionID, String name){
        this.onlineUsersMap.put(sessionID, name);
    }

    public Map<String, String> getOnlineUsers() {
        return this.onlineUsersMap;
    }
    public void removeUserBySessionID(String sessionID){
        this.onlineUsersMap.remove(sessionID);
    }


    public String getOnlineUserBySessionID(String sessionID) {
        return this.onlineUsersMap.get(sessionID);
    }

    public void removeUserByUserName(String name){
        this.onlineUsersMap.values().remove(name);
    }
}
