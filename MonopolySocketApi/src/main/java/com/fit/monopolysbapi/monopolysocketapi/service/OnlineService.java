package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OnlineService {
    private List<UserResponse> userInServer = new ArrayList<>();

    public List<UserResponse> getOnlineUsers() {
        return userInServer;
    }

    public void addUser(UserResponse user) {
        if (userInServer.stream().noneMatch(u -> user.getId().equals(u.getId()))) {
            System.out.println(user);
            userInServer.add(user);
        }
    }

    public void removeUser(User user) {
        System.out.println("rm user: " + user);
        if (userInServer.size() > 0)
            userInServer.removeIf(u -> u.getId().equals(user.getId()));
    }
}
