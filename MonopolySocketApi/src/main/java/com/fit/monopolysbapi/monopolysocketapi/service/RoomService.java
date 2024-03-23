package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Room;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.request.CreateRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.request.JoinRoomRequest;
import com.fit.monopolysbapi.monopolysocketapi.response.RoomResponse;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import com.fit.monopolysbapi.monopolysocketapi.util.UserUtil;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final Util util;
    private final UserUtil userUtil;
    private List<Room> rooms = new ArrayList<>();

    public Room createRoom(CreateRoomRequest message, User owner){
        if (isRoomExistsByName(message.getRoomName())) return null;
        String id = util.generateId();
        while (isRoomExistsById(id)) id = util.generateId();
        String password = message.getPassword().equals("")?null:message.getPassword();
        List<User> users = new ArrayList<>();
        users.add(owner);
        Room room = Room.builder().id(id).name(message.getRoomName()).password(password).users(users).build();
        rooms.add(room);
        return room;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public boolean isRoomExistsByName(String name){
        return rooms.stream().anyMatch(room -> room.getName().equals(name));
    }

    public boolean isRoomExistsById(String id){
        return rooms.stream().anyMatch(room -> room.getId().equals(id));
    }

    public List<RoomResponse> getRoomsResponse(){
        return rooms.stream().map(room -> RoomResponse.builder().id(room.getId()).roomName(room.getName()).numUser(room.getUsers().size()).build()).collect(Collectors.toList());
    }

    public boolean checkJoinRoom(JoinRoomRequest request){
        Optional<Room> oRoom = rooms.stream().filter(r -> r.getId().equals(request.getRoomId())).findFirst();
        if (oRoom.isEmpty()) return false;
        Room room = oRoom.get();
        if (!room.getPassword().equals(request.getPassword())) return false;
        if (room.getUsers().size()>3) return false;
        return true;
    }

    public void joinRoom(User user, String id){
        Optional<Room> oRoom = rooms.stream().filter(r -> r.getId().equals(id)).findFirst();
        if (oRoom.isEmpty()) return;
        Room room = oRoom.get();
        List<User> users = room.getUsers();
        users.add(user);
        room.setUsers(users);
    }
}
