package com.example.OnlineChatApp.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
// These are endpoints the client can subscribes to.
        config.enableSimpleBroker("/subscription", "/welcome", "/check-session", "/user", "queue", "/get-name", "/archive");
// Message received with one of those below destinationPrefixes will be automatically router to controllers @MessageMapping
        config.setApplicationDestinationPrefixes("/backend-point");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/stomp-endpoint", "/cc").withSockJS();
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(2000000); // default : 64 * 1024
        registration.setSendTimeLimit(1000 * 10000); // default : 10 * 10000
        registration.setSendBufferSizeLimit(10* 512 * 1024); // default : 512 * 1024

    }
}