package com.example.OnlineChatApp.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
// These are endpoints the client can subscribes to.
        config.enableSimpleBroker("/subscription", "/welcome", "/check-session", "/user", "queue", "/get-name");
// Message received with one of those below destinationPrefixes will be automatically router to controllers @MessageMapping
        config.setApplicationDestinationPrefixes("/backend-point");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/stomp-endpoint", "/cc").withSockJS();
    }
}