package com.fit.monopolysbapi.monopolysocketapi.response;

import com.fit.monopolysbapi.monopolysocketapi.model.Avatar;
import com.fit.monopolysbapi.monopolysocketapi.model.Role;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String username;
    private Avatar avatar;
    private long money;
    private boolean isConfirmEmail;
    private boolean isNonLocked;
    private Role role;
    private String token;
    private Status status;
    private long exp;
    private Date lastLoginDate;

    public enum Status{
        ONLINE, IN_ROOM, IN_GAME
    }

    @Override
    public String toString() {
        return "UserResponse{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", avatar=" + avatar +
                ", isConfirmEmail=" + isConfirmEmail +
                ", isNonLocked=" + isNonLocked +
                ", role=" + role +
                ", token='" + token + '\'' +
                '}';
    }
}
