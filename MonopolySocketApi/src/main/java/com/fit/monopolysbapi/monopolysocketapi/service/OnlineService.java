package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OnlineService {
    private List<UserResponse> userInServer = new ArrayList<>();

    public List<UserResponse> getOnlineUsers() {
        return userInServer;
    }

    public void addUser(UserResponse user) {
        if (userInServer.stream().noneMatch(u -> user.getId().equals(u.getId()))) {
            userInServer.add(user);
        }
    }

    public void removeUser(User user) {
        if (userInServer.size() > 0)
            userInServer.removeIf(u -> u.getId().equals(user.getId()));
    }

    public void setStatus(String userId, UserResponse.Status status){
        UserResponse userResponse = null;
        Optional<UserResponse> userOptional = userInServer.stream().filter(u -> u.getId().equals(userId)).findFirst();
        if (userOptional.isPresent()) userResponse = userOptional.get();
        userResponse.setStatus(status);
    }
}
