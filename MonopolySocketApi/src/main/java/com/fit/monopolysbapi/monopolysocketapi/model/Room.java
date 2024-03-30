package com.fit.monopolysbapi.monopolysocketapi.model;

import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    private String id;
    private String name;
    private String password;
    private List<User> users;

    public boolean havePassword(){
        if (password==null) return false;
        return !password.isEmpty();
    }

    @Override
    public String toString() {
        return "Room{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                ", users=" + users +
                '}';
    }
}
