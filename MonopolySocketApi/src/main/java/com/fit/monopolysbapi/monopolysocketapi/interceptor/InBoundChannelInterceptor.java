package com.fit.monopolysbapi.monopolysocketapi.interceptor;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.service.OnlineService;
import com.fit.monopolysbapi.monopolysocketapi.service.RoomService;
import com.fit.monopolysbapi.monopolysocketapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

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
        String destination = (String) headerAccessor.getHeader("simpDestination");
        AntPathMatcher matcher = new AntPathMatcher();
        if (destination != null && matcher.match("/*/game/room/*", destination)) {
            UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
            User user = (User) token.getPrincipal();
            String roomId = destination.substring(destination.lastIndexOf("/")+1);
            if (roomService.isUserInRoom(user.getId(), roomId)) {
                System.out.println("user "+user.getId()+" is in room "+roomId);
                return message;
            }
            System.out.println("user not in room");
            return null;
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
