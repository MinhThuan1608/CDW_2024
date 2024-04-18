package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.OnlineService;
import com.fit.monopolysbapi.monopolysocketapi.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class OnlineController {
    private final OnlineService onlineService;
    private final RoomService roomService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/user/online")
    @SendTo("/topic/user/online")
    public List<UserResponse> getUsers(Message message) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        UserResponse userResponse = user.getUserResponse();
        Room room = roomService.getRoomUserIn(user.getId());
        if (room != null && room.isPlaying()) userResponse.setStatus(UserResponse.Status.IN_GAME);
        else if (room != null) userResponse.setStatus(UserResponse.Status.IN_ROOM);
        else userResponse.setStatus(UserResponse.Status.ONLINE);
        onlineService.addUser(userResponse);
        return onlineService.getOnlineUsers();
    }

    @EventListener
    public void handleSessionConnectEvent(SessionConnectEvent event) {

    }

    @EventListener
    public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        if (user != null) {
            onlineService.removeUser(user);
//            roomService.leaveAllRoom(user);
            simpMessagingTemplate.convertAndSend("/topic/user/online", onlineService.getOnlineUsers());
        }
    }
}
