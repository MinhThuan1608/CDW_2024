package com.fit.monopolysbapi.monopolysocketapi.interceptor;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.JoinRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.OnlineService;
import com.fit.monopolysbapi.monopolysocketapi.service.RoomService;
import com.fit.monopolysbapi.monopolysocketapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InBoundChannelInterceptor implements ChannelInterceptor {
    private final OnlineService onlineService;
    private final UserService userService;
    private final RoomService roomService;
    //    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        System.out.println(message);
        String destination = (String) headerAccessor.getHeader("simpDestination");
        System.out.println(destination);
        if (destination!=null && destination.equals("/app/room/join"))  {
            UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
            User user = (User) token.getPrincipal();
            System.out.println(1);
            System.out.println(message.getPayload());
            System.out.println(2);
//            System.out.println(request);
//            if (roomService.checkJoinRoom(request)) roomService.joinRoom(user, request.getRoomId());
//            else return null;
            return message;
        }
        return message;
    }

    @Override
    public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
//        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
//        String destination = accessor.getDestination();
//        SimpMessageType messageType = accessor.getMessageType();
//        if (messageType.equals(SimpMessageType.SUBSCRIBE) && destination.equals("/topic/user/online")) {
//            UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) accessor.getHeader("simpUser");
//            User user = (User) token.getPrincipal();
//            if (user != null) {
//                onlineService.addUser(userService.userToUserResponse(user));
//                Message<List<UserResponse>> notifyMessage = MessageBuilder
//                        .withPayload(onlineService.getOnlineUsers())
//                        .copyHeaders(accessor.toMap())
//                        .build();
//                channel.send(notifyMessage);
////                messagingTemplate.convertAndSend("/topic/user/online", onlineService.getOnlineUsers());
//            }
//        }
    }

}
