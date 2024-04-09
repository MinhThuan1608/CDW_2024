package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.InviteMessage;
import com.fit.monopolysbapi.monopolysocketapi.request.WaitRoomMessage;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Date;

@Controller
@EnableScheduling
@RequiredArgsConstructor
public class WaitRoomController {

    private final RoomService roomService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/room/create")
    public ResponseEntity createRoom(@RequestBody CreateRoomRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        RoomResponse newRoom = roomService.createRoom(request, user);
        System.out.println(newRoom);
        simpMessagingTemplate.convertAndSend("/topic/room/get-all", roomService.getRoomsResponse());
        return ResponseEntity.ok(new AbstractResponse(200, "Create room successfully", newRoom));
    }

    @GetMapping("/room/all")
    public ResponseEntity getRooms() {
        return ResponseEntity.ok(new AbstractResponse(200, "Get room successfully", roomService.getRoomsResponse()));
    }

    @PostMapping("/room/join")
    public ResponseEntity joinRoom(@RequestBody JoinRoomRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        if (roomService.checkJoinRoom(request)) {
            roomService.joinRoom(user, request.getRoomId());
            simpMessagingTemplate.convertAndSend("/topic/room/get-all", roomService.getRoomsResponse());
            return ResponseEntity.ok(new AbstractResponse(200, "Join room successfully", true));
        }
        return ResponseEntity.ok(new AbstractResponse(200, "Join room fail", false));
    }

    @GetMapping("/room/{roomId}/get/pass")
    public ResponseEntity getRoomPass(@PathVariable String roomId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        System.out.println("room id: " + roomId);
        System.out.println(roomService.getRooms());
        if (roomService.getRoomById(roomId) != null &&
                (user.getId().equals(roomService.getRoomById(roomId).getUsers().get(0).getId()) ||
                        user.getId().equals(roomService.getRoomById(roomId).getUsers().get(1).getId()))) {
            return ResponseEntity.ok(new AbstractResponse(200, "Get room's password successfully", roomService.getRoomById(roomId).getPassword()));
        }
        return ResponseEntity.ok(new AbstractResponse(200, "Get room's password fail", false));
    }

    @MessageMapping("/game/room/{roomId}")
    public void waitRoom(@Payload WaitRoomMessage waitRoomMessage, @DestinationVariable String roomId, Message message) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        Room room = roomService.getRoomById(roomId);
        WaitRoomMessage newMessage = null;

        switch (waitRoomMessage.getMessageType()) {
            case JOIN:
                newMessage = WaitRoomMessage.builder()
                        .users(room.getUsers()).messageType(WaitRoomMessage.RoomMessageType.JOIN).build();
                break;
            case LEAVE:
                roomService.leaveRoom(user, roomId);
                newMessage = WaitRoomMessage.builder()
                        .users(room.getUsers()).messageType(WaitRoomMessage.RoomMessageType.LEAVE).build();
                break;
            case KICK:
                roomService.kickUser(user, roomId);
                newMessage = WaitRoomMessage.builder()
                        .users(room.getUsers()).messageType(WaitRoomMessage.RoomMessageType.KICK).build();
                break;
            case MESSAGE:
                newMessage = WaitRoomMessage.builder()
                        .users(room.getUsers())
                        .messageType(WaitRoomMessage.RoomMessageType.MESSAGE)
                        .content(waitRoomMessage.getContent())
                        .createAt(new Date())
                        .sender(user).build();
                break;
            case START_GAME:
                if (room.getUsers().size() == 2) {
                    newMessage = WaitRoomMessage.builder()
                            .users(room.getUsers())
                            .messageType(WaitRoomMessage.RoomMessageType.START_GAME)
                            .build();
                    GameBoard gameBoard = new GameBoard();
                    room.setGameBoard(gameBoard);
                }
                break;
            default:
                newMessage = WaitRoomMessage.builder().build();
                break;
        }
        simpMessagingTemplate.convertAndSend("/topic/game/room/" + roomId, newMessage);
    }

    @MessageMapping("/room/invite")
    public void invite(@Payload InviteMessage inviteMessage, Message message){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) headerAccessor.getHeader("simpUser");
        User user = (User) token.getPrincipal();
        simpMessagingTemplate.convertAndSendToUser(inviteMessage.getReceiverId(), "/topic/room/invite",
                InviteMessage.builder().sender(user.getUserResponse()).receiverId(inviteMessage.getReceiverId())
                        .roomId(inviteMessage.getRoomId()).inviteMessageType(inviteMessage.getInviteMessageType())
                        .roomPass(inviteMessage.getRoomPass()).build());

    }

    @Scheduled(fixedRate = 60000)
    public void autoDeleteRoom() {
        if (roomService.getRooms().size() > 0)
            for (int i = 0; i < roomService.getRooms().size(); i++) {
                System.out.println((new Date().getTime() - roomService.getRooms().get(i).getCreateAt().getTime()));
                if ((new Date().getTime() - roomService.getRooms().get(i).getCreateAt().getTime()) > 10 * 60 * 1000) {
                    simpMessagingTemplate.convertAndSend("/topic/game/room/" + roomService.getRooms().get(i).getId(), WaitRoomMessage.builder().messageType(WaitRoomMessage.RoomMessageType.TIME_OUT).build());
                    roomService.deleteRoom(roomService.getRooms().get(i--).getId());
                }
            }
        simpMessagingTemplate.convertAndSend("/topic/room/get-all", roomService.getRoomsResponse());

    }


}
