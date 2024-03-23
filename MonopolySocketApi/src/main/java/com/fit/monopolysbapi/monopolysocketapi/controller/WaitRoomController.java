package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.CreateRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.request.JoinRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.RoomResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class WaitRoomController {

    private final RoomService roomService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/room/create")
    @SendTo("/topic/room/get-all")
    public List<RoomResponse> createRoom(@Payload CreateRoomRequest request, Message message){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        Room newRoom = roomService.createRoom(request, user);
//        System.out.println("room: "+ newRoom);
        System.out.println("room id: " + newRoom.getId());
        simpMessagingTemplate.convertAndSendToUser(user.getId(), "/topic/join-room", newRoom.getId());
        return roomService.getRoomsResponse();
    }

    @MessageMapping("/room/get-all")
    @SendTo("/topic/room/get-all")
    public List<RoomResponse> getRooms(){
        return roomService.getRoomsResponse();
    }

    @MessageMapping("/room/join")
    public void joinRoom(@Payload JoinRoomRequest request, Message message){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        if (roomService.checkJoinRoom(request)) roomService.joinRoom(user, request.getRoomId());
    }



}
