package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.CreateRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.request.JoinRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.RoomResponse;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final Util util;
    private List<Room> rooms = new ArrayList<>();

    public RoomResponse createRoom(CreateRoomRequest message, User owner) {
//        if (isRoomExistsByName(message.getRoomName())) return null;
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
        if (oRoom.isEmpty()) return null;
        return oRoom.get();
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public boolean isRoomExistsByName(String name) {
        return rooms.stream().anyMatch(room -> room.getName().equals(name));
    }

    public boolean isRoomExistsById(String id) {
        return rooms.stream().anyMatch(room -> room.getId().equals(id));
    }

    public List<RoomResponse> getRoomsResponse() {
        return rooms.stream().map(room ->
                RoomResponse.builder().id(room.getId()).roomName(room.getName()).numUser(room.getUsers().size())
                        .havePass(room.havePassword()).build()).collect(Collectors.toList());
    }

    public boolean checkJoinRoom(JoinRoomRequest request) {
        Room room = getRoomById(request.getRoomId());
        if (room == null) return false;
        if (room.havePassword() && !room.getPassword().equals(request.getPassword())) return false;
        if (room.getUsers().size() > 1) return false;
        return true;
    }

    public void joinRoom(User user, String id) {
        Room room = getRoomById(id);
        if (room == null) return;
        List<User> users = room.getUsers();
        if (users.stream().noneMatch(u -> u.getId().equals(user.getId()))) {
            users.add(user);
            room.setUsers(users);
        }
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

    public void leaveAllRoom(User user) {
        rooms.forEach(room -> {
            List<User> users = room.getUsers();
            users.removeIf(u -> u.getId().equals(user.getId()));
            if (users.size() == 0) rooms.remove(room);
            else room.setUsers(users);
        });
    }

    public boolean isUserInRoom(String userId, String roomId) {
        Room room = getRoomById(roomId);
        if (room == null) return false;
        return room.getUsers().stream().anyMatch(u -> u.getId().equals(userId));
    }

    public RoomResponse roomToRoomResponse(Room room) {
        return RoomResponse.builder().roomName(room.getName()).numUser(room.getUsers().size())
                .id(room.getId()).havePass(room.havePassword()).build();
    }

    public void deleteRoom(String id) {
        rooms.removeIf(room -> room.getId().equals(id));
    }

}
