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

    public String getOnlineUserByNick(String name) {
        for(Map.Entry<String,String> items : this.getOnlineUsers().entrySet()){
            if(items.getValue().equals(name)){
                return items.getKey();
            }
        }
        return null;
    }

    public void removeUserByUserName(String name){
        this.onlineUsersMap.values().remove(name);
    }
}
