package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.model.chessGame.GameBoard;
import com.fit.monopolysbapi.monopolysocketapi.request.CreateRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.request.JoinRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.RoomResponse;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final Util util;
    @Getter
    private List<Room> rooms = new ArrayList<>();
    private Queue<User> userQueue = new LinkedList<>();

    public RoomResponse createRoom(CreateRoomRequest message, User owner) {
        String id = util.generateId();
        while (isRoomExistsById(id)) id = util.generateId();
        String password = message.getPassword().equals("") ? null : message.getPassword();
        List<User> users = new ArrayList<>();
        users.add(owner);
        Room room = Room.builder().id(id).name(message.getRoomName()).password(password)
                .users(users).createAt(new Date()).build();
        rooms.add(room);
        return roomToRoomResponse(room);
    }

    public Room getRoomById(String id) {
        Optional<Room> oRoom = rooms.stream().filter(r -> r.getId().equals(id)).findFirst();
        return oRoom.orElse(null);
    }

    public boolean isRoomExistsByName(String name) {
        return rooms.stream().anyMatch(room -> room.getName().equals(name));
    }

    public boolean isRoomExistsById(String id) {
        return rooms.stream().anyMatch(room -> room.getId().equals(id));
    }

    public List<RoomResponse> getRoomsResponse() {
        return rooms.stream().map(Room::getRoomResponse).collect(Collectors.toList());
    }

    public boolean checkJoinRoom(JoinRoomRequest request) {
        Room room = getRoomById(request.getRoomId());
        if (room == null) return false;
        if (room.havePassword() && !room.getPassword().equals(request.getPassword())) return false;
        if (room.getUsers().size() > 1) return false;
        return true;
    }

    public Room getRoomUserIn(String userId) {
        Optional<Room> roomOptional = rooms.stream().filter(r -> r.getUsers().stream().anyMatch(u -> u.getId().equals(userId))).findFirst();
        return roomOptional.orElse(null);
    }

    public void joinRoom(User user, String id) {
        Room room = getRoomById(id);
        if (room == null) return;
        List<User> users = room.getUsers();
        if (users.stream().noneMatch(u -> u.getId().equals(user.getId()))) {
            Room otherRoom = getRoomUserIn(user.getId());
            if (otherRoom != null) leaveRoom(user, room.getId());
            users.add(user);
            room.setUsers(users);
        }
    }

    public String quickJoinRoom(User user) {
//        if (!user.isConfirmEmail()) return "INVALID_MAIL";
        if (userQueue.isEmpty()) {
            System.out.println("hàng đơi chua có ai");
            userQueue.add(user);
            if (!rooms.isEmpty()) {
                User user1 = userQueue.peek();
                for (Room room : rooms) {
                    if (!room.havePassword() && room.getUsers().size() < 2 && !isUserInRoom(user1.getId(), room.getId())) {
                        joinRoom(user1, room.getId());
                        System.out.println("hàng đợi va phòng r==============");
                        System.out.println(userQueue);
                        userQueue.poll();
                        return room.getId();
                    }
                }
            }
        } else if(!userQueue.contains(user)) {
            //        nếu hag đợi đang có người
            System.out.println("tạo phòng moiws 2 ng");
            User owner = userQueue.poll();
            String roomName = "QR" + owner.getId();
            RoomResponse roomResponse = createRoom(CreateRoomRequest.builder().roomName(roomName).password("").build(),
                    owner);
            joinRoom(user, roomResponse.getId());
            System.out.println("============tạo phog moi===========");
            System.out.println(userQueue);
            return roomResponse.getId();

        }
        System.out.println("=========ko có phong nao phu họp==============");
        System.out.println(userQueue);
        return null;

    }

    public void leaveRoom(User user, String id) {
        Room room = getRoomById(id);
        if (room == null) return;
        List<User> users = room.getUsers();
        users.removeIf(u -> u.getId().equals(user.getId()));
        if (users.size() == 0) rooms.remove(room);
        else room.setUsers(users);
    }

    public void kickUser(User owner, String roomId) {
        Room room = getRoomById(roomId);
        if (room == null && getRoomById(roomId).getUsers().size() < 2) return;
        if (owner.getId().equals(getRoomById(roomId).getUsers().get(0).getId()))
            leaveRoom(getRoomById(roomId).getUsers().get(1), roomId);
    }


    public boolean isUserInRoom(String userId, String roomId) {
        Room room = getRoomById(roomId);
        if (room == null) return false;
        return room.getUsers().stream().anyMatch(u -> u.getId().equals(userId));
    }

    public List<UserResponse> getUserInRoom(String roomId) {
        return getRoomById(roomId).getUsers().stream().map(User::getUserResponse).toList();
    }

    public RoomResponse roomToRoomResponse(Room room) {
        return RoomResponse.builder().roomName(room.getName()).numUser(room.getUsers().size())
                .id(room.getId()).havePass(room.havePassword()).build();
    }

    public void deleteRoom(String id) {
        rooms.removeIf(room -> room.getId().equals(id));
    }

    public void startGame(Room room, int timeOfTurn) {
        GameBoard gameBoard = new GameBoard(timeOfTurn);
        room.setGameBoard(gameBoard);
        room.setPlaying(true);
    }

    @Bean
    public SimpleDateFormat getSimpleDateFormat() {
        return new SimpleDateFormat("HH:mm");
    }

}
