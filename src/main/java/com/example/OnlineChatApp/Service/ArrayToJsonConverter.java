package com.example.OnlineChatApp.Service;

import com.example.OnlineChatApp.Model.ChatArchive;
import org.springframework.stereotype.Service;

import javax.json.*;
import java.util.List;

@Service
public class ArrayToJsonConverter {

    public String convertArrayToJson(List<ChatArchive> chatList){

        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        for(ChatArchive chat : chatList){
            JsonObjectBuilder chatBuilder = Json.createObjectBuilder();
            JsonObject jsObject = chatBuilder.add("login", chat.getlogin())
                    .add("time", chat.getTime())
                    .add("message", chat.getMessage())
                    .build();
            arrayBuilder.add(jsObject);

        }
        return arrayBuilder.build().toString();
    }
}
