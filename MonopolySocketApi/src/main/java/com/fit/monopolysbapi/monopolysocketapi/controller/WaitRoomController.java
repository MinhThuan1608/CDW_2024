package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.WaitRoomMessage;
import com.fit.monopolysbapi.monopolysocketapi.request.CreateRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.request.JoinRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.AbstractResponse;
import com.fit.monopolysbapi.monopolysocketapi.response.RoomResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Date;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class WaitRoomController {

    private final RoomService roomService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/room/create")
    public ResponseEntity createRoom(@RequestBody CreateRoomRequest request, Authentication authentication){
        User user = (User) authentication.getPrincipal();
        RoomResponse newRoom = roomService.createRoom(request, user);
        System.out.println(newRoom);
        simpMessagingTemplate.convertAndSend( "/topic/room/get-all", roomService.getRoomsResponse());
        return ResponseEntity.ok(new AbstractResponse(200, "Create room successfully", newRoom));
    }

    @GetMapping("/room/all")
    public ResponseEntity getRooms(){
        return ResponseEntity.ok(new AbstractResponse(200, "Get room successfully", roomService.getRoomsResponse()));
    }

    @PostMapping("/room/join")
    public ResponseEntity joinRoom(@RequestBody JoinRoomRequest request, Authentication authentication){
        User user = (User) authentication.getPrincipal();
        if (roomService.checkJoinRoom(request)) {
            roomService.joinRoom(user, request.getRoomId());
            simpMessagingTemplate.convertAndSend( "/topic/room/get-all", roomService.getRoomsResponse());
            return ResponseEntity.ok(new AbstractResponse(200, "Join room successfully", true));
        }
        return ResponseEntity.ok(new AbstractResponse(200, "Join room fail", false));
    }

    @MessageMapping("/game/room/{roomId}")
    public void waitRoom(@Payload WaitRoomMessage waitRoomMessage, @DestinationVariable String roomId, Message message){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        Room room = roomService.getRoomById(roomId);
        WaitRoomMessage newMessage = null;
        switch (waitRoomMessage.getMessageType()) {
            case JOIN:
                newMessage = WaitRoomMessage.builder()
                        .users(room.getUsers()).messageType(WaitRoomMessage.RoomMessageType.JOIN)
                        .createAt(new Date()).sender(user).build();
                break;
            case LEAVE:
                roomService.leaveRoom(user, roomId);
                newMessage = WaitRoomMessage.builder()
                        .users(room.getUsers()).messageType(WaitRoomMessage.RoomMessageType.LEAVE)
                        .createAt(new Date()).sender(user).build();
                break;
            case MESSAGE:

                break;
            case START_GAME:

                break;
            default:
                break;
        }
        simpMessagingTemplate.convertAndSend("/topic/game/room/"+roomId, newMessage);

    }




}
